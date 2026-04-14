import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBudget } from '../context/BudgetContext'
import { useTx } from '../context/TxContext'
import BottomNav from '../components/BottomNav'
import { EXPENSE_CATS, CAT_ICONS, CAT_COLORS, fmt } from '../constants'

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

function getStatus(pct) {
  if (pct >= 100) return { label: 'Exceeded!', color: '#D85A30', bg: '#fef0eb', bar: '#D85A30' }
  if (pct >= 80)  return { label: 'Warning',   color: '#F59E0B', bg: '#FAEEDA', bar: '#F59E0B' }
  return               { label: 'On track',   color: '#1D9E75', bg: '#e8f5f0', bar: '#1D9E75' }
}

// ── Toast stack ──
function ToastStack({ toasts, removeToast }) {
  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
      width: 'min(90vw, 420px)', pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          pointerEvents: 'all',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10,
          padding: '12px 16px', borderRadius: 14,
          background: t.type === 'danger' ? '#D85A30' : t.type === 'warning' ? '#F59E0B' : '#1D9E75',
          color: '#fff', fontSize: 13, fontWeight: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
          animation: 'slideDown 0.3s ease',
        }}>
          <span>{t.message}</span>
          <button onClick={() => removeToast(t.id)} style={{
            background: 'rgba(255,255,255,0.25)', border: 'none', color: '#fff',
            borderRadius: 6, cursor: 'pointer', padding: '1px 7px', fontSize: 13, flexShrink: 0,
          }}>✕</button>
        </div>
      ))}
      <style>{`@keyframes slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}

// ── Email modal ──
function EmailModal({ email, onClose, onViewBudget }) {
  if (!email) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, width: '100%', maxWidth: 420,
        overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        animation: 'popUp 0.3s ease',
      }}>

        {/* ── Email header bar ── */}
        <div style={{
          background: email.isOver ? '#D85A30' : '#F59E0B',
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>📧</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>Email Notification Sent</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>{email.sentAt}</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.25)', border: 'none',
            color: '#fff', borderRadius: 8, padding: '4px 10px',
            cursor: 'pointer', fontSize: 16, fontWeight: 700,
          }}>✕</button>
        </div>

        {/* ── Email meta ── */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
          {[
            { label: 'From', value: 'alerts@fintrack.app' },
            { label: 'To',   value: email.to },
            { label: 'Sub',  value: email.subject },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: 13 }}>
              <span style={{ color: '#999', width: 36, flexShrink: 0 }}>{row.label}:</span>
              <span style={{ color: '#111', fontWeight: row.label === 'Sub' ? 600 : 400 }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* ── Email body ── */}
        <div style={{ padding: '16px 18px' }}>
          <div style={{ fontSize: 14, color: '#333', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 12px' }}>Hi <strong>{email.toName}</strong>,</p>
            <p style={{ margin: '0 0 14px', color: email.isOver ? '#D85A30' : '#B45309', fontWeight: 600 }}>
              {email.isOver
                ? `🚨 Your ${email.category} budget has been exceeded!`
                : `⚠️ Your ${email.category} budget has reached ${email.percentage}%!`}
            </p>

            {/* Stats table */}
            <div style={{
              background: email.isOver ? '#fef0eb' : '#FAEEDA',
              borderRadius: 12, padding: '12px 14px', marginBottom: 14,
            }}>
              {[
                { label: 'Category', value: email.category },
                { label: 'Spent',    value: email.spent },
                { label: 'Budget',   value: email.budget },
                { label: 'Usage',    value: `${email.percentage}%` },
                email.isOver
                  ? { label: 'Overspent', value: email.overspent, highlight: true }
                  : { label: 'Remaining', value: email.remaining },
              ].map(row => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '4px 0', fontSize: 13,
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                }}>
                  <span style={{ color: '#666' }}>{row.label}</span>
                  <span style={{
                    fontWeight: 600,
                    color: row.highlight ? '#D85A30' : '#111',
                  }}>{row.value}</span>
                </div>
              ))}
            </div>

            <p style={{ margin: 0, fontSize: 12, color: '#999' }}>
              — FinTrack Budget Planner
            </p>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div style={{
          padding: '12px 18px 18px',
          display: 'flex', gap: 10,
        }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', borderRadius: 12,
            border: '1.5px solid #e5e7eb', background: '#fff',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#555',
          }}>Close</button>
          <button onClick={onViewBudget} style={{
            flex: 2, padding: '10px', borderRadius: 12,
            border: 'none',
            background: email.isOver ? '#D85A30' : '#F59E0B',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff',
          }}>View Budget →</button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes popUp  { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  )
}

export default function BudgetPage() {
  const navigate = useNavigate()
  const { budgets, setBudget, removeBudget, checkAlerts, toasts, removeToast, emailModal, setEmailModal } = useBudget()
  const { transactions } = useTx()

  const [editingCat, setEditingCat] = useState(null)
  const [inputVal,   setInputVal]   = useState('')
  const [showAdd,    setShowAdd]    = useState(false)

  const spentThisMonth = useMemo(() => {
    const month = currentMonth()
    const map = {}
    transactions.forEach(tx => {
      if (tx.type === 'expense' && tx.date.startsWith(month)) {
        map[tx.cat] = (map[tx.cat] || 0) + tx.amount
      }
    })
    return map
  }, [transactions])

  const budgetedCats  = EXPENSE_CATS.filter(c => budgets[c] !== undefined)
  const availableCats = EXPENSE_CATS.filter(c => budgets[c] === undefined)

  useEffect(() => {
    budgetedCats.forEach(cat => {
      checkAlerts(cat, spentThisMonth[cat] || 0, budgets[cat])
    })
  }, [spentThisMonth, budgets]) // eslint-disable-line

  function startEdit(cat, existing) {
    setEditingCat(cat)
    setInputVal(existing ? String(existing) : '')
  }

  function saveEdit(cat) {
    const val = parseFloat(inputVal)
    if (!isNaN(val) && val > 0) setBudget(cat, val)
    setEditingCat(null)
    setInputVal('')
  }

  function handleAddCat(cat) {
    startEdit(cat, null)
    setShowAdd(false)
  }

  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0)
  const totalSpent  = budgetedCats.reduce((s, c) => s + (spentThisMonth[c] || 0), 0)
  const totalPct    = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0
  const totalStatus = getStatus(totalPct)

  return (
    <div className="page-shell" style={{ background: 'var(--bg,#f5f5f5)' }}>

      <ToastStack toasts={toasts} removeToast={removeToast} />

      {/* ── Email modal ── */}
      <EmailModal
        email={emailModal}
        onClose={() => setEmailModal(null)}
        onViewBudget={() => { setEmailModal(null); navigate('/budget') }}
      />

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 80px' }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '20px 20px 16px',
          background: 'var(--surface,#fff)',
          borderBottom: '1px solid var(--border,#e5e7eb)',
        }}>
          <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink2,#555)', padding: 0, display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink1,#111)' }}>Budget Planner</div>
            <div style={{ fontSize: 12, color: 'var(--ink3,#999)' }}>
              {new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          {availableCats.length > 0 && (
            <button onClick={() => setShowAdd(s => !s)} style={{
              background: '#1D9E75', border: 'none', cursor: 'pointer',
              color: '#fff', borderRadius: 10, padding: '6px 14px',
              fontSize: 13, fontWeight: 600,
            }}>+ Add</button>
          )}
        </div>

        {/* ── 🧪 TEST BUTTONS — delete after demo ── */}
        <div style={{ margin: '12px 16px 0', display: 'flex', gap: 8 }}>
          <button onClick={() => {
            localStorage.removeItem('budgetAlerts')
            checkAlerts('Food', 9000, 10000)
          }} style={{
            flex: 1, padding: '10px', background: '#F59E0B',
            color: '#fff', border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>🧪 Test 80%</button>
          <button onClick={() => {
            localStorage.removeItem('budgetAlerts')
            checkAlerts('Food', 11000, 10000)
          }} style={{
            flex: 1, padding: '10px', background: '#D85A30',
            color: '#fff', border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>🧪 Test 100%</button>
        </div>

        {/* ── Category picker ── */}
        {showAdd && (
          <div style={{ margin: '12px 16px 0', background: 'var(--surface,#fff)', borderRadius: 16, padding: '14px 16px', border: '1px solid var(--border,#e5e7eb)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink1,#111)', marginBottom: 10 }}>Pick a category to budget:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {availableCats.map(cat => (
                <button key={cat} onClick={() => handleAddCat(cat)} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: CAT_COLORS[cat] || '#f5f5f5',
                  border: '1px solid var(--border,#e5e7eb)',
                  borderRadius: 20, padding: '6px 12px',
                  fontSize: 13, cursor: 'pointer', color: 'var(--ink1,#111)',
                }}>
                  <span style={{ fontSize: 15 }}>{CAT_ICONS[cat]}</span> {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Overall summary ── */}
        {budgetedCats.length > 0 && (
          <div style={{ margin: '12px 16px 0', background: 'var(--surface,#fff)', borderRadius: 16, padding: '16px 18px', border: '1px solid var(--border,#e5e7eb)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--ink3,#999)' }}>Total Budget</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink1,#111)' }}>{fmt(totalBudget)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: 'var(--ink3,#999)' }}>Spent</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: totalStatus.color }}>{fmt(totalSpent)}</div>
              </div>
            </div>
            <div style={{ background: '#f0f0f0', borderRadius: 8, height: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 8, width: `${totalPct}%`, background: totalStatus.bar, transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
              <span style={{ color: 'var(--ink3,#999)' }}>{totalPct.toFixed(0)}% used</span>
              <span style={{ color: 'var(--ink3,#999)' }}>{fmt(Math.max(0, totalBudget - totalSpent))} left</span>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {budgetedCats.length === 0 && (
          <div style={{ margin: '40px 16px 0', textAlign: 'center', color: 'var(--ink3,#999)', fontSize: 14 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
            <div style={{ fontWeight: 600, color: 'var(--ink2,#555)', marginBottom: 4 }}>No budgets set yet</div>
            <div>Tap <strong>+ Add</strong> to set a monthly budget for any category</div>
          </div>
        )}

        {/* ── Per category cards ── */}
        {budgetedCats.map(cat => {
          const budget    = budgets[cat]
          const spent     = spentThisMonth[cat] || 0
          const pct       = Math.min(100, (spent / budget) * 100)
          const status    = getStatus(pct)
          const isEditing = editingCat === cat

          return (
            <div key={cat} style={{
              margin: '10px 16px 0', background: 'var(--surface,#fff)',
              borderRadius: 16, padding: '14px 16px',
              border: `1px solid ${pct >= 100 ? '#D85A30' : pct >= 80 ? '#F59E0B' : 'var(--border,#e5e7eb)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: CAT_COLORS[cat] || '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {CAT_ICONS[cat]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink1,#111)' }}>{cat}</div>
                    <div style={{ fontSize: 11, color: status.color, background: status.bg, borderRadius: 6, padding: '1px 6px', display: 'inline-block', marginTop: 2 }}>
                      {pct >= 100 ? '🚨' : pct >= 80 ? '⚠️' : '✅'} {status.label}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => startEdit(cat, budget)} style={{ background: 'none', border: '1px solid var(--border,#e5e7eb)', borderRadius: 8, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: 'var(--ink2,#555)' }}>Edit</button>
                  <button onClick={() => removeBudget(cat)} style={{ background: 'none', border: '1px solid #fcc', borderRadius: 8, padding: '4px 10px', fontSize: 12, cursor: 'pointer', color: '#D85A30' }}>✕</button>
                </div>
              </div>

              {isEditing && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <input
                    type="number" value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder="Enter budget amount" autoFocus
                    style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: '1.5px solid #1D9E75', fontSize: 14, outline: 'none', background: 'var(--bg,#f5f5f5)', color: 'var(--ink1,#111)' }}
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(cat) }}
                  />
                  <button onClick={() => saveEdit(cat)} style={{ background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setEditingCat(null)} style={{ background: 'none', border: '1px solid var(--border,#e5e7eb)', borderRadius: 10, padding: '8px 12px', fontSize: 13, cursor: 'pointer', color: 'var(--ink2,#555)' }}>Cancel</button>
                </div>
              )}

              <div style={{ background: '#f0f0f0', borderRadius: 8, height: 8, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 8, width: `${pct}%`, background: status.bar, transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
                <span style={{ color: 'var(--ink3,#999)' }}>{fmt(spent)} spent of {fmt(budget)}</span>
                <span style={{ color: status.color, fontWeight: 600 }}>
                  {pct >= 100 ? `Over by ${fmt(spent - budget)}` : `${fmt(budget - spent)} left`}
                </span>
              </div>

              {pct >= 100 && (
                <div style={{ marginTop: 8, padding: '7px 10px', background: '#fef0eb', borderRadius: 8, fontSize: 12, color: '#D85A30', fontWeight: 600 }}>
                  🚨 Budget exceeded! You've overspent by {fmt(spent - budget)}
                </div>
              )}
              {pct >= 80 && pct < 100 && (
                <div style={{ marginTop: 8, padding: '7px 10px', background: '#FAEEDA', borderRadius: 8, fontSize: 12, color: '#B45309', fontWeight: 600 }}>
                  ⚠️ Almost there! Only {fmt(budget - spent)} remaining
                </div>
              )}
            </div>
          )
        })}

      </div>
      <BottomNav />
    </div>
  )
}
