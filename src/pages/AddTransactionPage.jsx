import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTx } from '../context/TxContext'
import BottomNav from '../components/BottomNav'
import { EXPENSE_CATS, INCOME_CATS, CAT_ICONS, CAT_COLORS, todayStr, fmt } from '../constants'
import styles from './AddTransactionPage.module.css'

export default function AddTransactionPage() {
  const { addTransaction } = useTx()
  const navigate = useNavigate()
  const [type, setType] = useState('expense')
  const [form, setForm] = useState({ desc: '', amount: '', cat: 'Food', date: todayStr(), note: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const cats = type === 'expense' ? EXPENSE_CATS : INCOME_CATS

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError('') }

  function switchType(t) {
    setType(t)
    setForm(f => ({ ...f, cat: t === 'expense' ? 'Food' : 'Salary' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.desc.trim()) { setError('Please enter a description.'); return }
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) { setError('Please enter a valid amount.'); return }
    if (!form.date) { setError('Please select a date.'); return }
    addTransaction({ ...form, type, amount: +form.amount })
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setForm({ desc: '', amount: '', cat: type === 'expense' ? 'Food' : 'Salary', date: todayStr(), note: '' })
    }, 1200)
  }

  return (
    <div className="page-shell">
      <div className="page-content">

        <header className={`${styles.header} anim-fade-up`}>
          <h1 className={styles.title}>Add Transaction</h1>
        </header>

        {/* Type toggle */}
        <div className={`${styles.typeWrap} anim-fade-up d1`}>
          <button className={`${styles.typeBtn} ${type === 'expense' ? styles.typeBtnExpense : ''}`} onClick={() => switchType('expense')}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="3" x2="10" y2="17"/><polyline points="4 11 10 17 16 11"/></svg>
            Expense
          </button>
          <button className={`${styles.typeBtn} ${type === 'income' ? styles.typeBtnIncome : ''}`} onClick={() => switchType('income')}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="17" x2="10" y2="3"/><polyline points="4 9 10 3 16 9"/></svg>
            Income
          </button>
        </div>

        {/* Amount big input */}
        <div className={`${styles.amountCard} ${type === 'income' ? styles.amountCardIncome : styles.amountCardExpense} anim-fade-up d2`}>
          <span className={styles.currSign}>₹</span>
          <input
            className={styles.amountInput}
            type="number"
            placeholder="0"
            min="0"
            value={form.amount}
            onChange={e => set('amount', e.target.value)}
          />
          {form.amount && <span className={styles.amountPreview}>{fmt(+form.amount)}</span>}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={`anim-fade-up d3`}>
          <div className="form-group">
            <label>Description</label>
            <input type="text" placeholder="What was it?" value={form.desc} onChange={e => set('desc', e.target.value)} />
          </div>

          <div className={`${styles.formRow}`}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
          </div>

          {/* Category picker */}
          <div className="form-group">
            <label>Category</label>
            <div className={styles.catGrid}>
              {cats.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.catChip} ${form.cat === c ? styles.catChipActive : ''}`}
                  style={form.cat === c ? { background: CAT_COLORS[c], borderColor: 'transparent' } : {}}
                  onClick={() => set('cat', c)}
                >
                  <span style={{ fontSize: '15px' }}>{CAT_ICONS[c]}</span>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Note (optional)</label>
            <input type="text" placeholder="Add a short note…" value={form.note} onChange={e => set('note', e.target.value)} />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className={`btn ${type === 'income' ? 'btn-teal' : 'btn-primary'} ${styles.submitBtn}`}>
            {success
              ? <span className={styles.successCheck}>✓ Added!</span>
              : `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`
            }
          </button>
        </form>

      </div>
      <BottomNav />
    </div>
  )
}
