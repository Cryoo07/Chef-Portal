import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext.jsx'
import { IMAGES, onImageErrorToFallback } from '../utils/images.js'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    speciality: '',
    yearsOfExperience: 0,
    bio: '',
    socialLinks: { instagram: '', youtube: '', website: '' },
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const ruleChecks = {
    minLength: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[@$!%*?&]/.test(form.password),
  }

  const isValidHttpUrl = (value) => {
    if (!value) return true
    try {
      const parsed = new URL(value)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  const strengthScore = Object.values(ruleChecks).filter(Boolean).length
  const strengthMeta = {
    0: { label: 'Weak', color: 'bg-red-500' },
    1: { label: 'Weak', color: 'bg-red-500' },
    2: { label: 'Fair', color: 'bg-orange-500' },
    3: { label: 'Good', color: 'bg-amber-500' },
    4: { label: 'Good', color: 'bg-amber-500' },
    5: { label: 'Strong', color: 'bg-green-500' },
  }[strengthScore]

  const validate = () => {
    const nextErrors = {}
    if (strengthScore < 5) nextErrors.password = 'Please satisfy all password rules'
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match'

    if (form.role === 'chef') {
      if (form.socialLinks.instagram && !isValidHttpUrl(form.socialLinks.instagram)) nextErrors.instagram = 'Please enter a valid URL (e.g. https://instagram.com/yourname)'
      if (form.socialLinks.youtube && !isValidHttpUrl(form.socialLinks.youtube)) nextErrors.youtube = 'Please enter a valid URL (e.g. https://youtube.com/@yourchannel)'
      if (form.socialLinks.website && !isValidHttpUrl(form.socialLinks.website)) nextErrors.website = 'Please enter a valid URL (e.g. https://yourwebsite.com)'
      if (form.bio.length > 300) nextErrors.bio = 'Bio must be at most 300 characters'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await register(form)
      toast.success(form.role === 'chef' ? 'Chef account created and sent for approval.' : 'Welcome to RecipeNest!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="grid md:grid-cols-2 card overflow-hidden">
      <div className="hidden md:block relative min-h-[560px]">
        <img src={IMAGES.register} alt="Register page food background" loading="eager" onError={onImageErrorToFallback} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <input className="input-base" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input-base" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <div className="relative">
        <input type={showPassword ? 'text' : 'password'} className={`input-base pr-12 ${errors.password ? 'border-red-500' : ''}`} placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button type="button" className="absolute right-3 top-2 text-sm text-muted" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? 'Hide' : 'Show'}</button>
      </div>
      <div className="space-y-2">
        <div className="h-2 rounded bg-gray-200 overflow-hidden">
          <div className={`h-full ${strengthMeta.color}`} style={{ width: `${(strengthScore / 5) * 100}%` }} />
        </div>
        <p className="text-xs text-muted">Password Strength: {strengthMeta.label}</p>
        <ul className="text-xs space-y-1">
          <li className={ruleChecks.minLength ? 'text-green-600' : 'text-muted'}>{ruleChecks.minLength ? '✓' : '○'} At least 8 characters</li>
          <li className={ruleChecks.uppercase ? 'text-green-600' : 'text-muted'}>{ruleChecks.uppercase ? '✓' : '○'} At least one uppercase letter</li>
          <li className={ruleChecks.lowercase ? 'text-green-600' : 'text-muted'}>{ruleChecks.lowercase ? '✓' : '○'} At least one lowercase letter</li>
          <li className={ruleChecks.number ? 'text-green-600' : 'text-muted'}>{ruleChecks.number ? '✓' : '○'} At least one number</li>
          <li className={ruleChecks.special ? 'text-green-600' : 'text-muted'}>{ruleChecks.special ? '✓' : '○'} At least one special character (@ $ ! % * ? &)</li>
        </ul>
      </div>
      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
      <div className="relative">
        <input type={showConfirmPassword ? 'text' : 'password'} className={`input-base pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`} placeholder="Confirm password" onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
        <button type="button" className="absolute right-3 top-2 text-sm text-muted" onClick={() => setShowConfirmPassword((prev) => !prev)}>{showConfirmPassword ? 'Hide' : 'Show'}</button>
      </div>
      {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.role === 'chef'} onChange={(e) => setForm({ ...form, role: e.target.checked ? 'chef' : 'user' })} />
        Register as chef (requires admin approval)
      </label>
      {form.role === 'chef' && (
        <>
          <input className="input-base" placeholder="Speciality / Cuisine Type" onChange={(e) => setForm({ ...form, speciality: e.target.value })} />
          <input type="number" min="0" max="60" className="input-base" placeholder="Years of Experience" onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })} />
          <div>
            <textarea className={`input-base ${errors.bio ? 'border-red-500' : ''}`} rows={3} maxLength={300} placeholder="Bio (max 300 characters)" onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <p className="text-xs text-muted mt-1">{form.bio.length}/300</p>
            {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
          </div>
          <input className={`input-base ${errors.instagram ? 'border-red-500' : ''}`} placeholder="Instagram URL" onBlur={(e) => !isValidHttpUrl(e.target.value) && setErrors((prev) => ({ ...prev, instagram: 'Please enter a valid URL (e.g. https://instagram.com/yourname)' }))} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: e.target.value } })} />
          {errors.instagram && <p className="text-sm text-red-600">{errors.instagram}</p>}
          <input className={`input-base ${errors.youtube ? 'border-red-500' : ''}`} placeholder="YouTube URL" onBlur={(e) => !isValidHttpUrl(e.target.value) && setErrors((prev) => ({ ...prev, youtube: 'Please enter a valid URL (e.g. https://youtube.com/@yourchannel)' }))} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, youtube: e.target.value } })} />
          {errors.youtube && <p className="text-sm text-red-600">{errors.youtube}</p>}
          <input className={`input-base ${errors.website ? 'border-red-500' : ''}`} placeholder="Website URL" onBlur={(e) => !isValidHttpUrl(e.target.value) && setErrors((prev) => ({ ...prev, website: 'Please enter a valid URL (e.g. https://yourwebsite.com)' }))} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, website: e.target.value } })} />
          {errors.website && <p className="text-sm text-red-600">{errors.website}</p>}
        </>
      )}
      <button className="btn-primary w-full">Create Account</button>
      <p className="text-sm">Have an account? <Link to="/login" className="text-primary">Login</Link></p>
      </form>
    </div>
  )
}

export default RegisterPage
