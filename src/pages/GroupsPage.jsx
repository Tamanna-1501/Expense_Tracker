import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGroup } from '../context/GroupContext'
import BottomNav from '../components/BottomNav'

const GROUP_EMOJIS = ['🏖️','🏕️','🍕','✈️','🏠','🎉','🛒','🚗','💼','🎓','🏋️','🎮']

export default function GroupsPage() {
  const navigate = useNavigate()
  const { groups, createGroup, calcBalances } = useGroup()

  const [showCreate, setShowCreate] = useState(false)
  const [groupName,  setGroupName]  = useState('')
  const [emoji,      setEmoji]      = useState('🏖️')
  const [memberInput,setMemberInput]= useState('')
  const [members,    setMembers]    = useState(['You'])

  function addMember() {
    const name = memberInput.trim()
    if (!name || members.includes(name) || members.length >= 8) return
    setMembers(prev => [...prev, name])
    setMemberInput('')
  }

  function removeMember(name) {
    if (name === 'You') return // can't remove yourself
    setMembers(prev => prev.filter(m => m !== name))
  }

  function handleCreate() {
    if (!groupName.trim() || members.length < 2) return
    const id = createGroup(groupName.trim(), emoji, members)
    setShowCreate(false)
    setGroupName('')
    setMembers(['You'])
    setMemberInput('')
    navigate(`/groups/${id}`)
  }

  // total you owe / are owed across all groups
  const { totalOwe, totalOwed } = groups.reduce((acc, g) => {
    const balances = calcBalances(g)
    balances.forEach(b => {
      if (b.from === 'You') acc.totalOwe  += b.amount
      if (b.to   === 'You') acc.totalOwed += b.amount
    })
    return acc
  }, { totalOwe: 0, totalOwed: 0 })

  return (
    <div className="page-shell" style={{ background: 'var(--bg,#f5f5f5)' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 80px' }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px 16px',
          background: 'var(--surface,#fff)',
          borderBottom: '1px solid var(--border,#e5e7eb)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/home')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink2,#555)', padding:0, display:'flex', alignItems:'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink1,#111)' }}>Split Expenses</div>
              <div style={{ fontSize: 12, color: 'var(--ink3,#999)' }}>Groups & shared bills</div>
            </div>
          </div>
          <button onClick={() => setShowCreate(true)} style={{
            background: '#1D9E75', border: 'none', cursor: 'pointer',
            color: '#fff', borderRadius: 10, padding: '7px 14px',
            fontSize: 13, fontWeight: 600,
          }}>+ Group</button>
        </div>

        {/* ── Summary bar ── */}
        {groups.length > 0 && (
          <div style={{
            margin: '12px 16px 0', display: 'flex', gap: 10,
          }}>
            <div style={{ flex: 1, background: '#fef0eb', borderRadius: 12, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: '#D85A30', marginBottom: 2 }}>You owe</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#D85A30' }}>₹{totalOwe.toLocaleString('en-IN')}</div>
            </div>
            <div style={{ flex: 1, background: '#e8f5f0', borderRadius: 12, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: '#1D9E75', marginBottom: 2 }}>You are owed</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#1D9E75' }}>₹{totalOwed.toLocaleString('en-IN')}</div>
            </div>
          </div>
        )}

        {/* ── Create Group form ── */}
        {showCreate && (
          <div style={{
            margin: '12px 16px 0', background: 'var(--surface,#fff)',
            borderRadius: 16, padding: '16px', border: '1px solid var(--border,#e5e7eb)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink1,#111)', marginBottom: 14 }}>New Group</div>

            {/* Emoji picker */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {GROUP_EMOJIS.map(e => (
                <button key={e} onClick={() => setEmoji(e)} style={{
                  width: 36, height: 36, fontSize: 20, border: 'none', cursor: 'pointer',
                  borderRadius: 10, background: emoji === e ? '#e8f5f0' : 'var(--bg,#f5f5f5)',
                  outline: emoji === e ? '2px solid #1D9E75' : 'none',
                }}>{e}</button>
              ))}
            </div>

            {/* Group name */}
            <input
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="Group name e.g. Goa Trip"
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 14,
                border: '1.5px solid var(--border,#e5e7eb)', outline: 'none',
                background: 'var(--bg,#f5f5f5)', color: 'var(--ink1,#111)',
                boxSizing: 'border-box', marginBottom: 12,
              }}
            />

            {/* Members */}
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2,#555)', marginBottom: 8 }}>
              Members ({members.length}/8)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {members.map(m => (
                <div key={m} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: m === 'You' ? '#e8f5f0' : 'var(--bg,#f5f5f5)',
                  border: '1px solid var(--border,#e5e7eb)',
                  borderRadius: 20, padding: '4px 10px', fontSize: 13,
                }}>
                  <span style={{ color: m === 'You' ? '#1D9E75' : 'var(--ink1,#111)', fontWeight: m === 'You' ? 600 : 400 }}>
                    {m === 'You' ? '👤 You' : m}
                  </span>
                  {m !== 'You' && (
                    <button onClick={() => removeMember(m)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
                  )}
                </div>
              ))}
            </div>

            {/* Add member input */}
            {members.length < 8 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <input
                  value={memberInput}
                  onChange={e => setMemberInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMember()}
                  placeholder="Add friend's name"
                  style={{
                    flex: 1, padding: '8px 12px', borderRadius: 10, fontSize: 13,
                    border: '1.5px solid var(--border,#e5e7eb)', outline: 'none',
                    background: 'var(--bg,#f5f5f5)', color: 'var(--ink1,#111)',
                  }}
                />
                <button onClick={addMember} style={{
                  background: '#e8f5f0', border: 'none', color: '#1D9E75',
                  borderRadius: 10, padding: '8px 14px', fontSize: 13,
                  fontWeight: 600, cursor: 'pointer',
                }}>+ Add</button>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowCreate(false)} style={{
                flex: 1, padding: '10px', borderRadius: 12,
                border: '1px solid var(--border,#e5e7eb)', background: 'var(--surface,#fff)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--ink2,#555)',
              }}>Cancel</button>
              <button
                onClick={handleCreate}
                disabled={!groupName.trim() || members.length < 2}
                style={{
                  flex: 2, padding: '10px', borderRadius: 12, border: 'none',
                  background: groupName.trim() && members.length >= 2 ? '#1D9E75' : '#ccc',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff',
                }}>
                Create Group →
              </button>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {groups.length === 0 && !showCreate && (
          <div style={{ margin: '60px 16px 0', textAlign: 'center', color: 'var(--ink3,#999)' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>👥</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink2,#555)', marginBottom: 6 }}>No groups yet</div>
            <div style={{ fontSize: 14, marginBottom: 20 }}>Create a group for trips, flatmates, or any shared expenses</div>
            <button onClick={() => setShowCreate(true)} style={{
              background: '#1D9E75', color: '#fff', border: 'none',
              borderRadius: 12, padding: '12px 28px', fontSize: 14,
              fontWeight: 600, cursor: 'pointer',
            }}>+ Create your first group</button>
          </div>
        )}

        {/* ── Groups list ── */}
        {groups.map(g => {
          const balances   = calcBalances(g)
          const youOwe     = balances.filter(b => b.from === 'You').reduce((s,b) => s+b.amount, 0)
          const youAreOwed = balances.filter(b => b.to   === 'You').reduce((s,b) => s+b.amount, 0)
          const totalExp   = g.expenses.filter(e => !e.isSettlement).reduce((s,e) => s+e.amount, 0)

          return (
            <div key={g.id}
              onClick={() => navigate(`/groups/${g.id}`)}
              style={{
                margin: '10px 16px 0', background: 'var(--surface,#fff)',
                borderRadius: 16, padding: '14px 16px',
                border: '1px solid var(--border,#e5e7eb)',
                cursor: 'pointer', transition: 'box-shadow 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Group icon */}
                <div style={{
                  width: 46, height: 46, borderRadius: 14,
                  background: '#e8f5f0', fontSize: 24,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {g.emoji}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink1,#111)' }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink3,#999)', marginTop: 2 }}>
                    {g.members.length} members · {g.expenses.filter(e => !e.isSettlement).length} expenses · ₹{totalExp.toLocaleString('en-IN')} total
                  </div>
                </div>

                {/* Balance pill */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {youOwe > 0 && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#D85A30', background: '#fef0eb', borderRadius: 8, padding: '3px 8px' }}>
                      −₹{youOwe.toLocaleString('en-IN')}
                    </div>
                  )}
                  {youAreOwed > 0 && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1D9E75', background: '#e8f5f0', borderRadius: 8, padding: '3px 8px', marginTop: youOwe > 0 ? 4 : 0 }}>
                      +₹{youAreOwed.toLocaleString('en-IN')}
                    </div>
                  )}
                  {youOwe === 0 && youAreOwed === 0 && (
                    <div style={{ fontSize: 12, color: '#1D9E75', fontWeight: 600 }}>✓ Settled</div>
                  )}
                </div>
              </div>

              {/* Member avatars */}
              <div style={{ display: 'flex', marginTop: 10, gap: 4 }}>
                {g.members.slice(0, 5).map((m, i) => (
                  <div key={m} style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: i === 0 ? '#1D9E75' : `hsl(${i*60},60%,70%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff',
                    border: '2px solid var(--surface,#fff)',
                    marginLeft: i > 0 ? -8 : 0,
                  }}>
                    {m[0].toUpperCase()}
                  </div>
                ))}
                {g.members.length > 5 && (
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: '#e5e7eb', fontSize: 10, fontWeight: 700,
                    color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginLeft: -8, border: '2px solid var(--surface,#fff)',
                  }}>+{g.members.length - 5}</div>
                )}
                <div style={{ flex: 1 }} />
                <div style={{ fontSize: 12, color: 'var(--ink3,#999)', alignSelf: 'center' }}>
                  Created {g.createdAt}
                </div>
              </div>
            </div>
          )
        })}

      </div>
      <BottomNav />
    </div>
  )
}
