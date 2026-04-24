import express from 'express'
import User from '../models/User.js'
import Recipe from '../models/Recipe.js'
import Analytics from '../models/Analytics.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()
router.use(protect, authorize('admin'))

router.get('/users', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query
  const query = {
    $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
  }
  const skip = (Number(page) - 1) * Number(limit)
  const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
  const total = await User.countDocuments(query)
  res.json({ users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
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
  const recipes = await Recipe.find().populate('chef', 'name email').sort({ createdAt: -1 })
  res.json(recipes)
})

router.delete('/recipes/:id', async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id)
  res.json({ message: 'Recipe deleted' })
})

router.get('/analytics', async (req, res) => {
  const [users, chefs, recipes, analytics] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'chef' }),
    Recipe.countDocuments(),
    Analytics.find().sort({ date: -1 }).limit(30),
  ])
  res.json({ users, chefs, recipes, analytics })
})

export default router
