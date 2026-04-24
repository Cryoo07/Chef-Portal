import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'chef', 'admin'],
      default: 'user',
      required: true,
    },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    speciality: { type: String, default: '' },
    yearsOfExperience: { type: Number, default: 0 },
    socialLinks: {
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    likedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.toJSONSafe = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    bio: this.bio,
    speciality: this.speciality,
    yearsOfExperience: this.yearsOfExperience,
    socialLinks: this.socialLinks,
    followers: this.followers,
    savedRecipes: this.savedRecipes,
    likedRecipes: this.likedRecipes,
    isActive: this.isActive,
    isApproved: this.isApproved,
    createdAt: this.createdAt,
  }
}

const User = mongoose.model('User', userSchema)
export default User
