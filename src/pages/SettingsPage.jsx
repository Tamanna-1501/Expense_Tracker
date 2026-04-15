import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTx } from '../context/TxContext'
import BottomNav from '../components/BottomNav'
import { fmt } from '../constants'
import styles from './SettingsPage.module.css'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { transactions, totalIncome, totalExpense } = useTx()
  const navigate = useNavigate()

  const [confirmLogout, setConfirmLogout] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const joined = new Date().toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="page-shell" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="page-content">

        {/* PROFILE */}
        <div className={`${styles.profileHero} anim-fade-up`}>

          <div className={styles.profileAvatar}>
            {user?.initials || 'U'}
          </div>

          <div className={styles.profileInfo}>
            <h1 className={styles.profileName} style={{ color: 'var(--text)' }}>
              {user?.name}
            </h1>

            <p className={styles.profileEmail} style={{ color: 'var(--text3)' }}>
              {user?.email}
            </p>

            <p className={styles.profileMeta} style={{ color: 'var(--text3)' }}>
              Member since {joined}
            </p>
          </div>

        </div>

        {/* STATS */}
        <div className={`${styles.statsStrip} anim-fade-up d1`}>

          <div className={styles.stripStat}>
            <div className={styles.stripVal} style={{ color: 'var(--text)' }}>
              {transactions.length}
            </div>
            <div className={styles.stripLabel}>Transactions</div>
          </div>

          <div className={styles.stripDivider} />

          <div className={styles.stripStat}>
            <div className={`${styles.stripVal}`} style={{ color: 'var(--teal)' }}>
              {fmt(totalIncome)}
            </div>
            <div className={styles.stripLabel}>Income</div>
          </div>

          <div className={styles.stripDivider} />

          <div className={styles.stripStat}>
            <div className={`${styles.stripVal}`} style={{ color: 'var(--coral)' }}>
              {fmt(totalExpense)}
            </div>
            <div className={styles.stripLabel}>Spent</div>
          </div>

        </div>

        {/* ACCOUNT */}
        <div className={`${styles.section} anim-fade-up d2`}>
          <div className={styles.sectionTitle}>Account</div>

          <div className={styles.menuCard}>

            <div className={styles.menuItem}>
              <div className={styles.menuIcon} style={{ background: 'var(--teal-l)' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="var(--teal)" strokeWidth="1.6">
                  <circle cx="10" cy="7" r="3.5" />
                  <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" />
                </svg>
              </div>

              <div className={styles.menuText}>
                <div className={styles.menuLabel} style={{ color: 'var(--text)' }}>Full name</div>
                <div className={styles.menuValue}>{user?.name}</div>
              </div>
            </div>

            <div className={styles.menuDivider} />

            <div className={styles.menuItem}>
              <div className={styles.menuIcon} style={{ background: 'var(--surface2)' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="var(--text3)" strokeWidth="1.6">
                  <rect x="2" y="5" width="16" height="12" rx="2" />
                  <polyline points="2 8 10 13 18 8" />
                </svg>
              </div>

              <div className={styles.menuText}>
                <div className={styles.menuLabel} style={{ color: 'var(--text)' }}>Email</div>
                <div className={styles.menuValue}>{user?.email}</div>
              </div>
            </div>

          </div>
        </div>

        {/* DATA */}
        <div className={`${styles.section} anim-fade-up d4`}>
          <div className={styles.sectionTitle}>Data</div>

          <div className={styles.menuCard}>

            <button
              className={styles.menuItemBtn}
              onClick={() => setConfirmClear(true)}
            >
              <div className={styles.menuIcon} style={{ background: 'var(--coral-l)' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="var(--coral)" strokeWidth="1.6">
                  <polyline points="4 5 16 5" />
                  <path d="M6 5V3h8v2M7 5l.5 12h5L13 5" />
                </svg>
              </div>

              <div className={styles.menuText}>
                <div className={styles.menuLabel} style={{ color: 'var(--coral)' }}>
                  Clear all data
                </div>
                <div className={styles.menuValue}>
                  Remove all transactions
                </div>
              </div>
            </button>

          </div>
        </div>

        {/* ABOUT */}
        <div className={`${styles.section} anim-fade-up d5`}>
          <div className={styles.sectionTitle}>About</div>

          <div className={styles.menuCard}>
            <div className={styles.menuItem}>
              <div className={styles.menuIcon} style={{ background: 'var(--surface2)' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="var(--text3)" strokeWidth="1.6">
                  <circle cx="10" cy="10" r="7" />
                  <line x1="10" y1="9" x2="10" y2="14" />
                  <circle cx="10" cy="6.5" r="0.7" />
                </svg>
              </div>

              <div className={styles.menuText}>
                <div className={styles.menuLabel}>Version</div>
                <div className={styles.menuValue}>PaiseTrack v1.0.0</div>
              </div>
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          className={`${styles.logoutBtn} anim-fade-up d6`}
          onClick={() => setConfirmLogout(true)}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3M13 14l4-4-4-4M17 10H7" />
          </svg>
          Sign out
        </button>

      </div>

      {/* LOGOUT MODAL */}
      {confirmLogout && (
        <div className={styles.overlay} onClick={() => setConfirmLogout(false)}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()}>
            <div className={styles.dialogIcon}>👋</div>
            <p className={styles.dialogTitle}>Sign out?</p>
            <p className={styles.dialogSub}>You will need to sign in again.</p>

            <div className={styles.dialogBtns}>
              <button className="btn btn-ghost" onClick={() => setConfirmLogout(false)}>
                Cancel
              </button>

              <button className={`btn ${styles.btnDanger}`} onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR MODAL */}
      {confirmClear && (
        <div className={styles.overlay} onClick={() => setConfirmClear(false)}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()}>
            <div className={styles.dialogIcon}>⚠️</div>
            <p className={styles.dialogTitle}>Clear all data?</p>
            <p className={styles.dialogSub}>
              This will delete {transactions.length} transactions permanently.
            </p>

            <div className={styles.dialogBtns}>
              <button className="btn btn-ghost" onClick={() => setConfirmClear(false)}>
                Cancel
              </button>

              <button
                className={`btn ${styles.btnDanger}`}
                onClick={() => {
                  localStorage.clear()
                  setConfirmClear(false)
                  window.location.reload()
                }}
              >
                Clear data
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}