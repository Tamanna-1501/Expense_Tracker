import { createContext, useContext, useState, useEffect } from 'react'

const GroupContext = createContext()

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState(() => {
    try { return JSON.parse(localStorage.getItem('splitGroups') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('splitGroups', JSON.stringify(groups))
  }, [groups])

  // Create a new group
  function createGroup(name, emoji, members) {
    const newGroup = {
      id:       Date.now(),
      name,
      emoji,
      members,  
      expenses: [],
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setGroups(prev => [newGroup, ...prev])
    return newGroup.id
  }

  
  function addExpense(groupId, expense) {
    // expense = { id, desc, amount, paidBy, splitAmong, date, cat }
    setGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, expenses: [{ ...expense, id: Date.now() }, ...g.expenses] }
        : g
    ))
  }

  // Delete expense from a group
  function deleteExpense(groupId, expenseId) {
    setGroups(prev => prev.map(g =>
      g.id === groupId
        ? { ...g, expenses: g.expenses.filter(e => e.id !== expenseId) }
        : g
    ))
  }

  
  function deleteGroup(groupId) {
    setGroups(prev => prev.filter(g => g.id !== groupId))
  }

  // Settle up — mark a debt as paid
  function settleDebt(groupId, from, to) {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g
      const settle = { id: Date.now(), desc: 'Settlement', amount: 0, paidBy: from, splitAmong: [from, to], date: new Date().toISOString().slice(0,10), isSettlement: true, settleFrom: from, settleTo: to }
      return { ...g, expenses: [settle, ...g.expenses] }
    }))
  }

 
  function calcBalances(group) {
    
    const net = {}
    group.members.forEach(m => net[m] = 0)

    group.expenses.forEach(exp => {
      if (exp.isSettlement) {
        // settlement clears debt from -> to
        net[exp.settleFrom] += exp.settleAmount || 0
        net[exp.settleTo]   -= exp.settleAmount || 0
        return
      }
      const share = exp.amount / exp.splitAmong.length
      
      net[exp.paidBy] = (net[exp.paidBy] || 0) + exp.amount
      
      exp.splitAmong.forEach(m => {
        net[m] = (net[m] || 0) - share
      })
    })

    
    const debts = []
    const pos = Object.entries(net).filter(([,v]) => v > 0.01).sort((a,b) => b[1]-a[1])
    const neg = Object.entries(net).filter(([,v]) => v < -0.01).sort((a,b) => a[1]-b[1])

    let i = 0, j = 0
    const p = pos.map(([k,v]) => ({ name:k, amt:v }))
    const n = neg.map(([k,v]) => ({ name:k, amt:-v }))

    while (i < p.length && j < n.length) {
      const settle = Math.min(p[i].amt, n[j].amt)
      if (settle > 0.01) {
        debts.push({ from: n[j].name, to: p[i].name, amount: Math.round(settle) })
      }
      p[i].amt -= settle
      n[j].amt -= settle
      if (p[i].amt < 0.01) i++
      if (n[j].amt < 0.01) j++
    }

    return debts
  }

  return (
    <GroupContext.Provider value={{
      groups, createGroup, addExpense,
      deleteExpense, deleteGroup, settleDebt, calcBalances,
    }}>
      {children}
    </GroupContext.Provider>
  )
}

export function useGroup() {
  return useContext(GroupContext)
}
