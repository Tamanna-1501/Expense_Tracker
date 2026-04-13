import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTx } from '../context/TxContext'
import BottomNav from '../components/BottomNav'
import { fmt } from '../constants'
import styles from './SettingsPage.module.css'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { transactions, totalIncome, totalExpense, balance } = useTx()
  const navigate = useNavigate()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [cleared, setCleared] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const joined = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="page-shell">
      <div className="page-content">

        {/* Profile hero */}
        <div className={`${styles.profileHero} anim-fade-up`}>
          <div className={styles.profileAvatar}>{user?.initials || 'U'}</div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{user?.name}</h1>
            <p className={styles.profileEmail}>{user?.email}</p>
            <p className={styles.profileMeta}>Member since {joined}</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className={`${styles.statsStrip} anim-fade-up d1`}>
          <div className={styles.stripStat}>
            <div className={styles.stripVal}>{transactions.length}</div>
            <div className={styles.stripLabel}>Transactions</div>
          </div>
          <div className={styles.stripDivider} />
          <div className={styles.stripStat}>
            <div className={`${styles.stripVal} ${styles.up}`}>{fmt(totalIncome)}</div>
            <div className={styles.stripLabel}>Total income</div>
          </div>
          <div className={styles.stripDivider} />
          <div className={styles.stripStat}>
            <div className={`${styles.stripVal} ${styles.down}`}>{fmt(totalExpense)}</div>
            <div className={styles.stripLabel}>Total spent</div>
          </div>
        </div>

        {/* Account section */}
        <div className={`${styles.section} anim-fade-up d2`}>
          <div className={styles.sectionTitle}>Account</div>
          <div className={styles.menuCard}>
            <div className={styles.menuItem}>
              <div className={styles.menuIcon} style={{ background: '#E1F5EE' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#1D9E75" strokeWidth="1.6"><circle cx="10" cy="7" r="3.5"/><path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6"/></svg>
              </div>
              <div className={styles.menuText}>
                <div className={styles.menuLabel}>Full name</div>
                <div className={styles.menuValue}>{user?.name}</div>
              </div>
            </div>
            <div className={styles.menuDivider} />
            <div className={styles.menuItem}>
              <div className={styles.menuIcon} style={{ background: '#E6F1FB' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#185FA5" strokeWidth="1.6"><rect x="2" y="5" width="16" height="12" rx="2"/><polyline points="2 8 10 13 18 8"/></svg>
              </div>
              <div className={styles.menuText}>
                <div className={styles.menuLabel}>Email address</div>
                <div className={styles.menuValue}>{user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className={`${styles.section} anim-fade-up d3`}>
          <div className={styles.sectionTitle}>Preferences</div>
          <div className={styles.menuCard}>
            <div className={styles.menuItem}>
              <div className={styles.menuIcon} style={{ background: '#FAEEDA' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#BA7517" strokeWidth="1.6"><circle cx="10" cy="10" r="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="10" y1="16" x2="10" y2="18"/><line x1="2" y1="10" x2="4" y2="10"/><line x1="16" y1="10" x2="18" y2="10"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="14.4" y1="14.4" x2="15.8" y2="15.8"/><line x1="4.2" y1="15.8" x2="5.6" y2="14.4"/><line x1="14.4" y1="5.6" x2="15.8" y2="4.2"/></svg>
              </div>
              <div className={styles.menuText}>
                <div className={styles.menuLabel}>Currency</div>
                <div className={styles.menuValue}>Indian Rupee (₹)</div>
              </div>
              <div className={styles.menuArrow}>›</div>
            </div>
            <div className={styles.menuDivider} />
            <div className={styles.menuItem}>
              <div className={styles.menuIcon} style={{ background: '#EEEDFE' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#534AB7" strokeWidth="1.6"><rect x="3" y="3" width="14" height="14" rx="2"/><line x1="3" y1="8" x2="17" y2="8"/><line x1="8" y1="3" x2="8" y2="17"/></svg>
              </div>
              <div className={styles.menuText}>
                <div className={styles.menuLabel}>Monthly budget</div>
                <div className={styles.menuValue}>{fmt(15000)}</div>
              </div>
              <div className={styles.menuArrow}>›</div>
            </div>
            <div className={styles.menuDivider} />
            <div className={styles.menuItem}>
              <div className={styles.menuIcon} style={{ background: '#F1EFE8' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#5F5E5A" strokeWidth="1.6"><circle cx="10" cy="10" r="7"/><path d="M10 6v4l3 2"/></svg>
              </div>
              <div className={styles.menuText}>
                <div className={styles.menuLabel}>Date format</div>
                <div className={styles.menuValue}>DD MMM YYYY</div>
              </div>
              <div className={styles.menuArrow}>›</div>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className={`${styles.section} anim-fade-up d4`}>
          <div className={styles.sectionTitle}>Data</div>
          <div className={styles.menuCard}>
            <div className={styles.menuItem}>
              <div className={styles.menuIcon} style={{ background: '#EAF3DE' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#3B6D11" strokeWidth="1.6"><path d="M4 14v2h12v-2M10 3v9M6 8l4-4 4 4"/></svg>
              </div>
              <div className={styles.menuText}>
                <div className={styles.menuLabel}>Export data</div>
                <div className={styles.menuValue}>Download as CSV</div>
              </div>
              <div className={styles.menuArrow}>›</div>
            </div>
            <div className={styles.menuDivider} />
            <button className={styles.menuItemBtn} onClick={() => setConfirmClear(true)}>
              <div className={styles.menuIcon} style={{ background: '#FCEBEB' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#A32D2D" strokeWidth="1.6"><polyline points="4 5 16 5"/><path d="M6 5V3h8v2M7 5l.5 12h5L13 5"/></svg>
              </div>
              <div className={styles.menuText}>
                <div className={styles.menuLabel} style={{ color: '#A32D2D' }}>Clear all data</div>
                <div className={styles.menuValue}>Remove all transactions</div>
              </div>
            </button>
          </div>
        </div>

        {/* About */}
        <div className={`${styles.section} anim-fade-up d5`}>
          <div className={styles.sectionTitle}>About</div>
          <div className={styles.menuCard}>
            <div className={styles.menuItem}>
              <div className={styles.menuIcon} style={{ background: '#F1EFE8' }}>
                <svg viewBox="0 0 20 20" fill="none" stroke="#5F5E5A" strokeWidth="1.6"><circle cx="10" cy="10" r="7"/><line x1="10" y1="9" x2="10" y2="14"/><circle cx="10" cy="6.5" r="0.7" fill="#5F5E5A"/></svg>
              </div>
              <div className={styles.menuText}>
                <div className={styles.menuLabel}>Version</div>
                <div className={styles.menuValue}>PaiseTrack v1.0.0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button className={`${styles.logoutBtn} anim-fade-up d6`} onClick={() => setConfirmLogout(true)}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M7 3H4a1 1 0 00-1 1v12a1 1 0 001 1h3M13 14l4-4-4-4M17 10H7"/>
          </svg>
          Sign out
        </button>

      </div>

      {/* Logout confirm */}
      {confirmLogout && (
        <div className={styles.overlay} onClick={() => setConfirmLogout(false)}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()}>
            <div className={styles.dialogIcon}>👋</div>
            <p className={styles.dialogTitle}>Sign out?</p>
            <p className={styles.dialogSub}>You'll need to sign in again to access your data.</p>
            <div className={styles.dialogBtns}>
              <button className="btn btn-ghost" style={{ flex:1, height:44 }} onClick={() => setConfirmLogout(false)}>Cancel</button>
              <button className={`btn ${styles.btnDanger}`} style={{ flex:1, height:44 }} onClick={handleLogout}>Sign out</button>
            </div>
          </div>
        </div>
      )}

      {/* Clear data confirm */}
      {confirmClear && (
        <div className={styles.overlay} onClick={() => setConfirmClear(false)}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()}>
            <div className={styles.dialogIcon}>⚠️</div>
            <p className={styles.dialogTitle}>Clear all data?</p>
            <p className={styles.dialogSub}>This will permanently delete all {transactions.length} transactions. This cannot be undone.</p>
            <div className={styles.dialogBtns}>
              <button className="btn btn-ghost" style={{ flex:1, height:44 }} onClick={() => setConfirmClear(false)}>Cancel</button>
              <button className={`btn ${styles.btnDanger}`} style={{ flex:1, height:44 }} onClick={() => { localStorage.removeItem(`pt_txs_${user?.email}`); setConfirmClear(false); window.location.reload() }}>Clear data</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
