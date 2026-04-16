import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './AuthPage.module.css'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError('') }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const err = await register(form.name, form.email, form.password)
    setLoading(false)
    if (err) { setError(err); return }
    navigate('/home')
  }

  return (
    <div className={styles.outer}>
      <div className={styles.panel}>
        <div className={`${styles.logo} anim-fade-up`}>
          paise<span>.</span>track
        </div>
        <h1 className={`${styles.heading} anim-fade-up d1`}>Create account</h1>
        <p className={`${styles.sub} anim-fade-up d2`}>Start tracking your expenses today</p>

        <form onSubmit={handleSubmit} className={`${styles.form} anim-fade-up d3`}>
          <div className="form-group">
            <label>Full name</label>
            <input type="text" placeholder="Enter your name" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input type="password" placeholder="Repeat password" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className={`btn btn-teal ${styles.submitBtn}`} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Create account'}
          </button>
        </form>

        <p className={`${styles.switch} anim-fade-up d4`}>
          Already have an account? <Link to="/login">Sign in</Link>
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
          <p>Know where</p>
          <p>every rupee goes.</p>
        </div>
      </div>
    </div>
  )
}
