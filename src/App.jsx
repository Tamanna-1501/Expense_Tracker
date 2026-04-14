import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TxProvider } from './context/TxContext'
import { BudgetProvider } from './context/BudgetContext'
import { GroupProvider } from './context/GroupContext'   

import ProtectedRoute from './components/ProtectedRoute'

import LandingPage        from './pages/LandingPage'
import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import HomePage           from './pages/HomePage'
import TransactionsPage   from './pages/TransactionsPage'
import AddTransactionPage from './pages/AddTransactionPage'
import CategoriesPage     from './pages/CategoriesPage'
import SettingsPage       from './pages/SettingsPage'
import ChatbotPage        from './pages/ChatbotPage'
import AnalyticsPage      from './pages/AnalyticsPage'
import BudgetPage         from './pages/BudgetPage'
import GroupsPage         from './pages/GroupsPage'      

function AppRoutes() {
  return (
    <TxProvider>
      <BudgetProvider>
        <GroupProvider>   
          <Routes>

            <Route path="/"         element={<LandingPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/home"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
            <Route path="/add"          element={<ProtectedRoute><AddTransactionPage /></ProtectedRoute>} />
            <Route path="/categories"   element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
            <Route path="/settings"     element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/chatbot"      element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
            <Route path="/analytics"    element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/budget"       element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />

            
            <Route path="/groups"      element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
            <Route path="/groups/:id"  element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </GroupProvider>   
      </BudgetProvider>
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