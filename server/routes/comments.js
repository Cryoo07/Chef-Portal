import express from 'express'
import Comment from '../models/Comment.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.post('/:recipeId', protect, authorize('user', 'chef'), async (req, res) => {
  const comment = await Comment.create({
    recipe: req.params.recipeId,
    user: req.user._id,
    text: req.body.text,
  })
  const populated = await comment.populate('user', 'name avatar')
  res.status(201).json(populated)
})

router.delete('/:commentId', protect, async (req, res) => {
  const comment = await Comment.findById(req.params.commentId)
  if (!comment) return res.status(404).json({ message: 'Comment not found' })
  if (req.user.role !== 'admin' && comment.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  await comment.deleteOne()
  res.json({ message: 'Comment deleted' })
})

export default router
