import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGroup } from '../context/GroupContext'
import BottomNav from '../components/BottomNav'

const TABS = ['Expenses', 'Balances', 'Settle Up']

function MemberAvatar({ name, size = 32, index = 0 }) {
  const colors = ['#1D9E75','#D85A30','#6366F1','#F59E0B','#EC4899','#14B8A6','#8B5CF6','#3B82F6']

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: colors[index % colors.length],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.38,
      fontWeight: 700,
      color: '#fff',
      flexShrink: 0,
    }}>
      {name?.[0]?.toUpperCase()}
    </div>
  )
}

export default function GroupDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { groups, settleDebt, calcBalances } = useGroup()

  const group = groups.find(g => g.id === Number(id))

  const [tab, setTab] = useState(0)

  const balances = useMemo(() => {
    return group ? calcBalances(group) : []
  }, [group, calcBalances])

  if (!group) {
    return (
      <div className="page-shell" style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'column',
        gap:12
      }}>
        <div style={{ fontSize: 40 }}>😕</div>
        <div style={{ color:'var(--ink2)' }}>Group not found</div>

        <button
          onClick={() => navigate('/groups')}
          style={{
            background:'var(--teal)',
            color:'#fff',
            border:'none',
            padding:'10px 20px',
            borderRadius:10
          }}
        >
          Back
        </button>
      </div>
    )
  }

  const expenses = (group.expenses || []).filter(e => !e.isSettlement)

  const totalSpent = expenses.reduce((s, e) => s + (e.amount || 0), 0)

  const youPaid = expenses
    .filter(e => e.paidBy === 'You')
    .reduce((s, e) => s + (e.amount || 0), 0)

  const youOwe = balances
    .filter(b => b.from === 'You')
    .reduce((s, b) => s + (b.amount || 0), 0)

  function handleSettle(from, to, amount) {
    settleDebt(group.id, from, to, amount)
  }

  return (
    <div className="page-shell">
      <div style={{ maxWidth:480, margin:'0 auto', paddingBottom:80 }}>

        {/* HEADER */}
        <div style={{
          background:'var(--surface)',
          borderBottom:'1px solid var(--border)',
          padding:'16px'
        }}>

          {/* BACK + TITLE */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button onClick={() => navigate('/groups')} style={{ background:'none', border:'none' }}>
              ←
            </button>

            <div style={{
              width:42,
              height:42,
              borderRadius:12,
              background:'var(--surface2)',
              display:'flex',
              alignItems:'center',
              justifyContent:'center'
            }}>
              {group.emoji}
            </div>

            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700 }}>{group.name}</div>
              <div style={{ fontSize:12, color:'var(--ink3)' }}>
                {group.members.join(', ')}
              </div>
            </div>
          </div>

          {/* STATS */}
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            {[
              { label:'Total', value:totalSpent },
              { label:'You paid', value:youPaid },
              { label:'You owe', value:youOwe }
            ].map(s => (
              <div key={s.label} style={{
                flex:1,
                background:'var(--surface2)',
                padding:10,
                borderRadius:10,
                textAlign:'center'
              }}>
                <div style={{ fontSize:12 }}>{s.label}</div>
                <div style={{ fontWeight:700, color:'var(--ink1)' }}>
                  ₹{s.value.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div style={{ display:'flex', marginTop:12 }}>
            {TABS.map((t,i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                style={{
                  flex:1,
                  padding:8,
                  border:'none',
                  background:'transparent',
                  borderBottom: tab===i ? '2px solid var(--teal)' : '2px solid transparent',
                  color: tab===i ? 'var(--teal)' : 'var(--ink3)',
                  fontWeight: tab===i ? 700 : 500
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* EXPENSES */}
        {tab === 0 && (
          <div style={{ padding:16 }}>
            {expenses.length === 0 ? (
              <div style={{ textAlign:'center', color:'var(--ink3)' }}>
                No expenses yet 🧾
              </div>
            ) : (
              expenses.map(exp => {
                const splitCount = exp.splitAmong?.length || 1
                const perShare = exp.amount / splitCount

                return (
                  <div key={exp.id} style={{
                    background:'var(--surface)',
                    border:'1px solid var(--border)',
                    padding:12,
                    borderRadius:12,
                    marginBottom:10
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <div>
                        <div style={{ fontWeight:700 }}>{exp.desc}</div>
                        <div style={{ fontSize:12, color:'var(--ink3)' }}>
                          Paid by {exp.paidBy}
                        </div>
                      </div>

                      <div style={{ textAlign:'right' }}>
                        <div>₹{exp.amount.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize:11, color:'var(--ink3)' }}>
                          ₹{perShare.toFixed(0)} / person
                        </div>
                      </div>
                    </div>

                    {/* SPLIT INFO */}
                    <div style={{
                      marginTop:8,
                      fontSize:12,
                      color:'var(--ink2)'
                    }}>
                      Split among: {exp.splitAmong?.join(', ')}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* BALANCES */}
        {tab === 1 && (
          <div style={{ padding:16 }}>
            {balances.length === 0 ? (
              <div style={{ textAlign:'center' }}>All settled 🎉</div>
            ) : (
              balances.map((b,i) => (
                <div key={i} style={{
                  padding:12,
                  background:'var(--surface)',
                  border:'1px solid var(--border)',
                  borderRadius:12,
                  marginBottom:10
                }}>
                  <strong style={{ color:'var(--coral)' }}>{b.from}</strong>
                  {' '}owes{' '}
                  <strong style={{ color:'var(--teal)' }}>{b.to}</strong>

                  <div style={{ marginTop:5 }}>
                    ₹{b.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SETTLE */}
        {tab === 2 && (
          <div style={{ padding:16 }}>
            {balances.length === 0 ? (
              'All settled 🎉'
            ) : (
              balances.map((b,i) => (
                <button
                  key={i}
                  onClick={() => handleSettle(b.from, b.to, b.amount)}
                  style={{
                    width:'100%',
                    padding:12,
                    marginBottom:10,
                    border:'none',
                    borderRadius:12,
                    background:'var(--teal)',
                    color:'#fff'
                  }}
                >
                  Settle {b.from} → {b.to} (₹{b.amount})
                </button>
              ))
            )}
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  )
}