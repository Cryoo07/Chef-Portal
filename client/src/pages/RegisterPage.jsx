import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext.jsx'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', speciality: '', yearsOfExperience: 0 })

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      toast.success('Welcome to Chef Portal!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto card p-6 space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <input className="input-base" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input-base" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" className="input-base" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select className="input-base" onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="user">User</option>
        <option value="chef">Chef</option>
      </select>
      {form.role === 'chef' && (
        <>
          <input className="input-base" placeholder="Speciality" onChange={(e) => setForm({ ...form, speciality: e.target.value })} />
          <input type="number" className="input-base" placeholder="Years of Experience" onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })} />
        </>
      )}
      <button className="btn-primary w-full">Create Account</button>
      <p className="text-sm">Have an account? <Link to="/login" className="text-primary">Login</Link></p>
    </form>
  )
}

export default RegisterPage
