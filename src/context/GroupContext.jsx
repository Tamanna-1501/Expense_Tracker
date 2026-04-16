import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'

const GroupContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const COLORS = [
  '#1D9E75',
  '#D85A30',
  '#6366F1',
  '#F59E0B',
  '#EC4899',
  '#14B8A6',
  '#8B5CF6',
  '#3B82F6'
]

export function GroupProvider({ children }) {
  const { token } = useAuth()
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch groups from API
  useEffect(() => {
    if (!token) { setGroups([]); return }
    
    const fetchGroups = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/groups`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const groups = (data.groups || []).map(g => ({ ...g, id: g._id }))
        setGroups(groups)
      } catch (err) {
        console.error('Error fetching groups:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchGroups()
  }, [token])

  const createGroup = useCallback(async (name, emoji, members) => {
    if (!token) return null
    try {
      const res = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, emoji, members })
      })
      if (!res.ok) throw new Error('Failed to create')
      const group = { ...data.group, id: data.group._id }
      setGroups(prev => [...prev, group])
      return data.group._id
    } catch (err) {
      console.error('Error creating group:', err)
      return null
    }
  }, [token])

  const deleteGroup = useCallback(async (groupId) => {
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/groups/${groupId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete')
      setGroups(prev => prev.filter(g => g._id !== groupId))
    } catch (err) {
      console.error('Error deleting group:', err)
    }
  }, [token])

  const addExpense = useCallback(async (groupId, exp) => {
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/groups/${groupId}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          desc: exp.desc,
          amount: exp.amount,
          paidBy: exp.paidBy,
          splitAmong: exp.splitAmong,
          cat: exp.cat,
          date: exp.date
        })
      })
      if (!res.ok) throw new Error('Failed to add expense')
      const data = await res.json()
      setGroups(prev => prev.map(g =>
        g._id === groupId
          ? { ...g, expenses: [...(g.expenses || []), data.expense] }
          : g
      ))
    } catch (err) {
      console.error('Error adding expense:', err)
    }
  }, [token])

  const deleteExpense = useCallback(async (groupId, expId) => {
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/groups/${groupId}/expenses/${expId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to delete')
      setGroups(prev => prev.map(g =>
        g._id === groupId
          ? { ...g, expenses: g.expenses.filter(e => e.id !== expId) }
          : g
      ))
    } catch (err) {
      console.error('Error deleting expense:', err)
    }
  }, [token])

  const settleDebt = useCallback(async (groupId, from, to, amount) => {
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/groups/${groupId}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          desc: `${from} paid ${to}`,
          amount,
          paidBy: from,
          splitAmong: [to],
          cat: 'Settlement',
          date: new Date().toISOString().slice(0, 10)
        })
      })
      if (!res.ok) throw new Error('Failed to settle')
      const data = await res.json()
      setGroups(prev => prev.map(g =>
        g._id === groupId
          ? { ...g, expenses: [...(g.expenses || []), data.expense] }
          : g
      ))
    } catch (err) {
      console.error('Error settling debt:', err)
    }
  }, [token])

  const calcBalances = useCallback(group => {
    const net = {}

    group.members.forEach(m => {
      net[m] = 0
    })

    group.expenses.forEach(exp => {
      const { paidBy, amount, splitAmong = [] } = exp

      if (!paidBy || !amount || splitAmong.length === 0) return

      const perPerson = amount / splitAmong.length

      splitAmong.forEach(m => {
        if (m !== paidBy) {
          net[paidBy] += perPerson
          net[m] -= perPerson
        }
      })
    })

    const creditors = []
    const debtors = []

    Object.entries(net).forEach(([name, val]) => {
      if (val > 0.01) creditors.push({ name, amount: val })
      else if (val < -0.01) debtors.push({ name, amount: -val })
    })

    const balances = []
    let i = 0
    let j = 0

    while (i < debtors.length && j < creditors.length) {
      const d = debtors[i]
      const c = creditors[j]

      const settled = Math.min(d.amount, c.amount)

      balances.push({
        from: d.name,
        to: c.name,
        amount: Math.round(settled)
      })

      d.amount -= settled
      c.amount -= settled

      if (d.amount < 0.01) i++
      if (c.amount < 0.01) j++
    }

    return balances
  }, [])

  return (
    <GroupContext.Provider
      value={{
        groups,
        createGroup,
        deleteGroup,
        addExpense,
        deleteExpense,
        settleDebt,
        calcBalances,
        loading,
        COLORS
      }}
    >
      {children}
    </GroupContext.Provider>
  )
}

export function useGroup() {
  const ctx = useContext(GroupContext)
  if (!ctx) throw new Error('useGroup must be used inside GroupProvider')
  return ctx
}
