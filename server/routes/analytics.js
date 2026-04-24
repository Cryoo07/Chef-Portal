import express from 'express'
import Analytics from '../models/Analytics.js'
import Recipe from '../models/Recipe.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.get('/overview', protect, authorize('chef', 'admin'), async (req, res) => {
  const recipeQuery = req.user.role === 'chef' ? { chef: req.user._id } : {}
  const recipes = await Recipe.find(recipeQuery)
  const recipeIds = recipes.map((r) => r._id)
  const analyticsQuery = req.user.role === 'chef' ? { recipeId: { $in: recipeIds } } : {}
  const analytics = await Analytics.find(analyticsQuery).sort({ date: 1 })

  const summary = analytics.reduce(
    (acc, item) => {
      acc.views += item.views
      acc.likes += item.likes
      acc.saves += item.saves
      return acc
    },
    { views: 0, likes: 0, saves: 0 }
  )

  res.json({ summary, recipesCount: recipes.length, daily: analytics })
})

router.get('/recipe/:id', protect, authorize('chef', 'admin'), async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' })
  if (req.user.role !== 'admin' && recipe.chef.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  const analytics = await Analytics.find({ recipeId: req.params.id }).sort({ date: 1 })
  res.json({ recipe, analytics })
})

export default router
