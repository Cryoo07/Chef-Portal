import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Recipe from './models/Recipe.js'
import Comment from './models/Comment.js'
import Analytics from './models/Analytics.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/recipe_nest'

const runSeed = async () => {
  await mongoose.connect(MONGO_URI)
  await Promise.all([User.deleteMany({}), Recipe.deleteMany({}), Comment.deleteMany({}), Analytics.deleteMany({})])

  await User.create({
    name: 'RecipeNest Admin',
    email: 'admin@recipenest.com',
    password: 'Admin123!',
    role: 'admin',
  })
  process.stdout.write('Seed complete with empty data.\n')
  process.stdout.write('Admin login: admin@recipenest.com / Admin123!\n')
  await mongoose.disconnect()
}

runSeed().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect()
  process.exit(1)
})
