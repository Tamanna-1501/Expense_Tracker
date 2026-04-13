import { Link } from 'react-router-dom'
import styles from './LandingPage.module.css'

const features = [
  { icon: '💰', title: 'Track Every Rupee', desc: 'Log income and expenses instantly with smart categories and notes. Never lose track of where your money goes.' },
  { icon: '📊', title: 'Visual Insights', desc: 'Beautiful charts show your monthly spending patterns, category breakdowns, and savings rate at a glance.' },
  { icon: '🎯', title: 'Budget Goals', desc: 'Set monthly budgets and get a real-time progress bar so you always know how much you have left to spend.' },
  { icon: '🔒', title: 'Private & Secure', desc: 'Your data stays on your device. No servers, no tracking, no ads. Just you and your finances.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Designed for your phone first. Add transactions on the go from anywhere, anytime.' },
  { icon: '📁', title: 'Category Breakdown', desc: 'See exactly which categories drain your wallet with a clear donut chart and percentage splits.' },
]

const stats = [
  { value: '10+', label: 'Categories' },
  { value: '100%', label: 'Private' },
  { value: '₹0', label: 'Cost' },
  { value: '5★', label: 'Experience' },
]

export default function LandingPage() {
  return (
    <div className={styles.page}>

      {/* ── Navbar ── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>paise<span>.</span>track</div>
          <div className={styles.navLinks}>
            <a href="#about" className={styles.navLink}>About Us</a>
            <a href="#contact" className={styles.navLink}>Contact Us</a>
          </div>
          <div className={styles.navActions}>
            <Link to="/login" className={styles.signInBtn}>Sign In</Link>
            <Link to="/register" className={styles.signUpBtn}>Sign Up</Link>
          </div>
          {/* Mobile menu toggle */}
          <button className={styles.menuToggle} onClick={() => {
            document.getElementById('mobileMenu').classList.toggle(styles.mobileMenuOpen)
          }}>
            <span /><span /><span />
          </button>
        </div>
        {/* Mobile menu */}
        <div id="mobileMenu" className={styles.mobileMenu}>
          <a href="#about" className={styles.mobileLink}>About Us</a>
          <a href="#contact" className={styles.mobileLink}>Contact Us</a>
          <Link to="/login" className={styles.mobileLink}>Sign In</Link>
          <Link to="/register" className={`${styles.mobileLink} ${styles.mobileLinkTeal}`}>Sign Up</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Free to use · No account required to explore
          </div>
          <h1 className={styles.heroTitle}>
            Know where every<br /><span>rupee</span> goes.
          </h1>
          <p className={styles.heroSub}>
            PaiseTrack is a beautiful, private expense tracker that helps you understand your spending, grow your savings, and take control of your financial life — all from your browser.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/register" className={styles.ctaPrimary}>Get started free →</Link>
            <Link to="/login" className={styles.ctaGhost}>Sign in</Link>
          </div>
        </div>

        {/* 3D Hero Visual */}
        <div className={styles.heroVisual}>
          <div className={styles.scene3d}>

            {/* Main 3D dashboard card */}
            <div className={styles.card3dMain}>
              <div className={styles.card3dHeader}>
                <div className={styles.card3dDots}>
                  <span style={{background:'#FF5F57'}}/>
                  <span style={{background:'#FFBD2E'}}/>
                  <span style={{background:'#28CA41'}}/>
                </div>
                <span style={{fontSize:'10px',color:'#888'}}>paisetrack · dashboard</span>
              </div>
              <div className={styles.card3dBalance}>
                <div className={styles.balLabel}>TOTAL BALANCE</div>
                <div className={styles.balAmount}>₹94,250</div>
                <div className={styles.balRow}>
                  <div><div className={styles.balSublabel}>Income</div><div className={styles.balInc}>+₹1,03,000</div></div>
                  <div><div className={styles.balSublabel}>Expenses</div><div className={styles.balExp}>−₹8,750</div></div>
                  <div><div className={styles.balSublabel}>Savings</div><div className={styles.balInc}>91.5%</div></div>
                </div>
              </div>
              {/* 3D Bar Chart */}
              <div className={styles.chart3dWrap}>
                <div className={styles.chart3dLabel}>MONTHLY SPENDING</div>
                <div className={styles.chart3d}>
                  {[
                    {l:'Jan', h:55, c:'#5DCAA5'},
                    {l:'Feb', h:72, c:'#5DCAA5'},
                    {l:'Mar', h:48, c:'#5DCAA5'},
                    {l:'Apr', h:88, c:'#1D9E75'},
                    {l:'May', h:62, c:'#5DCAA5'},
                  ].map((b,i) => (
                    <div key={b.l} className={styles.bar3dGroup} style={{'--delay': i * 0.1 + 's'}}>
                      <div className={styles.bar3dOuter}>
                        <div className={styles.bar3dFront} style={{height: b.h + 'px', background: b.c}} />
                        <div className={styles.bar3dRight} style={{height: b.h + 'px', background: b.c === '#1D9E75' ? '#0F6E56' : '#1D9E75'}} />
                        <div className={styles.bar3dTop} style={{background: b.c === '#1D9E75' ? '#5DCAA5' : '#9FE1CB'}} />
                      </div>
                      <span className={styles.bar3dLabel}>{b.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating card 1 — savings ring */}
            <div className={`${styles.floatCard} ${styles.floatCard1}`}>
              <div className={styles.ringWrap}>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#E1F5EE" strokeWidth="8"/>
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#1D9E75" strokeWidth="8"
                    strokeDasharray="163" strokeDashoffset="14"
                    strokeLinecap="round"
                    style={{transformOrigin:'center', transform:'rotate(-90deg)'}}/>
                </svg>
                <div className={styles.ringCenter}>91%</div>
              </div>
              <div className={styles.floatCardText}>
                <div className={styles.floatCardTitle}>Savings Rate</div>
                <div className={styles.floatCardSub}>April 2026</div>
              </div>
            </div>

            {/* Floating card 2 — top category */}
            <div className={`${styles.floatCard} ${styles.floatCard2}`}>
              <div className={styles.catDot} style={{background:'#FAECE7', fontSize:'18px'}}>🛍️</div>
              <div className={styles.floatCardText}>
                <div className={styles.floatCardTitle}>Top Expense</div>
                <div className={styles.floatCardSub} style={{color:'#D85A30', fontWeight:'600'}}>Shopping ₹4,200</div>
              </div>
            </div>

            {/* Floating card 3 — income badge */}
            <div className={`${styles.floatCard} ${styles.floatCard3}`}>
              <div className={styles.catDot} style={{background:'#E1F5EE', fontSize:'18px'}}>💼</div>
              <div className={styles.floatCardText}>
                <div className={styles.floatCardTitle}>This Month</div>
                <div className={styles.floatCardSub} style={{color:'#1D9E75', fontWeight:'600'}}>+₹1,03,000</div>
              </div>
            </div>

            {/* Decorative rings */}
            <div className={styles.ring1} />
            <div className={styles.ring2} />
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className={styles.statsStrip}>
        {stats.map(s => (
          <div key={s.label} className={styles.statItem}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── About ── */}
      <section id="about" className={styles.about}>
        <div className={styles.sectionTag}>About Us</div>
        <h2 className={styles.sectionTitle}>Built for people who want<br />to understand their money</h2>
        <p className={styles.sectionSub}>
          PaiseTrack was built out of frustration with complex budgeting apps that do too much. We wanted something simple, fast, and beautiful — that works entirely in your browser with no signup friction and zero data leaving your device.
        </p>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutCard}>
            <div className={styles.aboutIcon}>🎯</div>
            <h3>Our Mission</h3>
            <p>Make personal finance accessible to everyone in India — no subscriptions, no complexity, no compromises.</p>
          </div>
          <div className={styles.aboutCard}>
            <div className={styles.aboutIcon}>🛡️</div>
            <h3>Privacy First</h3>
            <p>Your financial data never leaves your browser. Everything is stored locally on your device. We don't have servers that store your data.</p>
          </div>
          <div className={styles.aboutCard}>
            <div className={styles.aboutIcon}>🚀</div>
            <h3>Always Improving</h3>
            <p>We ship new features regularly based on user feedback. Have a suggestion? We'd love to hear from you.</p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features}>
        <div className={styles.sectionTag}>Features</div>
        <h2 className={styles.sectionTitle}>Everything you need,<br />nothing you don't</h2>
        <div className={styles.featuresGrid}>
          {features.map(f => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner}>
        <h2>Start tracking today.<br /><span>It's completely free.</span></h2>
        <p>Join thousands of people already taking control of their finances with PaiseTrack.</p>
        <Link to="/register" className={styles.ctaBannerBtn}>Create free account →</Link>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className={styles.contact}>
        <div className={styles.sectionTag}>Contact Us</div>
        <h2 className={styles.sectionTitle}>We'd love to hear from you</h2>
        <p className={styles.sectionSub}>Have a question, feedback, or just want to say hello? Drop us a message.</p>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📧</div>
              <div>
                <div className={styles.contactLabel}>Email</div>
                <div className={styles.contactValue}>support@paisetrack.in</div>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>📍</div>
              <div>
                <div className={styles.contactLabel}>Location</div>
                <div className={styles.contactValue}>Meerut, Uttar Pradesh, India</div>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>🕐</div>
              <div>
                <div className={styles.contactLabel}>Response time</div>
                <div className={styles.contactValue}>Within 24 hours</div>
              </div>
            </div>
          </div>
          <form className={styles.contactForm} onSubmit={e => { e.preventDefault(); alert('Message sent! We\'ll get back to you soon.') }}>
            <div className="form-group">
              <label>Your name</label>
              <input type="text" placeholder="Enter your name" required />
            </div>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows="4" placeholder="Tell us what's on your mind…" required />
            </div>
            <button type="submit" className={`btn btn-primary`} style={{width:'100%',height:'48px'}}>Send message →</button>
          </form>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>paise<span>.</span>track</div>
            <p className={styles.footerTagline}>Smart money, smarter choices. Track your expenses and grow your savings with India's simplest finance tracker.</p>
            <div className={styles.footerSocials}>
              <a href="#" className={styles.social} aria-label="Twitter">𝕏</a>
              <a href="#" className={styles.social} aria-label="Instagram">📸</a>
              <a href="#" className={styles.social} aria-label="LinkedIn">in</a>
            </div>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Product</div>
            <Link to="/register" className={styles.footerLink}>Get Started</Link>
            <Link to="/login" className={styles.footerLink}>Sign In</Link>
            <a href="#features" className={styles.footerLink}>Features</a>
            <a href="#about" className={styles.footerLink}>About</a>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Features</div>
            <span className={styles.footerLink}>Expense Tracking</span>
            <span className={styles.footerLink}>Income Management</span>
            <span className={styles.footerLink}>Category Reports</span>
            <span className={styles.footerLink}>Monthly Charts</span>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Support</div>
            <a href="#contact" className={styles.footerLink}>Contact Us</a>
            <span className={styles.footerLink}>Privacy Policy</span>
            <span className={styles.footerLink}>Terms of Use</span>
            <span className={styles.footerLink}>FAQ</span>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} PaiseTrack. All rights reserved.</span>
          <span>Made with ♥ in India</span>
        </div>
      </footer>

    </div>
  )
}
