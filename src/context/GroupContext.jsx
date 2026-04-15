import { createContext, useContext, useState, useCallback } from 'react'

const GroupContext = createContext(null)

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
  const [groups, setGroups] = useState([])

  function createGroup(name, emoji, members) {
    const id = Date.now()

    setGroups(prev => [
      ...prev,
      {
        id,
        name,
        emoji,
        members,
        expenses: [],
        colors: members.reduce((acc, m, i) => {
          acc[m] = COLORS[i % COLORS.length]
          return acc
        }, {}),
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      }
    ])

    return id
  }

  function deleteGroup(groupId) {
    setGroups(prev => prev.filter(g => g.id !== groupId))
  }

  function addExpense(groupId, exp) {
    setGroups(prev =>
      prev.map(g =>
        g.id !== groupId
          ? g
          : {
              ...g,
              expenses: [
                ...g.expenses,
                {
                  ...exp,
                  id: Date.now(),
                  isSettlement: false
                }
              ]
            }
      )
    )
  }

  function deleteExpense(groupId, expId) {
    setGroups(prev =>
      prev.map(g =>
        g.id !== groupId
          ? g
          : {
              ...g,
              expenses: g.expenses.filter(e => e.id !== expId)
            }
      )
    )
  }

  function settleDebt(groupId, from, to, amount) {
    setGroups(prev =>
      prev.map(g =>
        g.id !== groupId
          ? g
          : {
              ...g,
              expenses: [
                ...g.expenses,
                {
                  id: Date.now(),
                  desc: `${from} paid ${to}`,
                  amount,
                  paidBy: from,
                  splitAmong: [to],
                  cat: 'Settlement',
                  date: new Date().toISOString().slice(0, 10),
                  isSettlement: true
                }
              ]
            }
      )
    )
  }

  const calcBalances = useCallback(group => {
    const net = {}

    group.members.forEach(m => {
      net[m] = 0
    })

    group.expenses.forEach(exp => {
      const { paidBy, amount, splitAmong = [], splitMode, customSplit } = exp

      if (!paidBy || !amount || splitAmong.length === 0) return

      if (splitMode === 'custom' && customSplit) {
        splitAmong.forEach(m => {
          const share = Number(customSplit?.[m] || 0)
          if (m !== paidBy) {
            net[paidBy] += share
            net[m] -= share
          }
        })
      } else {
        const perPerson = amount / splitAmong.length

        splitAmong.forEach(m => {
          if (m !== paidBy) {
            net[paidBy] += perPerson
            net[m] -= perPerson
          }
        })
      }
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
