import express from 'express'
import Recipe from '../models/Recipe.js'
import User from '../models/User.js'
import Analytics from '../models/Analytics.js'
import cloudinary from '../config/cloudinary.js'
import { upload } from '../middleware/upload.js'
import { protect, authorize } from '../middleware/auth.js'
import { requireApproved } from '../middleware/requireApproved.js'
import { getDateKey } from '../utils/helpers.js'

const router = express.Router()

router.post('/upload', protect, authorize('chef'), requireApproved, upload.single('image'), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(503).json({
        success: false,
        code: 'CLOUDINARY_NOT_CONFIGURED',
        message: 'Image upload is not configured on server. Configure Cloudinary credentials in .env.',
      })
    }

    if (!req.file) return res.status(400).json({ message: 'Image file is required' })

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'recipenest/recipes' }, (error, uploaded) => {
        if (error) reject(error)
        else resolve(uploaded)
      })
      stream.end(req.file.buffer)
    })

    res.json({ url: result.secure_url })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/', async (req, res) => {
  const { page = 1, limit = 12, category, difficulty, tags, search, sort = 'newest' } = req.query
  const query = { isPublished: true }
  if (category) query.category = category
  if (difficulty) query.difficulty = difficulty
  if (tags) query.tags = { $in: tags.split(',') }
  if (search) query.title = { $regex: search, $options: 'i' }

  const sortMap = { newest: { createdAt: -1 }, mostLiked: { likes: -1 }, mostViewed: { views: -1 } }
  const skip = (Number(page) - 1) * Number(limit)
  const recipes = await Recipe.find(query)
    .populate('chef', 'name avatar speciality')
    .sort(sortMap[sort] || sortMap.newest)
    .skip(skip)
    .limit(Number(limit))
  const total = await Recipe.countDocuments(query)
  res.json({ recipes, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
})

router.get('/chef/:chefId', async (req, res) => {
  const { includeDrafts = 'false' } = req.query
  const query = { chef: req.params.chefId }
  if (includeDrafts !== 'true') query.isPublished = true
  const recipes = await Recipe.find(query).sort({ createdAt: -1 })
  res.json(recipes)
})

router.get('/mine/list', protect, authorize('chef'), async (req, res) => {
  const recipes = await Recipe.find({ chef: req.user._id }).sort({ createdAt: -1 })
  res.json(recipes)
})

router.get('/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate('chef', 'name avatar speciality')
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' })
  recipe.views += 1
  await recipe.save()
  await Analytics.findOneAndUpdate(
    { recipeId: recipe._id, date: getDateKey() },
    { $inc: { views: 1 } },
    { upsert: true, new: true }
  )
  res.json(recipe)
})

router.post('/', protect, authorize('chef'), requireApproved, async (req, res) => {
  try {
    process.stdout.write(`createRecipe called by: ${req.user?._id}\n`)
    const recipe = await Recipe.create({ ...req.body, chef: req.user._id })
    res.status(201).json(recipe)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/:id', protect, authorize('chef', 'admin'), async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' })
  if (req.user.role !== 'admin' && recipe.chef.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  Object.assign(recipe, req.body)
  await recipe.save()
  res.json(recipe)
})

router.delete('/:id', protect, authorize('chef', 'admin'), async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' })
  if (req.user.role !== 'admin' && recipe.chef.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  await recipe.deleteOne()
  res.json({ message: 'Recipe deleted' })
})

router.post('/:id/like', protect, authorize('user', 'chef'), async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
  const user = await User.findById(req.user._id)
  if (!recipe || !user) return res.status(404).json({ message: 'Not found' })
  const hasLiked = recipe.likes.some((id) => id.toString() === req.user._id.toString())
  if (hasLiked) {
    recipe.likes = recipe.likes.filter((id) => id.toString() !== req.user._id.toString())
    user.likedRecipes = user.likedRecipes.filter((id) => id.toString() !== recipe._id.toString())
  } else {
    recipe.likes.push(req.user._id)
    user.likedRecipes.push(recipe._id)
    await Analytics.findOneAndUpdate(
      { recipeId: recipe._id, date: getDateKey() },
      { $inc: { likes: 1 } },
      { upsert: true, new: true }
    )
  }
  await recipe.save()
  await user.save()
  res.json({ liked: !hasLiked, likesCount: recipe.likes.length })
})

router.post('/:id/save', protect, authorize('user', 'chef'), async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
  const user = await User.findById(req.user._id)
  if (!recipe || !user) return res.status(404).json({ message: 'Not found' })
  const hasSaved = user.savedRecipes.some((id) => id.toString() === recipe._id.toString())
  if (hasSaved) {
    user.savedRecipes = user.savedRecipes.filter((id) => id.toString() !== recipe._id.toString())
    recipe.savedBy = recipe.savedBy.filter((id) => id.toString() !== req.user._id.toString())
  } else {
    user.savedRecipes.push(recipe._id)
    recipe.savedBy.push(req.user._id)
    await Analytics.findOneAndUpdate(
      { recipeId: recipe._id, date: getDateKey() },
      { $inc: { saves: 1 } },
      { upsert: true, new: true }
    )
  }
  await user.save()
  await recipe.save()
  res.json({ saved: !hasSaved, savedCount: recipe.savedBy.length })
})

export default router
