import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const BudgetContext = createContext()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

export function BudgetProvider({ children }) {
  const { user, token } = useAuth()
  const [budgets, setBudgets] = useState({})
  const [loading, setLoading] = useState(false)

  const [firedAlerts, setFiredAlerts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('budgetAlerts') || '{}') }
    catch { return {} }
  })

  const [toasts, setToasts]       = useState([])
  const [emailModal, setEmailModal] = useState(null)

  // Load budgets from backend
  useEffect(() => {
    if (!user || !token) {
      setBudgets({})
      return
    }
    
    const loadBudgets = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/budgets`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          const budgetMap = {}
          const month = currentMonth()
          data.budgets.forEach(b => {
            if (b.month === month) {
              budgetMap[b.category] = b.limit
            }
          })
          setBudgets(budgetMap)
        }
      } catch (err) {
        console.error('Error loading budgets:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadBudgets()
  }, [user, token])

  useEffect(() => {
    localStorage.setItem('budgetAlerts', JSON.stringify(firedAlerts))
  }, [firedAlerts])

  async function setBudget(cat, amount) {
    if (!token) {
      console.error('No token available')
      return
    }
    
    try {
      const month = currentMonth()
      console.log('Setting budget:', { cat, amount, month, token: token.substring(0, 20) + '...' })
      
      const res = await fetch(`${API_URL}/budgets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category: cat, limit: Number(amount), month })
      })
      
      console.log('Budget API response:', res.status, res.statusText)
      
      if (res.ok) {
        const data = await res.json()
        console.log('Budget saved successfully:', data)
        setBudgets(prev => ({ ...prev, [cat]: Number(amount) }))
      } else {
        const data = await res.json()
        console.error('Budget save failed:', data)
      }
    } catch (err) {
      console.error('Error saving budget:', err)
    }
  }

  async function removeBudget(cat) {
    if (!token) return
    
    try {
      // First, find the budget ID to delete
      const month = currentMonth()
      const res = await fetch(`${API_URL}/budgets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        const budgetToDelete = data.budgets.find(b => b.category === cat && b.month === month)
        
        if (budgetToDelete) {
          // Delete from backend
          await fetch(`${API_URL}/budgets/${budgetToDelete._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        }
      }
      
      // Update local state
      setBudgets(prev => {
        const next = { ...prev }
        delete next[cat]
        return next
      })
    } catch (err) {
      console.error('Error removing budget:', err)
    }
  }

  
  function playAlert(type) {
    try {
      const ctx  = new (window.AudioContext || window.webkitAudioContext)()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = type === 'danger' ? 880 : 660
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 1)
    } catch(e) {}
  }

  
  function pushNotification(title, message) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/favicon.ico' })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(p => {
        if (p === 'granted')
          new Notification(title, { body: message, icon: '/favicon.ico' })
      })
    }
  }

  
  function sendEmailModal(cat, spent, budget, pct) {
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com'
    const userName  = localStorage.getItem('userName')  || 'User'
    const isOver    = pct >= 100

    setEmailModal({
      to:         userEmail,
      toName:     userName,
      subject:    isOver
                    ? `🚨 Budget Exceeded — ${cat}`
                    : `⚠️ Budget Alert — ${cat}`,
      category:   cat,
      spent:      `₹${spent.toLocaleString('en-IN')}`,
      budget:     `₹${budget.toLocaleString('en-IN')}`,
      percentage: pct.toFixed(0),
      remaining:  `₹${Math.max(0, budget - spent).toLocaleString('en-IN')}`,
      overspent:  isOver ? `₹${(spent - budget).toLocaleString('en-IN')}` : null,
      isOver,
      sentAt:     new Date().toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  }),
    })
  }

  function addToast(message, type = 'info') {
    const id = Date.now()
    playAlert(type)
    pushNotification(
      type === 'danger' ? '🚨 Budget Exceeded!' : '⚠️ Budget Warning',
      message
    )
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 6000)
  }

  function removeToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  function checkAlerts(cat, spent, budget) {
    if (!budget || budget <= 0) return
    const pct    = (spent / budget) * 100
    const month  = currentMonth()
    const key80  = `${month}_${cat}_80`
    const key100 = `${month}_${cat}_100`

    if (pct >= 100 && !firedAlerts[key100]) {
      addToast(`🚨 ${cat} budget exceeded! Spent ₹${spent.toLocaleString()} of ₹${budget.toLocaleString()}`, 'danger')
      sendEmailModal(cat, spent, budget, pct)
      setFiredAlerts(prev => ({ ...prev, [key100]: true }))
    } else if (pct >= 80 && pct < 100 && !firedAlerts[key80]) {
      addToast(`⚠️ ${cat} at ${pct.toFixed(0)}% — only ₹${(budget - spent).toLocaleString()} left`, 'warning')
      sendEmailModal(cat, spent, budget, pct)
      setFiredAlerts(prev => ({ ...prev, [key80]: true }))
    }
  }

  return (
    <BudgetContext.Provider value={{
      budgets, setBudget, removeBudget, loading,
      checkAlerts, toasts, removeToast,
      emailModal, setEmailModal,
    }}>
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudget() {
  return useContext(BudgetContext)
}