import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext.jsx'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
    <form onSubmit={onSubmit} className="max-w-md mx-auto card p-6 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <input className="input-base" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" className="input-base" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="btn-primary w-full">Sign In</button>
      <p className="text-sm">No account? <Link to="/register" className="text-primary">Register</Link></p>
    </form>
  )
}

export default LoginPage
