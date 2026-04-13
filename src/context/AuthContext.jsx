import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const DEMO_USER = { name: 'Demo User', email: 'Demo@gmail.com', password: 'user1234', initials: 'DU' }

function loadUsers() {
  try { return JSON.parse(localStorage.getItem('pt_users') || '[]') } catch { return [] }
}
function saveUsers(u) { localStorage.setItem('pt_users', JSON.stringify(u)) }
function loadSession() {
  try { return JSON.parse(localStorage.getItem('pt_session') || 'null') } catch { return null }
}
function saveSession(u) { localStorage.setItem('pt_session', u ? JSON.stringify(u) : 'null') }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Always upsert demo user so credential changes always take effect
    const users = loadUsers()
    const others = users.filter(u => u.email.toLowerCase() !== DEMO_USER.email.toLowerCase())
    saveUsers([...others, DEMO_USER])
    const s = loadSession()
    return s || null
  })

  function login(email, password) {
    const users = loadUsers()
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) return 'Invalid email or password.'
    const session = { name: found.name, email: found.email, initials: found.initials || found.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }
    setUser(session)
    saveSession(session)
    return null
  }

  function register(name, email, password) {
    const users = loadUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return 'Email already registered.'
    const newUser = { name, email, password, initials: name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) }
    saveUsers([...users, newUser])
    const session = { name: newUser.name, email: newUser.email, initials: newUser.initials }
    setUser(session)
    saveSession(session)
    return null
  }

  function logout() {
    setUser(null)
    saveSession(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
