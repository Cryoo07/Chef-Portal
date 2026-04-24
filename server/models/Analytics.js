import mongoose from 'mongoose'

const analyticsSchema = new mongoose.Schema(
  {
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    date: { type: String, required: true },
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
)

analyticsSchema.index({ recipeId: 1, date: 1 }, { unique: true })

const Analytics = mongoose.model('Analytics', analyticsSchema)
export default Analytics
