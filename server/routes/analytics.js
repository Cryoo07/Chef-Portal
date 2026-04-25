import express from 'express'
import Analytics from '../models/Analytics.js'
import Recipe from '../models/Recipe.js'
import Comment from '../models/Comment.js'
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

router.get('/chef', protect, authorize('chef'), async (req, res) => {
  if (!req.user.isApproved || req.user.chefVerification?.status !== 'approved') {
    return res.status(403).json({ message: 'Chef account pending approval' })
  }

  const recipes = await Recipe.find({ chef: req.user._id })
  const recipeIds = recipes.map((recipe) => recipe._id)
  const analytics = await Analytics.find({ recipeId: { $in: recipeIds } }).sort({ date: 1 })
  const commentsCount = await Comment.countDocuments({ recipe: { $in: recipeIds } })

  const summary = analytics.reduce(
    (acc, item) => {
      acc.views += item.views
      acc.likes += item.likes
      acc.saves += item.saves
      return acc
    },
    { views: 0, likes: 0, saves: 0 }
  )

  res.json({
    summary: { ...summary, comments: commentsCount },
    recipes,
    daily: analytics,
  })
})

router.get('/chef/recipes', protect, authorize('chef'), async (req, res) => {
  if (!req.user.isApproved || req.user.chefVerification?.status !== 'approved') {
    return res.status(403).json({ message: 'Chef account pending approval' })
  }

  const recipes = await Recipe.find({ chef: req.user._id }).sort({ createdAt: -1 })
  const recipeIds = recipes.map((recipe) => recipe._id)
  const analytics = await Analytics.find({ recipeId: { $in: recipeIds } })
  const commentsByRecipe = await Comment.aggregate([
    { $match: { recipe: { $in: recipeIds } } },
    { $group: { _id: '$recipe', total: { $sum: 1 } } },
  ])

  const byRecipe = recipes.map((recipe) => {
    const recipeStats = analytics.filter((item) => item.recipeId.toString() === recipe._id.toString())
    const commentStats = commentsByRecipe.find((item) => item._id.toString() === recipe._id.toString())
    const totals = recipeStats.reduce(
      (acc, item) => {
        acc.views += item.views
        acc.likes += item.likes
        acc.saves += item.saves
        return acc
      },
      { views: 0, likes: 0, saves: 0 }
    )

    return {
      ...recipe.toObject(),
      views: totals.views || recipe.views || 0,
      likesCount: totals.likes || recipe.likes?.length || 0,
      savesCount: totals.saves || recipe.savedBy?.length || 0,
      commentsCount: commentStats?.total || 0,
      sparkline7d: recipeStats.slice(-7).map((item) => ({ date: item.date, views: item.views })),
    }
  })

  res.json(byRecipe)
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
