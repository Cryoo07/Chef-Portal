import express from 'express'
import User from '../models/User.js'
import Recipe from '../models/Recipe.js'
import Analytics from '../models/Analytics.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()
router.use(protect, authorize('admin'))

router.get('/users', async (req, res) => {
  const { search = '' } = req.query
  const query = {
    role: 'user',
    $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
  }
  const users = await User.find(query).select('-password').sort({ createdAt: -1 })
  res.json(users)
})

router.put('/users/:id/status', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  user.isActive = req.body.isActive
  await user.save()
  res.json(user.toJSONSafe())
})

router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ message: 'User deleted' })
})

router.get('/recipes', async (req, res) => {
  const { status = 'all', category = 'all', search = '' } = req.query
  const query = {}
  if (status === 'published') query.isPublished = true
  if (status === 'draft') query.isPublished = false
  if (category !== 'all') query.category = category
  if (search) query.title = { $regex: search, $options: 'i' }
  const recipes = await Recipe.find(query).populate('chef', 'name email').sort({ createdAt: -1 })
  res.json(recipes)
})

router.delete('/recipes/:id', async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id)
  res.json({ message: 'Recipe deleted' })
})

router.get('/analytics', async (req, res) => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [users, chefs, recipes, pendingChefRequests, analytics, registrations, recipesByCategory] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'chef', isApproved: true }),
    Recipe.countDocuments({ isPublished: true }),
    User.countDocuments({ 'chefVerification.status': 'pending' }),
    Analytics.find().sort({ date: -1 }).limit(30),
    User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', total: 1, _id: 0 } },
    ]),
    Recipe.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', total: { $sum: 1 } } },
      { $project: { category: '$_id', total: 1, _id: 0 } },
    ]),
  ])

  const topRecipes = await Recipe.find({ isPublished: true })
    .sort({ views: -1 })
    .limit(5)
    .populate('chef', 'name')
    .select('title chef views likes images')

  const topChefs = await Recipe.aggregate([
    { $match: { isPublished: true } },
    {
      $group: {
        _id: '$chef',
        recipeCount: { $sum: 1 },
        totalViews: { $sum: '$views' },
      },
    },
    { $sort: { totalViews: -1 } },
    { $limit: 5 },
  ])

  const chefUsers = await User.find({
    _id: { $in: topChefs.map((item) => item._id) },
  }).select('name avatar speciality')

  const topActiveChefs = topChefs.map((item) => ({
    ...item,
    chef: chefUsers.find((chef) => chef._id.toString() === item._id.toString()),
  }))

  const recentApplications = await User.find({ 'chefVerification.status': 'pending' })
    .sort({ 'chefVerification.requestedAt': -1 })
    .limit(5)
    .select('name email speciality yearsOfExperience socialLinks chefVerification')

  res.json({
    users,
    chefs,
    recipes,
    pendingChefRequests,
    analytics,
    registrations,
    recipesByCategory,
    topRecipes,
    topActiveChefs,
    recentApplications,
  })
})

router.get('/chef-applications', async (req, res) => {
  const { tab = 'pending' } = req.query
  const query = tab === 'approved' ? { role: 'chef', isApproved: true } : { role: 'chef', isApproved: false }
  const requests = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
  res.json(requests)
})

router.put('/approve-chef/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  user.role = 'chef'
  user.isApproved = true
  user.chefVerification.status = 'approved'
  user.chefVerification.reviewedAt = new Date()
  user.chefVerification.reviewedBy = req.user._id
  await user.save()
  res.json(user.toJSONSafe())
})

router.put('/reject-chef/:id', async (req, res) => {
  const { reason = '' } = req.body
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  user.role = 'user'
  user.isApproved = true
  user.chefVerification.status = 'rejected'
  user.chefVerification.rejectedReason = reason
  user.chefVerification.reviewedAt = new Date()
  user.chefVerification.reviewedBy = req.user._id
  await user.save()
  res.json(user.toJSONSafe())
})

router.put('/revoke-chef/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  user.isApproved = false
  user.chefVerification.status = 'pending'
  user.chefVerification.reviewedAt = new Date()
  user.chefVerification.reviewedBy = req.user._id
  await user.save()
  res.json(user.toJSONSafe())
})

router.get('/chef-requests', async (req, res) => {
  const requests = await User.find({ role: 'chef', isApproved: false }).select('-password').sort({ createdAt: -1 })
  res.json(requests)
})

router.put('/chef-requests/:id', async (req, res) => {
  const { action, reason = '' } = req.body
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (action === 'approve') {
    user.role = 'chef'
    user.isApproved = true
    user.chefVerification.status = 'approved'
  } else {
    user.role = 'user'
    user.isApproved = true
    user.chefVerification.status = 'rejected'
    user.chefVerification.rejectedReason = reason
  }
  user.chefVerification.reviewedAt = new Date()
  user.chefVerification.reviewedBy = req.user._id
  await user.save()
  res.json(user.toJSONSafe())
})

export default router
