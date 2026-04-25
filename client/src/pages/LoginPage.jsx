import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext.jsx'
import { IMAGES, onImageErrorToFallback } from '../utils/images.js'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await login(email, password)
      navigate(data.user.role === 'admin' ? '/admin' : data.user.role === 'chef' ? '/chef/dashboard' : '/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="grid md:grid-cols-2 card overflow-hidden">
      <div className="hidden md:block relative min-h-[460px]">
        <img src={IMAGES.login} alt="Login page food background" loading="eager" onError={onImageErrorToFallback} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <input className="input-base" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} className="input-base pr-12" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="absolute right-3 top-2 text-sm text-muted" onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? 'Hide' : 'Show'}</button>
        </div>
        <button className="btn-primary w-full">Sign In</button>
        <p className="text-sm">No account? <Link to="/register" className="text-primary">Register</Link></p>
      </form>
    </div>
  )
}

export default LoginPage
