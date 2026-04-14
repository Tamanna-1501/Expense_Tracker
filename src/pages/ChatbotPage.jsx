import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTx } from '../context/TxContext'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'
import { fmt, CAT_ICONS } from '../constants'
import styles from './ChatbotPage.module.css'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_KEY

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

const SUGGESTIONS = [
  'How much should I save each month?',
  'Where should I invest my savings?',
  'How can I reduce my expenses?',
  'Am I spending too much on food?',
  'What is the 50/30/20 rule for me?',
  'Should I build an emergency fund?',
]

function buildSystemPrompt(user, transactions, totalIncome, totalExpense, balance, categoryTotals) {
  const savingsRate = totalIncome ? ((1 - totalExpense / totalIncome) * 100).toFixed(1) : '0'
  const topCats = categoryTotals
    .slice(0, 5)
    .map(([cat, amt]) => `${CAT_ICONS[cat] || ''} ${cat}: ₹${amt.toLocaleString('en-IN')}`)
    .join(', ')
  const recentTx = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8)
    .map(t => `${t.type === 'income' ? '+' : '-'}₹${t.amount} (${t.cat}: ${t.desc})`)
    .join('; ')

  return `You are a friendly, knowledgeable personal finance advisor chatbot built into an expense tracker app for Indian users. Your name is "FinBot".

User's financial snapshot:
- Name: ${user?.name || 'User'}
- Total Income: ₹${totalIncome.toLocaleString('en-IN')}
- Total Expenses: ₹${totalExpense.toLocaleString('en-IN')}
- Current Balance: ₹${balance.toLocaleString('en-IN')}
- Savings Rate: ${savingsRate}%
- Top spending categories: ${topCats || 'None yet'}
- Recent transactions: ${recentTx || 'None yet'}

Your role:
1. Give personalized investment & savings advice based on the user's ACTUAL financial data above.
2. Suggest Indian-specific investment options: PPF, ELSS, SIP/Mutual Funds, FD, NPS, Sovereign Gold Bonds, Index Funds (Nifty 50), etc.
3. Reference their real numbers (income, expenses, categories) when making suggestions.
4. Keep responses concise, warm, and practical — use bullet points and ₹ amounts where helpful.
5. If asked something unrelated to finance, gently redirect to financial topics.
6. Always add a brief disclaimer that you're an AI and not a SEBI-registered advisor.
7. Use emojis sparingly to make responses friendly.`
}

export default function ChatbotPage() {
  const { user } = useAuth()
  const { transactions, totalIncome, totalExpense, balance, categoryTotals } = useTx()
  const navigate = useNavigate()

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm **FinBot**, your personal finance advisor.\n\nI can see your spending patterns and help you make smarter decisions about **savings** and **investments**. What would you like to know?`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text) {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput('')

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const systemPrompt = buildSystemPrompt(
        user, transactions, totalIncome, totalExpense, balance, categoryTotals
      )

      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1000,
          messages: [
            { role: 'system', content: systemPrompt },
            ...newMessages.map(m => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content,
            })),
          ],
        }),
      })

      const data = await response.json()
      const reply =
        data.choices?.[0]?.message?.content ||
        data.error?.message ||
        'Sorry, I could not generate a response.'

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function renderContent(text) {
    const lines = text.split('\n')
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return <strong key={j}>{p.slice(2, -2)}</strong>
        }
        return p
      })
      if (line.trimStart().startsWith('- ') || line.trimStart().startsWith('• ')) {
        return (
          <div key={i} className={styles.bullet}>
            <span className={styles.bulletDot}>•</span>
            <span>{parts.slice(1)}</span>
          </div>
        )
      }
      if (line === '') return <br key={i} />
      return <p key={i} className={styles.msgPara}>{parts}</p>
    })
  }

  return (
    <div className="page-shell">
      <div className={styles.chatShell}>

        {/* Header */}
        <header className={styles.header}>
          <button className={styles.back} onClick={() => navigate('/home')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className={styles.headerInfo}>
            <div className={styles.botAvatar}>🤖</div>
            <div>
              <div className={styles.botName}>FinBot</div>
              <div className={styles.botStatus}>
                <span className={styles.statusDot} />
                AI Finance Advisor
              </div>
            </div>
          </div>
          <div className={styles.headerBadge}>BETA</div>
        </header>

        {/* Financial snapshot pill */}
        <div className={styles.snapshotBar}>
          <div className={styles.snapshotItem}>
            <span className={styles.snapLabel}>Balance</span>
            <span className={`${styles.snapVal} ${balance >= 0 ? styles.up : styles.down}`}>{fmt(balance)}</span>
          </div>
          <div className={styles.snapDivider} />
          <div className={styles.snapshotItem}>
            <span className={styles.snapLabel}>Income</span>
            <span className={`${styles.snapVal} ${styles.up}`}>{fmt(totalIncome)}</span>
          </div>
          <div className={styles.snapDivider} />
          <div className={styles.snapshotItem}>
            <span className={styles.snapLabel}>Expenses</span>
            <span className={`${styles.snapVal} ${styles.down}`}>{fmt(totalExpense)}</span>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.msgRow} ${m.role === 'user' ? styles.userRow : styles.botRow}`}>
              {m.role === 'assistant' && <div className={styles.botIcon}>🤖</div>}
              <div className={`${styles.bubble} ${m.role === 'user' ? styles.userBubble : styles.botBubble}`}>
                {renderContent(m.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.msgRow} ${styles.botRow}`}>
              <div className={styles.botIcon}>🤖</div>
              <div className={`${styles.bubble} ${styles.botBubble} ${styles.typingBubble}`}>
                <span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className={styles.suggestions}>
            {SUGGESTIONS.map(s => (
              <button key={s} className={styles.chip} onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className={styles.inputArea}>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about savings or investments…"
            disabled={loading}
          />
          <button
            className={`${styles.sendBtn} ${input.trim() && !loading ? styles.sendActive : ''}`}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  )
}

 