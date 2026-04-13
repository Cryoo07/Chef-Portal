import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const user = await User.create({ name, email, password, role })
    const token = createToken(user._id)

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !user.active) {
      return res.status(401).json({ message: 'Invalid credentials or inactive account' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = createToken(user._id)
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
})

export default router
