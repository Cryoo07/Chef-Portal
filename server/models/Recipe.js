import mongoose from 'mongoose'

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: '' },
  },
  { _id: false }
)

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    cuisineType: { type: String, default: '' },
    ingredients: { type: [ingredientSchema], default: [] },
    instructions: [{ type: String }],
    cookTime: { type: Number, default: 0 },
    prepTime: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 },
    servings: { type: Number, default: 1 },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    category: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'beverage'],
      default: 'dinner',
    },
    tags: [{ type: String }],
    images: [{ type: String }],
    nutrition: {
      calories: { type: Number, default: null },
      protein: { type: Number, default: null },
      carbohydrates: { type: Number, default: null },
      fat: { type: Number, default: null },
    },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

recipeSchema.pre('save', function (next) {
  this.totalTime = Number(this.prepTime || 0) + Number(this.cookTime || 0)
  next()
})

recipeSchema.post('save', function (error, doc, next) {
  if (error) {
    console.error('Recipe save error:', error)
    next(error)
  } else {
    next()
  }
})

const Recipe = mongoose.model('Recipe', recipeSchema)
export default Recipe
