import express from 'express'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me'

const createToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

const handleValidation = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    return false
  }
  return true
}

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['user', 'chef']),
  ],
  async (req, res) => {
    if (!handleValidation(req, res)) return
    try {
      const { name, email, password, role, speciality, yearsOfExperience } = req.body
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' })
      }

      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user',
        speciality: role === 'chef' ? speciality || '' : '',
        yearsOfExperience: role === 'chef' ? Number(yearsOfExperience || 0) : 0,
      })
      const token = createToken(user._id)

      res.status(201).json({ token, user: user.toJSONSafe() })
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error.message })
    }
  }
)

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], async (req, res) => {
  if (!handleValidation(req, res)) return
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !user.isActive || !user.isApproved) {
      return res.status(401).json({ message: 'Invalid credentials or inactive account' })
    }

    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = createToken(user._id)
    res.json({ token, user: user.toJSONSafe() })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
})

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user.toJSONSafe ? req.user.toJSONSafe() : req.user })
})

router.post('/logout', async (req, res) => {
  res.json({ message: 'Logout successful. Remove token on client.' })
})

export default router
