import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTx } from '../context/TxContext'
import BottomNav from '../components/BottomNav'
import { fmt, fmtDate, CAT_ICONS, CAT_COLORS, EXPENSE_CATS, INCOME_CATS } from '../constants'
import styles from './TransactionsPage.module.css'

const ALL_CATS = [...new Set([...EXPENSE_CATS, ...INCOME_CATS])]

export default function TransactionsPage() {
  const { transactions, deleteTransaction } = useTx()
  const navigate = useNavigate()

  const [typeFilter, setTypeFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = useMemo(() => {
    return transactions
      .filter(t => typeFilter === 'all' || t.type === typeFilter)
      .filter(t => catFilter === 'all' || t.cat === catFilter)
      .filter(t =>
        !search ||
        t.desc.toLowerCase().includes(search.toLowerCase()) ||
        t.cat.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [transactions, typeFilter, catFilter, search])

  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach(t => {
      if (!map[t.date]) map[t.date] = []
      map[t.date].push(t)
    })
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  function handleDelete(id) {
    deleteTransaction(id)
    setConfirmDelete(null)
  }

  const totalShown = filtered.reduce(
    (a, t) => (t.type === 'income' ? a + t.amount : a - t.amount),
    0
  )

  return (
    <div className="page-shell">
      <div className="page-content">

        {/* HEADER */}
        <header className={`${styles.header} anim-fade-up`}>
          <h1 className={styles.title} style={{ color: 'var(--ink)' }}>
            Transactions
          </h1>

          <div
            className={`${styles.totalPill} ${
              totalShown >= 0 ? styles.pillPos : styles.pillNeg
            }`}
          >
            {totalShown >= 0 ? '+' : ''}
            {fmt(totalShown)}
          </div>
        </header>

        {/* SEARCH */}
        <div className={`${styles.searchWrap} anim-fade-up d1`}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search transactions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'var(--surface)',
              color: 'var(--ink)',
              border: '1px solid var(--border)'
            }}
          />

          {search && (
            <button
              className={styles.clearBtn}
              onClick={() => setSearch('')}
              style={{ color: 'var(--ink2)' }}
            >
              ×
            </button>
          )}
        </div>

        {/* FILTERS */}
        <div className={`${styles.filters} anim-fade-up d2`}>
          {['all', 'income', 'expense'].map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`chip ${typeFilter === f ? `active-${f}` : ''}`}
              style={{
                color: 'var(--ink)',
                border: '1px solid var(--border)',
                background:
                  typeFilter === f ? 'var(--surface2)' : 'transparent'
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="anim-fade-up d3">
          {grouped.length === 0 ? (
            <div className="empty-state" style={{ color: 'var(--ink3)' }}>
              <p>
                {transactions.length === 0
                  ? 'No transactions yet. Add your first expense!'
                  : 'No matching transactions found'}
              </p>

              {transactions.length === 0 && (
                <button
                  onClick={() => navigate('/add')}
                  className="btn btn-teal"
                >
                  Add Expense
                </button>
              )}
            </div>
          ) : (
            grouped.map(([date, txs]) => (
              <div key={date} className={styles.group}>
                <div
                  className={styles.groupDate}
                  style={{ color: 'var(--ink2)' }}
                >
                  {fmtDate(date)}
                </div>

                {txs.map(t => (
                  <div
                    key={t.id}
                    className={styles.txItem}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    {/* ICON */}
                    <div
                      className={styles.txIco}
                      style={{
                        background: CAT_COLORS[t.cat] || 'var(--surface2)'
                      }}
                    >
                      {CAT_ICONS[t.cat] || '📦'}
                    </div>

                    {/* BODY */}
                    <div className={styles.txBody}>
                      <div
                        className={styles.txName}
                        style={{ color: 'var(--ink)' }}
                      >
                        {t.desc}
                      </div>

                      <div
                        className={styles.txMeta}
                        style={{ color: 'var(--ink3)' }}
                      >
                        {t.cat}
                        {t.note ? ` · ${t.note}` : ''}
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className={styles.txRight}>
                      <div
                        className={`${styles.txAmt} ${
                          t.type === 'income'
                            ? 'amt-income'
                            : 'amt-expense'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '−'}
                        {fmt(t.amount)}
                      </div>

                      <button
                        className={styles.delBtn}
                        onClick={() => setConfirmDelete(t.id)}
                        style={{ color: 'var(--ink3)' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {confirmDelete && (
        <div
          className={styles.overlay}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className={styles.dialog}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--surface)',
              color: 'var(--ink)'
            }}
          >
            <p className={styles.dialogTitle}>Delete transaction?</p>
            <p className={styles.dialogSub}>This action cannot be undone.</p>

            <div className={styles.dialogBtns}>
              <button className="btn btn-ghost">
                Cancel
              </button>

              <button
                className="btn btn-teal"
                onClick={() => handleDelete(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}