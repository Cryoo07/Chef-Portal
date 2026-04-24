import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Recipe from './models/Recipe.js'
import Comment from './models/Comment.js'
import Analytics from './models/Analytics.js'
import { getDateKey } from './utils/helpers.js'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chef_portal'

const runSeed = async () => {
  await mongoose.connect(MONGO_URI)
  await Promise.all([User.deleteMany({}), Recipe.deleteMany({}), Comment.deleteMany({}), Analytics.deleteMany({})])

  const admin = await User.create({
    name: 'Chef Portal Admin',
    email: 'admin@chefportal.com',
    password: 'Admin123!',
    role: 'admin',
  })

  const chefs = await User.create([
    { name: 'Chef Marina', email: 'marina@chefportal.com', password: 'Chef123!', role: 'chef', speciality: 'Italian', yearsOfExperience: 8, avatar: 'https://source.unsplash.com/300x300/?chef,woman&sig=11' },
    { name: 'Chef Diego', email: 'diego@chefportal.com', password: 'Chef123!', role: 'chef', speciality: 'Mexican', yearsOfExperience: 6, avatar: 'https://source.unsplash.com/300x300/?chef,man&sig=12' },
    { name: 'Chef Priya', email: 'priya@chefportal.com', password: 'Chef123!', role: 'chef', speciality: 'Indian', yearsOfExperience: 10, avatar: 'https://source.unsplash.com/300x300/?chef,portrait&sig=13' },
  ])

  const users = await User.create([
    { name: 'Ava User', email: 'ava@chefportal.com', password: 'User123!', role: 'user' },
    { name: 'Liam User', email: 'liam@chefportal.com', password: 'User123!', role: 'user' },
  ])

  const recipesPayload = [
    {
      title: 'Creamy Tuscan Chicken Pasta',
      description: 'Pan-seared chicken with garlic cream sauce, spinach, and sun-dried tomatoes tossed with fettuccine.',
      ingredients: [
        { name: 'Chicken breast', quantity: 2, unit: 'pieces' },
        { name: 'Fettuccine', quantity: 300, unit: 'g' },
        { name: 'Heavy cream', quantity: 1, unit: 'cup' },
        { name: 'Parmesan', quantity: 0.5, unit: 'cup' },
        { name: 'Sun-dried tomatoes', quantity: 0.33, unit: 'cup' },
        { name: 'Spinach', quantity: 2, unit: 'cups' },
      ],
      instructions: [
        'Season chicken with salt and pepper, then sear in olive oil until golden and cooked through.',
        'Boil fettuccine in salted water until al dente and reserve 1/2 cup pasta water.',
        'In the same pan, saute garlic and sun-dried tomatoes, then add cream and parmesan.',
        'Stir in spinach until wilted, slice chicken, and combine with pasta.',
        'Loosen sauce with pasta water if needed and serve hot with extra parmesan.',
      ],
      cookTime: 25,
      prepTime: 15,
      servings: 4,
      difficulty: 'medium',
      category: 'dinner',
      tags: ['italian', 'pasta', 'comfort-food'],
      images: ['https://source.unsplash.com/1200x800/?pasta,dinner&sig=21'],
      chef: chefs[0]._id,
      likes: [users[0]._id],
      savedBy: [users[1]._id],
      views: 84,
      isPublished: true,
    },
    {
      title: 'Breakfast Burrito Bowl',
      description: 'Protein-packed breakfast bowl with scrambled eggs, beans, avocado, salsa, and cilantro rice.',
      ingredients: [
        { name: 'Eggs', quantity: 4, unit: 'large' },
        { name: 'Cooked rice', quantity: 2, unit: 'cups' },
        { name: 'Black beans', quantity: 1, unit: 'cup' },
        { name: 'Avocado', quantity: 1, unit: 'whole' },
        { name: 'Salsa', quantity: 0.5, unit: 'cup' },
      ],
      instructions: [
        'Warm the rice and beans separately with a pinch of salt and cumin.',
        'Scramble eggs over medium-low heat until soft and fluffy.',
        'Layer rice, beans, and eggs in bowls.',
        'Top with diced avocado, salsa, and chopped cilantro.',
        'Serve with lime wedges and optional hot sauce.',
      ],
      cookTime: 12,
      prepTime: 10,
      servings: 2,
      difficulty: 'easy',
      category: 'breakfast',
      tags: ['high-protein', 'quick', 'mexican'],
      images: ['https://source.unsplash.com/1200x800/?breakfast,bowl&sig=22'],
      chef: chefs[1]._id,
      likes: [users[1]._id],
      savedBy: [users[0]._id],
      views: 56,
      isPublished: true,
    },
    {
      title: 'Spiced Chickpea Curry',
      description: 'A rich, tomato-based chickpea curry simmered with coconut milk and warming spices.',
      ingredients: [
        { name: 'Chickpeas', quantity: 2, unit: 'cans' },
        { name: 'Onion', quantity: 1, unit: 'large' },
        { name: 'Tomato puree', quantity: 1, unit: 'cup' },
        { name: 'Coconut milk', quantity: 1, unit: 'cup' },
        { name: 'Garam masala', quantity: 1, unit: 'tbsp' },
      ],
      instructions: [
        'Saute onion with oil until golden, then add garlic and ginger.',
        'Add spices and toast for 30 seconds until fragrant.',
        'Pour in tomato puree and cook until thickened.',
        'Add chickpeas and coconut milk, then simmer for 15 minutes.',
        'Finish with cilantro and serve with rice or naan.',
      ],
      cookTime: 30,
      prepTime: 10,
      servings: 4,
      difficulty: 'easy',
      category: 'dinner',
      tags: ['indian', 'vegan', 'one-pot'],
      images: ['https://source.unsplash.com/1200x800/?curry,indian-food&sig=23'],
      chef: chefs[2]._id,
      likes: [users[0]._id, users[1]._id],
      savedBy: [users[0]._id],
      views: 103,
      isPublished: true,
    },
    {
      title: 'Lemon Herb Grilled Salmon',
      description: 'Flaky grilled salmon with lemon zest, fresh herbs, and a simple garlic butter glaze.',
      ingredients: [
        { name: 'Salmon fillets', quantity: 4, unit: 'pieces' },
        { name: 'Lemon', quantity: 1, unit: 'whole' },
        { name: 'Butter', quantity: 2, unit: 'tbsp' },
        { name: 'Parsley', quantity: 2, unit: 'tbsp' },
        { name: 'Garlic', quantity: 2, unit: 'cloves' },
      ],
      instructions: [
        'Pat salmon dry and season with salt, pepper, and lemon zest.',
        'Grill skin-side down over medium-high heat for 5-6 minutes.',
        'Flip and cook 2-3 minutes more until just cooked through.',
        'Melt butter with garlic, then brush over salmon.',
        'Top with parsley and lemon juice before serving.',
      ],
      cookTime: 12,
      prepTime: 8,
      servings: 4,
      difficulty: 'medium',
      category: 'dinner',
      tags: ['seafood', 'healthy', 'grill'],
      images: ['https://source.unsplash.com/1200x800/?salmon,grilled&sig=24'],
      chef: chefs[0]._id,
      likes: [],
      savedBy: [users[1]._id],
      views: 47,
      isPublished: true,
    },
    {
      title: 'Street-Style Chicken Tacos',
      description: 'Juicy marinated chicken tacos with pickled onion, cilantro, and chipotle crema.',
      ingredients: [
        { name: 'Chicken thighs', quantity: 500, unit: 'g' },
        { name: 'Corn tortillas', quantity: 10, unit: 'pieces' },
        { name: 'Lime', quantity: 2, unit: 'whole' },
        { name: 'Greek yogurt', quantity: 0.5, unit: 'cup' },
        { name: 'Chipotle in adobo', quantity: 1, unit: 'tbsp' },
      ],
      instructions: [
        'Marinate chicken with lime juice, paprika, garlic, and cumin for 20 minutes.',
        'Cook chicken in a hot skillet until charred and fully cooked.',
        'Mix yogurt with chipotle and lime juice for crema.',
        'Warm tortillas and fill with chopped chicken.',
        'Top with pickled onion, cilantro, and chipotle crema.',
      ],
      cookTime: 18,
      prepTime: 25,
      servings: 5,
      difficulty: 'medium',
      category: 'lunch',
      tags: ['mexican', 'tacos', 'weeknight'],
      images: ['https://source.unsplash.com/1200x800/?tacos,mexican-food&sig=25'],
      chef: chefs[1]._id,
      likes: [users[1]._id],
      savedBy: [users[0]._id, users[1]._id],
      views: 95,
      isPublished: true,
    },
    {
      title: 'Classic Tiramisu Cups',
      description: 'Layered espresso-soaked ladyfingers and mascarpone cream served in individual cups.',
      ingredients: [
        { name: 'Ladyfingers', quantity: 18, unit: 'pieces' },
        { name: 'Espresso', quantity: 1, unit: 'cup' },
        { name: 'Mascarpone', quantity: 250, unit: 'g' },
        { name: 'Whipping cream', quantity: 1, unit: 'cup' },
        { name: 'Cocoa powder', quantity: 2, unit: 'tbsp' },
      ],
      instructions: [
        'Whisk mascarpone with sugar until smooth and fold in whipped cream.',
        'Dip ladyfingers briefly in cooled espresso.',
        'Layer ladyfingers and cream in serving cups.',
        'Repeat layers and chill for at least 4 hours.',
        'Dust with cocoa powder before serving.',
      ],
      cookTime: 0,
      prepTime: 25,
      servings: 6,
      difficulty: 'hard',
      category: 'dessert',
      tags: ['dessert', 'italian', 'make-ahead'],
      images: ['https://source.unsplash.com/1200x800/?tiramisu,dessert&sig=26'],
      chef: chefs[0]._id,
      likes: [users[0]._id],
      savedBy: [],
      views: 71,
      isPublished: true,
    },
    {
      title: 'Mango Lassi Smoothie',
      description: 'Refreshing yogurt smoothie blended with ripe mango, cardamom, and a touch of honey.',
      ingredients: [
        { name: 'Mango chunks', quantity: 2, unit: 'cups' },
        { name: 'Plain yogurt', quantity: 1.5, unit: 'cups' },
        { name: 'Milk', quantity: 0.5, unit: 'cup' },
        { name: 'Honey', quantity: 1, unit: 'tbsp' },
        { name: 'Cardamom', quantity: 0.25, unit: 'tsp' },
      ],
      instructions: [
        'Add mango, yogurt, milk, honey, and cardamom to a blender.',
        'Blend until creamy and smooth.',
        'Taste and adjust sweetness if needed.',
        'Pour into chilled glasses.',
        'Serve immediately.',
      ],
      cookTime: 0,
      prepTime: 5,
      servings: 3,
      difficulty: 'easy',
      category: 'beverage',
      tags: ['drink', 'summer', 'indian'],
      images: ['https://source.unsplash.com/1200x800/?mango,smoothie&sig=27'],
      chef: chefs[2]._id,
      likes: [],
      savedBy: [users[1]._id],
      views: 39,
      isPublished: true,
    },
    {
      title: 'Dark Chocolate Energy Bites',
      description: 'No-bake snack bites with oats, peanut butter, cocoa, and chia seeds.',
      ingredients: [
        { name: 'Rolled oats', quantity: 1.5, unit: 'cups' },
        { name: 'Peanut butter', quantity: 0.5, unit: 'cup' },
        { name: 'Honey', quantity: 0.33, unit: 'cup' },
        { name: 'Cocoa powder', quantity: 2, unit: 'tbsp' },
        { name: 'Chia seeds', quantity: 1, unit: 'tbsp' },
      ],
      instructions: [
        'Mix oats, cocoa, and chia in a bowl.',
        'Warm peanut butter and honey together until pourable.',
        'Combine wet and dry ingredients until evenly coated.',
        'Roll into bite-size balls and refrigerate for 20 minutes.',
        'Store chilled in an airtight container.',
      ],
      cookTime: 0,
      prepTime: 15,
      servings: 16,
      difficulty: 'easy',
      category: 'snack',
      tags: ['snack', 'no-bake', 'meal-prep'],
      images: ['https://source.unsplash.com/1200x800/?chocolate,snack&sig=28'],
      chef: chefs[1]._id,
      likes: [users[0]._id],
      savedBy: [users[0]._id, users[1]._id],
      views: 64,
      isPublished: true,
    },
  ]

  const recipes = await Recipe.insertMany(recipesPayload)

  await Comment.insertMany(
    recipes.slice(0, 6).map((recipe, idx) => ({
      recipe: recipe._id,
      user: users[idx % users.length]._id,
      text: `This recipe ${idx + 1} is delicious and easy to follow!`,
    }))
  )

  const dateKey = getDateKey()
  await Analytics.insertMany(
    recipes.map((recipe) => ({
      recipeId: recipe._id,
      date: dateKey,
      views: recipe.views,
      likes: recipe.likes.length,
      saves: recipe.savedBy.length,
    }))
  )

  console.log(`Seed complete. Admin: ${admin.email} / Admin123!`)
  console.log('Chef logins: marina@chefportal.com, diego@chefportal.com, priya@chefportal.com / Chef123!')
  console.log('User logins: ava@chefportal.com, liam@chefportal.com / User123!')
  await mongoose.disconnect()
}

runSeed().catch(async (error) => {
  console.error(error)
  await mongoose.disconnect()
  process.exit(1)
})
