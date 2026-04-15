export const EXPENSE_CATS = [
  'Food', 'Transport', 'Housing', 'Health',
  'Shopping', 'Entertainment', 'Utilities',
  'Education', 'Other'
]

export const INCOME_CATS = [
  'Salary', 'Freelance', 'Investment', 'Gift', 'Bonus', 'Other'
]

export const CAT_ICONS = {
  Food: '🍔',
  Transport: '🚗',
  Housing: '🏠',
  Health: '💊',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Utilities: '💡',
  Education: '📚',
  Other: '📦',

  Salary: '💼',
  Freelance: '💻',
  Investment: '📈',
  Gift: '🎁',
  Bonus: '🏆',

 
  Settlement: '✅',
}


export const CAT_COLORS = {
  Food: '#FAECE7',
  Transport: '#E1F5EE',
  Housing: '#FAEEDA',
  Health: '#FBEAF0',
  Shopping: '#FAECE7',
  Entertainment: '#EAF3DE',
  Utilities: '#E6F1FB',
  Education: '#EEEDFE',
  Other: '#F1EFE8',

  Salary: '#E1F5EE',
  Freelance: '#E6F1FB',
  Investment: '#EAF3DE',
  Gift: '#FBEAF0',
  Bonus: '#FAEEDA',
}


export const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
]

export function fmt(n) {
  return '₹' + Math.abs(n).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

export function fmtDate(d) {
  const dt = new Date(d)
  return dt.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}


export const SEED_TRANSACTIONS = [
  { id:1,  desc:'Monthly Salary',    cat:'Salary',        type:'income',  amount:85000, date:'2026-04-01', note:'' },
  { id:2,  desc:'Grocery Run',       cat:'Food',          type:'expense', amount:3200,  date:'2026-04-03', note:'Big Bazaar' },
  { id:3,  desc:'Electricity Bill',  cat:'Utilities',     type:'expense', amount:1850,  date:'2026-04-05', note:'' },
  { id:4,  desc:'Freelance Project', cat:'Freelance',     type:'income',  amount:18000, date:'2026-04-06', note:'UI Design project' },
  { id:5,  desc:'Metro Pass',        cat:'Transport',     type:'expense', amount:700,   date:'2026-04-07', note:'' },
  { id:6,  desc:'Online Shopping',   cat:'Shopping',      type:'expense', amount:4200,  date:'2026-04-08', note:'Amazon' },
  { id:7,  desc:'Restaurant Dinner', cat:'Food',          type:'expense', amount:1800,  date:'2026-04-09', note:'With family' },
  { id:8,  desc:'Bonus',             cat:'Bonus',         type:'income',  amount:10000, date:'2026-04-09', note:'Q1 bonus' },
  { id:9,  desc:'Netflix',           cat:'Entertainment', type:'expense', amount:649,   date:'2026-04-10', note:'' },
  { id:10, desc:'Medical Checkup',   cat:'Health',        type:'expense', amount:1200,  date:'2026-04-10', note:'' },
]