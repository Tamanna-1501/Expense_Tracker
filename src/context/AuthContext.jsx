import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function loadToken() {
  try { return localStorage.getItem('pt_token') } catch { return null }
}

function saveToken(token) {
  if (token) localStorage.setItem('pt_token', token)
  else localStorage.removeItem('pt_token')
}

function loadUser() {
  try { return JSON.parse(localStorage.getItem('pt_user') || 'null') } catch { return null }
}

function saveUser(user) {
  if (user) localStorage.setItem('pt_user', JSON.stringify(user))
  else localStorage.removeItem('pt_user')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUser())
  const [token, setToken] = useState(() => loadToken())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    saveUser(user)
  }, [user])

  useEffect(() => {
    saveToken(token)
  }, [token])

  async function login(email, password) {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      
      if (!res.ok) return data.message || 'Login failed'
      
      const userData = { 
        name: data.user.name, 
        email: data.user.email, 
        id: data.user.id,
        initials: data.user.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
      }
      setUser(userData)
      setToken(data.token)
      return null
    } catch (err) {
      return 'Network error. Make sure backend is running.'
    } finally {
      setLoading(false)
    }
  }

  async function register(name, email, password) {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      
      if (!res.ok) return data.message || 'Registration failed'
      
      const userData = {
        name: data.user.name,
        email: data.user.email,
        id: data.user.id,
        initials: data.user.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
      }
      setUser(userData)
      setToken(data.token)
      return null
    } catch (err) {
      return 'Network error. Make sure backend is running.'
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setUser(null)
    setToken(null)
  }

  return <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
