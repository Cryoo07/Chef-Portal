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
    ingredients: { type: [ingredientSchema], default: [] },
    instructions: [{ type: String }],
    cookTime: { type: Number, default: 0 },
    prepTime: { type: Number, default: 0 },
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
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Recipe = mongoose.model('Recipe', recipeSchema)
export default Recipe
