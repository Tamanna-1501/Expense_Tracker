import { useTx } from '../context/TxContext'
import BottomNav from '../components/BottomNav'
import { fmt, CAT_ICONS, CAT_COLORS } from '../constants'
import styles from './CategoriesPage.module.css'

export default function CategoriesPage() {
  const { categoryTotals, totalExpense, transactions } = useTx()

  const expenseTxCount = (cat) => transactions.filter(t => t.type === 'expense' && t.cat === cat).length

  return (
    <div className="page-shell">
      <div className="page-content">

        <header className={`${styles.header} anim-fade-up`}>
          <h1 className={styles.title}>Categories</h1>
          <div className={styles.totalLabel}>Total: <strong>{fmt(totalExpense)}</strong></div>
        </header>

        {/* Donut-style visual breakdown */}
        {categoryTotals.length > 0 && (
          <div className={`card anim-fade-up d1`}>
            <div className="card-title">Expense breakdown</div>
            <div className={styles.donutWrap}>
              <svg className={styles.donut} viewBox="0 0 120 120">
                {(() => {
                  const colors = ['#F0997B','#5DCAA5','#FAC775','#AFA9EC','#97C459','#85B7EB','#ED93B1','#B4B2A9']
                  let offset = 0
                  const circ = 2 * Math.PI * 45
                  return categoryTotals.slice(0,8).map(([cat, amt], i) => {
                    const pct = amt / totalExpense
                    const dash = pct * circ
                    const gap = circ - dash
                    const el = (
                      <circle
                        key={cat}
                        cx="60" cy="60" r="45"
                        fill="none"
                        stroke={colors[i % colors.length]}
                        strokeWidth="18"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset * circ}
                        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                      />
                    )
                    offset += pct
                    return el
                  })
                })()}
                <text x="60" y="56" textAnchor="middle" fontSize="10" fill="var(--ink3)" fontFamily="var(--font-body)">Total</text>
                <text x="60" y="70" textAnchor="middle" fontSize="11" fill="var(--ink)" fontFamily="var(--font-display)" fontWeight="500">
                  {categoryTotals.length} cats
                </text>
              </svg>
              <div className={styles.donutLegend}>
                {categoryTotals.slice(0,8).map(([cat, amt], i) => {
                  const colors = ['#F0997B','#5DCAA5','#FAC775','#AFA9EC','#97C459','#85B7EB','#ED93B1','#B4B2A9']
                  return (
                    <div key={cat} className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: colors[i % colors.length] }} />
                      <span className={styles.legendCat}>{cat}</span>
                      <span className={styles.legendPct}>{((amt/totalExpense)*100).toFixed(0)}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Category list */}
        <div className={`anim-fade-up d2`}>
          {categoryTotals.length === 0 ? (
            <div className="empty-state"><p>No expense data yet. Start adding transactions!</p></div>
          ) : (
            categoryTotals.map(([cat, amt], i) => {
              const pct = totalExpense ? Math.round((amt / totalExpense) * 100) : 0
              return (
                <div key={cat} className={styles.catCard}>
                  <div className={styles.catTop}>
                    <div className={styles.catIco} style={{ background: CAT_COLORS[cat] || '#f0ede7' }}>
                      {CAT_ICONS[cat] || '📦'}
                    </div>
                    <div className={styles.catInfo}>
                      <div className={styles.catName}>{cat}</div>
                      <div className={styles.catCount}>{expenseTxCount(cat)} transaction{expenseTxCount(cat) !== 1 ? 's' : ''}</div>
                    </div>
                    <div className={styles.catRight}>
                      <div className={styles.catAmt}>{fmt(amt)}</div>
                      <div className={styles.catPct}>{pct}% of total</div>
                    </div>
                  </div>
                  <div className={styles.barBg}>
                    <div className={styles.barFill} style={{ width: pct + '%', background: i === 0 ? '#F0997B' : i === 1 ? '#5DCAA5' : '#FAC775' }} />
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
