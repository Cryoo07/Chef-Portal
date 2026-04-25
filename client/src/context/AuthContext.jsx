import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)
const TOKEN_KEY = 'recipe_nest_token'
const USER_KEY = 'recipe_nest_user'

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  const setAuth = (payload) => {
    setToken(payload.token)
    setUser(payload.user)
  }

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setAuth(data)
    return data
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    setAuth(data)
    return data
  }

  const logout = () => {
    setToken('')
    setUser(null)
  }

  const refreshMe = async () => {
    if (!token) return
    const { data } = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
    setUser(data.user)
  }

  const value = useMemo(
    () => ({ token, user, isAuthenticated: !!token, login, register, logout, refreshMe }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
