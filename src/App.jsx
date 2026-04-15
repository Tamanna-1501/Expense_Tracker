import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { AuthProvider } from './context/AuthContext'
import { TxProvider } from './context/TxContext'
import { BudgetProvider } from './context/BudgetContext'
import { GroupProvider } from './context/GroupContext'

import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import TransactionsPage from './pages/TransactionsPage'
import AddTransactionPage from './pages/AddTransactionPage'
import CategoriesPage from './pages/CategoriesPage'
import SettingsPage from './pages/SettingsPage'
import ChatbotPage from './pages/ChatbotPage'
import AnalyticsPage from './pages/AnalyticsPage'
import BudgetPage from './pages/BudgetPage'
import GroupsPage from './pages/GroupsPage'
import GroupDetailPage from './pages/GroupDetailPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute><AddTransactionPage /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />

      <Route path="/groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
      <Route path="/groups/:id" element={<ProtectedRoute><GroupDetailPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    const root = document.documentElement

    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <BrowserRouter>
      <AuthProvider>
        <TxProvider>
          <BudgetProvider>
            <GroupProvider>

              {/* THEME TOGGLE */}
              <button
                onClick={() => setDark(prev => !prev)}
                style={{
                  position: 'fixed',
                  top: 12,
                  right: 12,
                  padding: '8px 12px',
                  borderRadius: 999,
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: 'var(--surface)',
                  color: 'var(--ink)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                {dark ? '🌙 Dark' : '☀️ Light'}
              </button>

              <AppRoutes />

            </GroupProvider>
          </BudgetProvider>
        </TxProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}