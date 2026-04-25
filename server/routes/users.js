import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import Recipe from '../models/Recipe.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.get('/profile/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
})

router.put(
  '/profile',
  protect,
  [
    body('socialLinks.instagram')
      .optional({ values: 'falsy' })
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('Instagram URL must be valid'),
    body('socialLinks.youtube')
      .optional({ values: 'falsy' })
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('YouTube URL must be valid'),
    body('socialLinks.website')
      .optional({ values: 'falsy' })
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('Website URL must be valid'),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

  const user = await User.findById(req.user._id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  const allowed = ['name', 'avatar', 'bio', 'speciality', 'yearsOfExperience', 'socialLinks']
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field]
  })
  await user.save()
  res.json(user.toJSONSafe())
}
)

router.get('/saved', protect, authorize('user', 'chef'), async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedRecipes',
    populate: { path: 'chef', select: 'name avatar' },
  })
  res.json(user?.savedRecipes || [])
})

router.get('/liked', protect, authorize('user', 'chef'), async (req, res) => {
  const recipes = await Recipe.find({ likes: req.user._id }).populate('chef', 'name avatar')
  res.json(recipes)
})

export default router
