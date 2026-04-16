import { useTx } from '../context/TxContext'
import BottomNav from '../components/BottomNav'
import { fmt, CAT_ICONS, CAT_COLORS } from '../constants'
import styles from './CategoriesPage.module.css'

export default function CategoriesPage() {
  const { categoryTotals, totalExpense, transactions } = useTx()

  const entries = Object.entries(categoryTotals || {})
  const hasData = entries.length > 0

  const expenseTxCount = (cat) =>
    transactions.filter(t => t.type === 'expense' && t.cat === cat).length

  const COLORS = [
    '#F08A6B',
    '#4FBF9F',
    '#E7B85C',
    '#8F87D6',
    '#7FB35A',
    '#6FA9E6',
    '#E57FA0',
    '#9A9893'
  ]

  return (
    <div className="page-shell">
      <div className="page-content">

        {/* HEADER */}
        <header className={`${styles.header} anim-fade-up`}>
          <h1 className={styles.title}>Categories</h1>
          <div className={styles.totalLabel}>
            Total:{' '}
            <strong className="amt-expense">
              {fmt(totalExpense)}
            </strong>
          </div>
        </header>

        {/* DONUT */}
        {hasData && totalExpense > 0 && (
          <div className="card anim-fade-up d1">
            <div className="card-title">Expense breakdown</div>

            <div className={styles.donutWrap}>
              <svg className={styles.donut} viewBox="0 0 120 120">

                {(() => {
                  let offset = 0
                  const circ = 2 * Math.PI * 45

                  return entries.slice(0, 8).map(([cat, amt], i) => {
                    const pct = totalExpense ? amt / totalExpense : 0
                    const dash = pct * circ
                    const gap = circ - dash

                    const el = (
                      <circle
                        key={cat}
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke={COLORS[i % COLORS.length]}
                        strokeWidth="18"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset * circ}
                        style={{
                          transformOrigin: 'center',
                          transform: 'rotate(-90deg)'
                        }}
                      />
                    )

                    offset += pct
                    return el
                  })
                })()}

                <text
                  x="60"
                  y="56"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#94A3B8"
                >
                  Total
                </text>

                <text
                  x="60"
                  y="70"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#FFFFFF"
                >
                  {entries.length} cats
                </text>

              </svg>

              {/* LEGEND */}
              <div className={styles.donutLegend}>
                {entries.slice(0, 8).map(([cat, amt], i) => (
                  <div key={cat} className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className={styles.legendCat}>{cat}</span>
                    <span className={styles.legendPct}>
                      {totalExpense
                        ? ((amt / totalExpense) * 100).toFixed(0)
                        : 0
                      }%
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* CATEGORY LIST */}
        <div className="anim-fade-up d2">

          {!hasData ? (
            <div className="empty-state">
              <p style={{ color: 'var(--ink2)' }}>
                No expense data yet. Start adding transactions!
              </p>
            </div>
          ) : (
            entries.map(([cat, amt], i) => {
              const pct = totalExpense
                ? Math.round((amt / totalExpense) * 100)
                : 0

              return (
                <div key={cat} className={styles.catCard}>

                  <div className={styles.catTop}>
                    <div
                      className={styles.catIco}
                      style={{
                        background: CAT_COLORS?.[cat] || 'var(--surface2)'
                      }}
                    >
                      {CAT_ICONS?.[cat] || '📦'}
                    </div>

                    <div className={styles.catInfo}>
                      <div className={styles.catName}>{cat}</div>
                      <div className={styles.catCount}>
                        {expenseTxCount(cat)} transaction
                        {expenseTxCount(cat) !== 1 ? 's' : ''}
                      </div>
                    </div>

                    <div className={styles.catRight}>
                      <div className={styles.catAmt}>{fmt(amt)}</div>
                      <div className={styles.catPct}>{pct}% of total</div>
                    </div>
                  </div>

                  <div className={styles.barBg}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${pct}%`,
                        background: COLORS[i % COLORS.length]
                      }}
                    />
                  </div>

                </div>
              )
            })
          )}

        </div>

      </div>

      <BottomNav />
    </div>
  )
}
        