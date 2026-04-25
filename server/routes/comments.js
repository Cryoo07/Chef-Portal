import express from 'express'
import Comment from '../models/Comment.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

const getCommentsByRecipe = async (req, res) => {
  const comments = await Comment.find({ recipe: req.params.recipeId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
  const ratings = comments.map((item) => item.rating)
  const avgRating = ratings.length ? ratings.reduce((acc, val) => acc + val, 0) / ratings.length : 0
  res.json({ comments, avgRating, ratingsCount: ratings.length })
}

router.get('/recipe/:recipeId', getCommentsByRecipe)
router.get('/:recipeId', getCommentsByRecipe)

router.post('/:recipeId', protect, authorize('user', 'chef'), async (req, res) => {
  const rating = Number(req.body.rating)
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' })
  }
  const comment = await Comment.create({
    recipe: req.params.recipeId,
    user: req.user._id,
    text: req.body.text,
    rating,
  })
  const populated = await comment.populate('user', 'name avatar')
  res.status(201).json(populated)
})

const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id || req.params.commentId)
  if (!comment) return res.status(404).json({ message: 'Comment not found' })
  if (req.user.role !== 'admin' && comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  await comment.deleteOne()
  res.json({ message: 'Comment deleted' })
}

router.delete('/:commentId', protect, deleteComment)
router.delete('/id/:id', protect, deleteComment)

export default router
