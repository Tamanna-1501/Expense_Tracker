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
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening'

  const monthLabel = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  const budgetLimit = 15000
  const budgetPct = Math.min(100, Math.round((totalExpense / budgetLimit) * 100))
  const savingsRate = totalIncome ? ((1 - totalExpense / totalIncome) * 100).toFixed(1) : '0.0'

  return (
    <div className="page-shell" style={{ background: 'var(--bg)' }}>
      <div className="page-content">

        {/* Header */}
        <header className={`${styles.header} anim-fade-up`}>
          <div>
            <p className={styles.greetSub} style={{ color: 'var(--ink3)' }}>
              {greeting},
            </p>
            <h1 className={styles.greetName} style={{ color: 'var(--ink1)' }}>
              {user?.name?.split(' ')[0]}{' '}
              <span style={{ color: 'var(--ink2)' }}>
                {user?.name?.split(' ').slice(1).join(' ')}
              </span>
            </h1>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.monthPill}>{monthLabel}</div>
            <div
              className={styles.avatar}
              onClick={() => navigate('/settings')}
              style={{
                background: 'var(--surface2)',
                color: 'var(--ink1)'
              }}
            >
              {user?.initials || 'U'}
            </div>
          </div>
        </header>

        {/* Balance hero (FIXED DARK MODE) */}
        <div
          className={`${styles.hero} anim-fade-up d1`}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--ink1)'
          }}
        >
          <div className={styles.heroLabel} style={{ color: 'var(--ink3)' }}>
            Total Balance
          </div>

          <div className={styles.heroAmount} style={{ color: 'var(--ink1)' }}>
            {fmt(balance)}
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div style={{ color: 'var(--ink3)' }}>Income</div>
              <div style={{ color: '#5DCAA5' }}>+{fmt(totalIncome)}</div>
            </div>

            <div className={styles.heroDivider} />

            <div className={styles.heroStat}>
              <div style={{ color: 'var(--ink3)' }}>Expenses</div>
              <div style={{ color: '#F0997B' }}>−{fmt(totalExpense)}</div>
            </div>

            <div className={styles.heroDivider} />

            <div className={styles.heroStat}>
              <div style={{ color: 'var(--ink3)' }}>Savings</div>
              <div style={{ color: 'var(--ink1)' }}>{savingsRate}%</div>
            </div>
          </div>

          <div className={styles.heroBudget}>
            <div
              className={styles.heroBudgetBar}
              style={{ background: 'var(--surface2)' }}
            >
              <div
                className={styles.heroBudgetFill}
                style={{
                  width: budgetPct + '%',
                  background: budgetPct > 85 ? '#F0997B' : '#5DCAA5'
                }}
              />
            </div>

            <div className={styles.heroBudgetLabels}>
              <span style={{ color: 'var(--ink3)' }}>
                Spent {fmt(totalExpense)}
              </span>
              <span style={{ color: 'var(--ink3)' }}>
                Budget {fmt(budgetLimit)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick stats (dark fixed) */}
        <div className={`${styles.statRow} anim-fade-up d2`}>

          <div className={styles.statCard} onClick={() => navigate('/transactions')}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className={styles.statLabel} style={{ color: 'var(--ink2)' }}>
              Transactions
            </div>
            <div className={styles.statValue} style={{ color: 'var(--ink1)' }}>
              {transactions.length}
            </div>
          </div>

          <div className={styles.statCard} onClick={() => navigate('/categories')}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className={styles.statLabel} style={{ color: 'var(--ink2)' }}>
              Categories
            </div>
            <div className={styles.statValue} style={{ color: 'var(--ink1)' }}>
              {categoryTotals.length}
            </div>
          </div>

          <div className={styles.statCard}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className={styles.statLabel} style={{ color: 'var(--ink2)' }}>
              Biggest spend
            </div>
            <div className={styles.statValue} style={{ color: 'var(--ink1)' }}>
              {catTop[0] ? fmt(catTop[0][1]) : '—'}
            </div>
          </div>

        </div>

        {/* Recent (dark safe) */}
        <div
          className={`card anim-fade-up d4`}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className={styles.sectionHeader}>
            <span style={{ color: 'var(--ink1)' }}>Recent</span>
          </div>

          <div className={styles.txList}>
            {recent.map(t => (
              <div key={t.id} className={styles.txItem}>
                <div
                  className={styles.txIco}
                  style={{ background: 'var(--surface2)' }}
                >
                  {CAT_ICONS[t.cat] || '📦'}
                </div>

                <div className={styles.txBody}>
                  <div style={{ color: 'var(--ink1)' }}>{t.desc}</div>
                  <div style={{ color: 'var(--ink3)' }}>
                    {t.cat} · {fmtDate(t.date)}
                  </div>
                </div>

                <div style={{ color: t.type === 'income' ? '#5DCAA5' : '#F0997B' }}>
                  {t.type === 'income' ? '+' : '−'}{fmt(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          className={`${styles.addCta} anim-fade-up d6`}
          onClick={() => navigate('/add')}
          style={{
            background: 'var(--teal)',
            color: '#fff'
          }}
        >
          Add a transaction
        </button>

      </div>

      <BottomNav />
    </div>
  )
}