import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import morgan from 'morgan'
import authRoutes from './routes/auth.js'
import recipeRoutes from './routes/recipes.js'
import userRoutes from './routes/users.js'
import chefRoutes from './routes/chefs.js'
import commentRoutes from './routes/comments.js'
import adminRoutes from './routes/admin.js'
import analyticsRoutes from './routes/analytics.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipe_nest'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me'

app.use(express.json())
app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(morgan('dev'))

app.use('/api/auth', authRoutes)
app.use('/api/recipes', recipeRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chefs', chefRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'RecipeNest API is running' })
})

app.get('/api/health', (req, res) => {
  const readyStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }

  res.json({
    status: 'ok',
    database: readyStateMap[mongoose.connection.readyState] || 'unknown',
    hasJwtSecret: Boolean(JWT_SECRET),
  })
})

app.use(notFound)
app.use(errorHandler)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET is not set. Using development fallback secret.')
    }
    app.listen(PORT, () => process.stdout.write(`Server running on port ${PORT}\n`))
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  })
