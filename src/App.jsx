import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TxProvider } from './context/TxContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage        from './pages/LandingPage'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import HomePage           from './pages/HomePage'
import TransactionsPage   from './pages/TransactionsPage'
import AddTransactionPage from './pages/AddTransactionPage'
import CategoriesPage     from './pages/CategoriesPage'
import SettingsPage       from './pages/SettingsPage'

function AppRoutes() {
  return (
    <TxProvider>
      <Routes>
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
        <Route path="/add"          element={<ProtectedRoute><AddTransactionPage /></ProtectedRoute>} />
        <Route path="/categories"   element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
        <Route path="/settings"     element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TxProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
