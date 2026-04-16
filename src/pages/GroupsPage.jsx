import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGroup } from '../context/GroupContext'
import BottomNav from '../components/BottomNav'

const GROUP_EMOJIS = ['🏖️','🏕️','🍕','✈️','🏠','🎉','🛒','🚗','💼','🎓','🏋️','🎮']

export default function GroupsPage() {
  const navigate = useNavigate()
  const { groups, createGroup, calcBalances } = useGroup()

  const [showCreate, setShowCreate] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [emoji, setEmoji] = useState('🏖️')
  const [memberInput, setMemberInput] = useState('')
  const [members, setMembers] = useState(['You'])

  function addMember() {
    const name = memberInput.trim()
    if (!name || members.includes(name) || members.length >= 8) return
    setMembers(prev => [...prev, name])
    setMemberInput('')
  }

  function removeMember(name) {
    if (name === 'You') return
    setMembers(prev => prev.filter(m => m !== name))
  }

  async function handleCreate() {
    if (!groupName.trim() || members.length < 2) return
    const id = await createGroup(groupName.trim(), emoji, members)
    if (!id) return

    setShowCreate(false)
    setGroupName('')
    setEmoji('🏖️')
    setMembers(['You'])
    setMemberInput('')

    navigate(`/groups/${id}`)
  }

  function handleCancel() {
    setShowCreate(false)
    setGroupName('')
    setEmoji('🏖️')
    setMembers(['You'])
    setMemberInput('')
  }

  const { totalOwe, totalOwed } = groups.reduce(
    (acc, g) => {
      const balances = calcBalances(g)
      balances.forEach(b => {
        if (b.from === 'You') acc.totalOwe += b.amount
        if (b.to === 'You') acc.totalOwed += b.amount
      })
      return acc
    },
    { totalOwe: 0, totalOwed: 0 }
  )

  return (
    <div className="page-shell" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 80px' }}>

        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 20px 16px',
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/home')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text2)',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>
                Split Expenses
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                Groups & shared bills
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            style={{
              background: 'var(--teal)',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              borderRadius: 10,
              padding: '7px 14px',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            + Group
          </button>
        </div>

        {/* SUMMARY */}
        {groups.length > 0 && (
          <div style={{ margin: '12px 16px 0', display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: 'var(--coral-l)', borderRadius: 12, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--coral)' }}>You owe</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--coral)' }}>
                ₹{totalOwe.toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ flex: 1, background: 'var(--teal-l)', borderRadius: 12, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--teal)' }}>You are owed</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--teal)' }}>
                ₹{totalOwed.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        )}

        {/* CREATE GROUP */}
        {showCreate && (
          <div
            style={{
              margin: '12px 16px 0',
              background: 'var(--surface)',
              borderRadius: 16,
              padding: '16px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
              New Group
            </div>

            <input
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="Group name e.g. Goa Trip"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                fontSize: 14,
                border: '1.5px solid var(--border)',
                outline: 'none',
                background: 'var(--surface)',
                color: 'var(--text)',
                marginBottom: 12,
              }}
            />

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>
                Choose an emoji
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {GROUP_EMOJIS.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      border: emoji === e ? '2px solid var(--teal)' : '1px solid var(--border)',
                      background: 'var(--surface)',
                      cursor: 'pointer',
                      fontSize: 18,
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>
                Add members
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input
                  value={memberInput}
                  onChange={e => setMemberInput(e.target.value)}
                  placeholder="Member name"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: 10,
                    fontSize: 14,
                    border: '1.5px solid var(--border)',
                    outline: 'none',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMember() } }}
                />
                <button
                  type="button"
                  onClick={addMember}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 12,
                    border: 'none',
                    background: memberInput.trim() ? 'var(--teal)' : '#ccc',
                    color: '#fff',
                    cursor: memberInput.trim() ? 'pointer' : 'not-allowed',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >Add</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {members.map(name => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => removeMember(name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 10px',
                      borderRadius: 999,
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      color: 'var(--text)',
                      cursor: name === 'You' ? 'default' : 'pointer',
                      opacity: name === 'You' ? 0.6 : 1,
                    }}
                  >
                    {name}
                    {name !== 'You' && <span style={{ fontSize: 12 }}>✕</span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--text2)',
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                disabled={!groupName.trim() || members.length < 2}
                style={{
                  flex: 2,
                  padding: '10px',
                  borderRadius: 12,
                  border: 'none',
                  background: groupName.trim() && members.length >= 2 ? 'var(--teal)' : '#ccc',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: groupName.trim() && members.length >= 2 ? 'pointer' : 'not-allowed',
                  color: '#fff',
                }}
              >
                Create Group →
              </button>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {groups.length === 0 && !showCreate && (
          <div style={{ margin: '60px 16px 0', textAlign: 'center', color: 'var(--text3)' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>👥</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
              No groups yet
            </div>
            <div style={{ fontSize: 14, marginBottom: 20 }}>
              Create a group for trips, flatmates, or shared expenses
            </div>

            <button
              onClick={() => setShowCreate(true)}
              style={{
                background: 'var(--teal)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 28px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Create your first group
            </button>
          </div>
        )}

        {/* GROUP LIST */}
        {groups.map(g => {
          const balances = calcBalances(g)
          const youOwe = balances.filter(b => b.from === 'You').reduce((s, b) => s + b.amount, 0)
          const youAreOwed = balances.filter(b => b.to === 'You').reduce((s, b) => s + b.amount, 0)
          const totalExp = g.expenses.filter(e => !e.isSettlement).reduce((s, e) => s + e.amount, 0)

          return (
            <div
              key={g.id}
              onClick={() => navigate(`/groups/${g.id}`)}
              style={{
                margin: '10px 16px 0',
                background: 'var(--surface)',
                borderRadius: 16,
                padding: '14px 16px',
                border: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: 'var(--teal-l)',
                  fontSize: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {g.emoji}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                    {g.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                    {g.members.length} members · {g.expenses.length} expenses · ₹{totalExp.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {youOwe > 0 && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--coral)' }}>
                      −₹{youOwe.toLocaleString('en-IN')}
                    </div>
                  )}
                  {youAreOwed > 0 && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>
                      +₹{youAreOwed.toLocaleString('en-IN')}
                    </div>
                  )}
                  {youOwe === 0 && youAreOwed === 0 && (
                    <div style={{ fontSize: 12, color: 'var(--teal)', fontWeight: 600 }}>
                      ✓ Settled
                    </div>
                  )}
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