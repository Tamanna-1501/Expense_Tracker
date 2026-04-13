import { useState, useMemo } from 'react'
import { useTx } from '../context/TxContext'
import BottomNav from '../components/BottomNav'
import { fmt, fmtDate, CAT_ICONS, CAT_COLORS, EXPENSE_CATS, INCOME_CATS } from '../constants'
import styles from './TransactionsPage.module.css'

const ALL_CATS = [...new Set([...EXPENSE_CATS, ...INCOME_CATS])]

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useTx()
  const [typeFilter, setTypeFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = useMemo(() => {
    return transactions
      .filter(t => typeFilter === 'all' || t.type === typeFilter)
      .filter(t => catFilter === 'all' || t.cat === catFilter)
      .filter(t => !search || t.desc.toLowerCase().includes(search.toLowerCase()) || t.cat.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, typeFilter, catFilter, search])

  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach(t => {
      const d = t.date
      if (!map[d]) map[d] = []
      map[d].push(t)
    })
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  function handleDelete(id) {
    deleteTransaction(id)
    setConfirmDelete(null)
  }

  const totalShown = filtered.reduce((a,t) => t.type === 'income' ? a + t.amount : a - t.amount, 0)

  return (
    <div className="page-shell">
      <div className="page-content">

        <header className={`${styles.header} anim-fade-up`}>
          <h1 className={styles.title}>Transactions</h1>
          <div className={`${styles.totalPill} ${totalShown >= 0 ? styles.pillPos : styles.pillNeg}`}>
            {totalShown >= 0 ? '+' : ''}{fmt(totalShown)}
          </div>
        </header>

        {/* Search */}
        <div className={`${styles.searchWrap} anim-fade-up d1`}>
          <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="9" r="6"/><line x1="13.5" y1="13.5" x2="17" y2="17"/>
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className={styles.clearBtn} onClick={() => setSearch('')}>×</button>}
        </div>

        {/* Filters */}
        <div className={`${styles.filters} anim-fade-up d2`}>
          {['all','income','expense'].map(f => (
            <button key={f} className={`chip ${typeFilter === f ? `active-${f}` : ''}`} onClick={() => setTypeFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className={`anim-fade-up d3`}>
          {grouped.length === 0 ? (
            <div className="empty-state">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--ink4)' }}>
                <rect x="6" y="8" width="28" height="28" rx="4"/><line x1="6" y1="15" x2="34" y2="15"/><line x1="13" y1="8" x2="13" y2="5"/><line x1="27" y1="8" x2="27" y2="5"/>
              </svg>
              <p>No transactions found</p>
            </div>
          ) : (
            grouped.map(([date, txs]) => (
              <div key={date} className={styles.group}>
                <div className={styles.groupDate}>{fmtDate(date)}</div>
                {txs.map(t => (
                  <div key={t.id} className={styles.txItem}>
                    <div className={styles.txIco} style={{ background: CAT_COLORS[t.cat] || '#f0ede7' }}>
                      {CAT_ICONS[t.cat] || '📦'}
                    </div>
                    <div className={styles.txBody}>
                      <div className={styles.txName}>{t.desc}</div>
                      <div className={styles.txMeta}>{t.cat}{t.note ? ` · ${t.note}` : ''}</div>
                    </div>
                    <div className={styles.txRight}>
                      <div className={`${styles.txAmt} ${t.type === 'income' ? 'amt-income' : 'amt-expense'}`}>
                        {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
                      </div>
                      <button className={styles.delBtn} onClick={() => setConfirmDelete(t.id)}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="3 4 13 4"/><path d="M5 4V3h6v1M5 4l.5 9h5L11 4"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div className={styles.overlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()}>
            <p className={styles.dialogTitle}>Delete transaction?</p>
            <p className={styles.dialogSub}>This action cannot be undone.</p>
            <div className={styles.dialogBtns}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className={`btn ${styles.btnDanger}`} onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
