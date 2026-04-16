import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { useBudget } from './BudgetContext'

const TxContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function TxProvider({ children }) {
  const { user, token } = useAuth()
  const { budgets, checkAlerts } = useBudget()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch transactions from API
  useEffect(() => {
    if (!user || !token) { setTransactions([]); return }
    
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/expenses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const formatted = data.expenses.map(e => ({
          id: e._id,
          title: e.title,
          amount: e.amount,
          cat: e.category,
          desc: e.description,
          date: new Date(e.date).toISOString().slice(0, 10),
          type: e.type
        }))
        setTransactions(formatted)
      } catch (err) {
        console.error('Error fetching transactions:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTransactions()
  }, [user, token])

  const addTransaction = useCallback(async (tx) => {
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: tx.desc,
          amount: tx.amount,
          category: tx.cat,
          description: tx.desc,
          date: new Date(tx.date),
          type: tx.type
        })
      })
      if (!res.ok) throw new Error('Failed to add')
      const data = await res.json()
      const newTx = {
        id: data.expense._id,
        title: data.expense.title,
        amount: data.expense.amount,
        cat: data.expense.category,
        desc: data.expense.description,
        date: new Date(data.expense.date).toISOString().slice(0, 10),
        type: data.expense.type
      }
      setTransactions(prev => [newTx, ...prev])
      
      // Check budget alerts for expense transactions
      if (tx.type === 'expense' && budgets[tx.cat]) {
        const currentMonth = new Date().toISOString().slice(0, 7)
        const monthlySpent = [...transactions, newTx]
          .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth) && t.cat === tx.cat)
          .reduce((sum, t) => sum + t.amount, 0)
        checkAlerts(tx.cat, monthlySpent, budgets[tx.cat])
      }
    } catch (err) {
      console.error('Error adding transaction:', err)
    }
  }, [token, budgets, checkAlerts, transactions])

  const deleteTransaction = useCallback(async (id) => {
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete')
      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error deleting transaction:', err)
    }
  }, [token])

  const editTransaction = useCallback(async (id, updates) => {
    if (!token) return
    try {
      const body = {
        ...(updates.title && { title: updates.title }),
        ...(updates.amount !== undefined && { amount: updates.amount }),
        ...(updates.cat && { category: updates.cat }),
        ...(updates.desc !== undefined && { description: updates.desc }),
        ...(updates.date && { date: new Date(updates.date) })
      }
      const res = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error('Failed to update')
      const data = await res.json()
      setTransactions(prev => prev.map(t => 
        t.id === id 
          ? {
              id: data.expense._id,
              title: data.expense.title,
              amount: data.expense.amount,
              cat: data.expense.category,
              desc: data.expense.description,
              date: new Date(data.expense.date).toISOString().slice(0, 10),
              type: data.expense.type
            }
          : t
      ))
    } catch (err) {
      console.error('Error updating transaction:', err)
    }
  }, [token])

  const totalIncome  = useMemo(() => transactions.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0), [transactions])
  const totalExpense = useMemo(() => transactions.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0), [transactions])
  const balance      = totalIncome - totalExpense

  const categoryTotals = useMemo(() => {
    const m = {}
    transactions.filter(t=>t.type==='expense').forEach(t=>{ m[t.cat]=(m[t.cat]||0)+t.amount })
    return Object.entries(m).sort((a,b)=>b[1]-a[1])
  }, [transactions])

  const monthlyData = useMemo(() => {
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const m = {}
    transactions.forEach(t=>{
      const mo = t.date.slice(5,7)
      if(!m[mo]) m[mo]={inc:0,exp:0}
      if(t.type==='income') m[mo].inc+=t.amount
      else m[mo].exp+=t.amount
    })
    return Object.entries(m).sort().slice(-5).map(([k,v])=>({ label: MONTHS[parseInt(k)-1], ...v }))
  }, [transactions])

  return (
    <TxContext.Provider value={{ transactions, addTransaction, deleteTransaction, editTransaction, totalIncome, totalExpense, balance, categoryTotals, monthlyData, loading }}>
      {children}
    </TxContext.Provider>
  )
}

export function useTx() { return useContext(TxContext) }
