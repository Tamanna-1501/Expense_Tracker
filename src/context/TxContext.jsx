import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useAuth } from './AuthContext'
import { SEED_TRANSACTIONS } from '../constants'

const TxContext = createContext(null)

function storageKey(email) { return `pt_txs_${email}` }

export function TxProvider({ children }) {
  const { user } = useAuth()

  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (!user) { setTransactions([]); return }
    try {
      const stored = localStorage.getItem(storageKey(user.email))
      setTransactions(stored ? JSON.parse(stored) : SEED_TRANSACTIONS)
    } catch { setTransactions(SEED_TRANSACTIONS) }
  }, [user])

  useEffect(() => {
    if (!user) return
    localStorage.setItem(storageKey(user.email), JSON.stringify(transactions))
  }, [transactions, user])

  const nextId = useMemo(() => Math.max(...transactions.map(t => t.id), 0) + 1, [transactions])

  function addTransaction(tx) {
    setTransactions(prev => [{ ...tx, id: nextId }, ...prev])
  }

  function deleteTransaction(id) {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  function editTransaction(id, updates) {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

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
    <TxContext.Provider value={{ transactions, addTransaction, deleteTransaction, editTransaction, totalIncome, totalExpense, balance, categoryTotals, monthlyData }}>
      {children}
    </TxContext.Provider>
  )
}

export function useTx() { return useContext(TxContext) }
