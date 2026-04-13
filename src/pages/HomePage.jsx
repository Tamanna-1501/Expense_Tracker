import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTx } from '../context/TxContext'
import BottomNav from '../components/BottomNav'
import { fmt, fmtDate, CAT_ICONS, CAT_COLORS } from '../constants'
import styles from './HomePage.module.css'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function HomePage() {
  const { user } = useAuth()
  const { transactions, totalIncome, totalExpense, balance, categoryTotals, monthlyData } = useTx()
  const navigate = useNavigate()

  const recent = [...transactions].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 4)
  const catTop = categoryTotals.slice(0, 4)
  const catMax = catTop[0]?.[1] || 1
  const barMax = Math.max(...monthlyData.flatMap(d=>[d.inc, d.exp]), 1)
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const monthLabel = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const budgetLimit = 15000
  const budgetPct = Math.min(100, Math.round((totalExpense / budgetLimit) * 100))
  const savingsRate = totalIncome ? ((1 - totalExpense / totalIncome) * 100).toFixed(1) : '0.0'

  return (
    <div className="page-shell">
      <div className="page-content">

        {/* Header */}
        <header className={`${styles.header} anim-fade-up`}>
          <div>
            <p className={styles.greetSub}>{greeting},</p>
            <h1 className={styles.greetName}>{user?.name?.split(' ')[0]} <span>{user?.name?.split(' ').slice(1).join(' ')}</span></h1>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.monthPill}>{monthLabel}</div>
            <div className={styles.avatar} onClick={() => navigate('/settings')}>{user?.initials || 'U'}</div>
          </div>
        </header>

        {/* Balance hero */}
        <div className={`${styles.hero} anim-fade-up d1`}>
          <div className={styles.heroLabel}>Total Balance</div>
          <div className={styles.heroAmount}>{fmt(balance)}</div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.heroStatLbl}>Income</div>
              <div className={`${styles.heroStatVal} ${styles.up}`}>+{fmt(totalIncome)}</div>
            </div>
            <div className={styles.heroDivider} />
            <div className={styles.heroStat}>
              <div className={styles.heroStatLbl}>Expenses</div>
              <div className={`${styles.heroStatVal} ${styles.down}`}>−{fmt(totalExpense)}</div>
            </div>
            <div className={styles.heroDivider} />
            <div className={styles.heroStat}>
              <div className={styles.heroStatLbl}>Savings</div>
              <div className={`${styles.heroStatVal} ${styles.up}`}>{savingsRate}%</div>
            </div>
          </div>
          <div className={styles.heroBudget}>
            <div className={styles.heroBudgetBar}>
              <div className={styles.heroBudgetFill} style={{ width: budgetPct + '%', background: budgetPct > 85 ? '#F0997B' : '#5DCAA5' }} />
            </div>
            <div className={styles.heroBudgetLabels}>
              <span>Spent {fmt(totalExpense)}</span>
              <span>Budget {fmt(budgetLimit)}</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className={`${styles.statRow} anim-fade-up d2`}>
          <div className={styles.statCard} onClick={() => navigate('/transactions')}>
            <div className={styles.statIcon} style={{ background: '#E1F5EE' }}>
              <svg viewBox="0 0 20 20" fill="none" stroke="#1D9E75" strokeWidth="1.6"><polyline points="4 14 8 10 12 13 16 7"/></svg>
            </div>
            <div className={styles.statLabel}>Transactions</div>
            <div className={styles.statValue}>{transactions.length}</div>
            <div className={`${styles.statHint} ${styles.up}`}>This month</div>
          </div>
          <div className={styles.statCard} onClick={() => navigate('/categories')}>
            <div className={styles.statIcon} style={{ background: '#FAECE7' }}>
              <svg viewBox="0 0 20 20" fill="none" stroke="#D85A30" strokeWidth="1.6"><rect x="2" y="2" width="7" height="7" rx="1"/><rect x="11" y="2" width="7" height="7" rx="1"/><rect x="2" y="11" width="7" height="7" rx="1"/><rect x="11" y="11" width="7" height="7" rx="1"/></svg>
            </div>
            <div className={styles.statLabel}>Categories</div>
            <div className={styles.statValue}>{categoryTotals.length}</div>
            <div className={`${styles.statHint} ${styles.down}`}>Active</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#FAEEDA' }}>
              <svg viewBox="0 0 20 20" fill="none" stroke="#BA7517" strokeWidth="1.6"><circle cx="10" cy="10" r="7"/><line x1="10" y1="6" x2="10" y2="11"/><circle cx="10" cy="13.5" r="0.8" fill="#BA7517"/></svg>
            </div>
            <div className={styles.statLabel}>Biggest spend</div>
            <div className={styles.statValue} style={{ fontSize: '16px' }}>{catTop[0] ? fmt(catTop[0][1]) : '—'}</div>
            <div className={`${styles.statHint}`} style={{ color: 'var(--ink3)' }}>{catTop[0]?.[0] || 'None'}</div>
          </div>
        </div>

        {/* Monthly chart */}
        {monthlyData.length > 0 && (
          <div className={`card anim-fade-up d3`}>
            <div className={styles.sectionHeader}>
              <span className="card-title" style={{ marginBottom: 0 }}>Monthly overview</span>
              <div className={styles.legend}>
                <span className={styles.legItem}><span className={styles.legDot} style={{ background: '#5DCAA5' }} />Income</span>
                <span className={styles.legItem}><span className={styles.legDot} style={{ background: '#F0997B' }} />Expense</span>
              </div>
            </div>
            <div className={styles.chartBars}>
              {monthlyData.map(d => (
                <div key={d.label} className={styles.barCol}>
                  <div className={styles.barPair}>
                    <div className={`${styles.bar} ${styles.barIn}`} style={{ height: Math.round((d.inc / barMax) * 80) + 'px' }} />
                    <div className={`${styles.bar} ${styles.barOut}`} style={{ height: Math.round((d.exp / barMax) * 80) + 'px' }} />
                  </div>
                  <span className={styles.barLabel}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent transactions */}
        <div className={`card anim-fade-up d4`}>
          <div className={styles.sectionHeader}>
            <span className="card-title" style={{ marginBottom: 0 }}>Recent</span>
            <button className={styles.seeAll} onClick={() => navigate('/transactions')}>See all →</button>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state"><p>No transactions yet</p></div>
          ) : (
            <div className={styles.txList}>
              {recent.map(t => (
                <div key={t.id} className={styles.txItem}>
                  <div className={styles.txIco} style={{ background: CAT_COLORS[t.cat] || '#f0ede7' }}>
                    {CAT_ICONS[t.cat] || '📦'}
                  </div>
                  <div className={styles.txBody}>
                    <div className={styles.txName}>{t.desc}</div>
                    <div className={styles.txMeta}>{t.cat} · {fmtDate(t.date)}</div>
                  </div>
                  <div className={`${styles.txAmt} ${t.type === 'income' ? 'amt-income' : 'amt-expense'}`}>
                    {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top categories */}
        {catTop.length > 0 && (
          <div className={`card anim-fade-up d5`}>
            <div className={styles.sectionHeader}>
              <span className="card-title" style={{ marginBottom: 0 }}>Top spending</span>
              <button className={styles.seeAll} onClick={() => navigate('/categories')}>Details →</button>
            </div>
            {catTop.map(([cat, amt]) => (
              <div key={cat} className={styles.catRow}>
                <div className={styles.catIco} style={{ background: CAT_COLORS[cat] || '#f0ede7' }}>{CAT_ICONS[cat] || '📦'}</div>
                <div className={styles.catName}>{cat}</div>
                <div className={styles.catBarBg}>
                  <div className={styles.catBarFill} style={{ width: Math.round((amt / catMax) * 100) + '%' }} />
                </div>
                <div className={styles.catAmt}>{fmt(amt)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Add CTA */}
        <button className={`${styles.addCta} anim-fade-up d6`} onClick={() => navigate('/add')}>
          <div className={styles.addCircle}>
            <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2.2"><line x1="10" y1="4" x2="10" y2="16"/><line x1="4" y1="10" x2="16" y2="10"/></svg>
          </div>
          <div className={styles.addText}>
            <p>Add a transaction</p>
            <span>Log income or expense instantly</span>
          </div>
          <span className={styles.addArrow}>↗</span>
        </button>

      </div>
      <BottomNav />
    </div>
  )
}
