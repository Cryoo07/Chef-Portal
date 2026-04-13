import express from 'express'
import Recipe from '../models/Recipe.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const recipes = await Recipe.find().populate('createdBy', 'name email role')
      return res.json(recipes)
    }

    if (req.user.role === 'chef') {
      const recipes = await Recipe.find({ createdBy: req.user._id }).populate('createdBy', 'name')
      return res.json(recipes)
    }

    const approvedRecipes = await Recipe.find({ status: 'approved' }).populate('createdBy', 'name')
    res.json(approvedRecipes)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recipes', error: error.message })
  }
})

router.get('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name email')
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }
    res.json(recipe)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recipe', error: error.message })
  }
})

router.post('/', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const { title, description, ingredients } = req.body
    const recipe = await Recipe.create({
      title,
      description,
      ingredients: ingredients || [],
      status: req.user.role === 'admin' ? 'approved' : 'pending',
      createdBy: req.user._id,
    })
    res.status(201).json(recipe)
  } catch (error) {
    res.status(500).json({ message: 'Failed to create recipe', error: error.message })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }

    if (recipe.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }

    recipe.title = req.body.title || recipe.title
    recipe.description = req.body.description || recipe.description
    recipe.ingredients = req.body.ingredients || recipe.ingredients
    await recipe.save()

    res.json(recipe)
  } catch (error) {
    res.status(500).json({ message: 'Failed to update recipe', error: error.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }

    if (recipe.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }

    await recipe.deleteOne()
    res.json({ message: 'Recipe deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete recipe', error: error.message })
  }
})

router.patch('/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }
    recipe.status = 'approved'
    await recipe.save()
    res.json(recipe)
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve recipe', error: error.message })
  }
})

router.patch('/:id/reject', protect, authorize('admin'), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }
    recipe.status = 'rejected'
    await recipe.save()
    res.json(recipe)
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject recipe', error: error.message })
  }
})

export default router
