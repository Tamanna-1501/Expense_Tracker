import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError('') }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const err = await login(form.email, form.password)
    setLoading(false)
    if (err) { setError(err); return }
    navigate('/home')
  }

  function fillDemo() { setForm({ email: 'Demo@gmail.com', password: 'user1234' }); setError('') }

  return (
    <div className={styles.outer}>
      <div className={styles.panel}>
        <div className={`${styles.logo} anim-fade-up`}>
          paise<span>.</span>track
        </div>
        <h1 className={`${styles.heading} anim-fade-up d1`}>Welcome back</h1>
        <p className={`${styles.sub} anim-fade-up d2`}>Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className={`${styles.form} anim-fade-up d3`}>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} autoComplete="current-password" />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Sign in'}
          </button>
        </form>

        <button onClick={fillDemo} className={`${styles.demoBtn} anim-fade-up d4`}>
          Try demo account
        </button>

        <p className={`${styles.switch} anim-fade-up d5`}>
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>

      <div className={styles.art}>
        <div className={styles.artCard}>
          <div className={styles.artBal}>₹94,250</div>
          <div className={styles.artLabel}>Current balance</div>
          <div className={styles.artStats}>
            <div><div className={styles.artUp}>+₹1,03,000</div><div className={styles.artStat}>Income</div></div>
            <div><div className={styles.artDown}>−₹8,750</div><div className={styles.artStat}>Expenses</div></div>
          </div>
        </div>
        <div className={styles.artTagline}>
          <p>Smart money,</p>
          <p>smarter choices.</p>
        </div>
      </div>
    </div>
  )
}
