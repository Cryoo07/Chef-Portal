import express from 'express'
import User from '../models/User.js'
import Recipe from '../models/Recipe.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const chefs = await User.find({ role: 'chef', isActive: true, isApproved: true }).select('-password')
  const chefsWithCounts = await Promise.all(
    chefs.map(async (chef) => {
      const recipeCount = await Recipe.countDocuments({ chef: chef._id, isPublished: true })
      return { ...chef.toObject(), recipeCount }
    })
  )
  res.json(chefsWithCounts)
})

router.get('/:id', async (req, res) => {
  const chef = await User.findOne({ _id: req.params.id, role: 'chef' }).select('-password')
  if (!chef) return res.status(404).json({ message: 'Chef not found' })
  const recipes = await Recipe.find({ chef: chef._id, isPublished: true }).sort({ createdAt: -1 })
  res.json({ chef, recipes })
})

router.post('/:id/follow', protect, authorize('user'), async (req, res) => {
  const chef = await User.findOne({ _id: req.params.id, role: 'chef' })
  if (!chef) return res.status(404).json({ message: 'Chef not found' })
  const isFollowing = chef.followers.some((id) => id.toString() === req.user._id.toString())
  if (isFollowing) {
    chef.followers = chef.followers.filter((id) => id.toString() !== req.user._id.toString())
  } else {
    chef.followers.push(req.user._id)
  }
  await chef.save()
  res.json({ following: !isFollowing, followersCount: chef.followers.length })
})

export default router
