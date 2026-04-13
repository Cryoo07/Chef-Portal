import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import recipeRoutes from './routes/recipes.js'
import userRoutes from './routes/users.js'

dotenv.config()

const app = express()
const PORT = process.env.SERVER_PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chef-portal'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(express.json())
app.use(cors({ origin: CLIENT_URL }))

app.use('/api/auth', authRoutes)
app.use('/api/recipes', recipeRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Chef Portal API is running' })
})

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  })
