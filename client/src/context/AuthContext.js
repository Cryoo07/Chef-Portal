import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('chefPortalUser')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('chefPortalToken') || '')

  useEffect(() => {
    if (user) {
      localStorage.setItem('chefPortalUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('chefPortalUser')
    }
  }, [user])

  useEffect(() => {
    if (token) {
      localStorage.setItem('chefPortalToken', token)
    } else {
      localStorage.removeItem('chefPortalToken')
    }
  }, [token])

  const authRequest = async (path, body) => {
    const response = await fetch(`${API_BASE}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return response.json()
  }

  const login = async (credentials) => {
    const result = await authRequest('auth/login', credentials)
    if (result.token) {
      setToken(result.token)
      setUser(result.user)
    }
    return result
  }

  const register = async (data) => {
    const result = await authRequest('auth/register', data)
    if (result.token) {
      setToken(result.token)
      setUser(result.user)
    }
    return result
  }

  const logout = () => {
    setToken('')
    setUser(null)
  }

  const authHeaders = () => ({ Authorization: `Bearer ${token}` })

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, authHeaders, API_BASE }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
