import express from 'express'
import User from '../models/User.js'
import { protect, authorize } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message })
  }
})

router.patch('/:id/toggle', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    user.active = !user.active
    await user.save()
    res.json({ id: user._id, active: user.active })
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle user', error: error.message })
  }
})

export default router
