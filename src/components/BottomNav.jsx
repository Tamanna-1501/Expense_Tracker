import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/home', label: 'Home', icon: (a) => <span>{a ? '🏠' : '🏡'}</span> },
  { to: '/groups', label: 'Groups', icon: () => <span>👥</span> },
  { to: '/transactions', label: 'Txns', icon: () => <span>💳</span> },
  { to: '/analytics', label: 'Analytics', icon: () => <span>📊</span> },
  { to: '/budget', label: 'Budget', icon: () => <span>💰</span> },
  { to: '/add', label: 'Add', icon: () => <span>➕</span> },
  { to: '/chatbot', label: 'FinBot', icon: () => <span>🤖</span> },
  { to: '/settings', label: 'Settings', icon: () => <span>⚙️</span> }
]

export default function BottomNav() {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0',
        zIndex: 1000,
      }}
    >
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            flex: 1,
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 10,
            color: isActive ? 'var(--teal)' : 'var(--ink3)',
            fontWeight: isActive ? 700 : 500,
          })}
        >
          {({ isActive }) => (
            <>
              <span style={{ fontSize: 20 }}>
                {item.icon(isActive)}
              </span>

              <span>
                {item.label}
              </span>

              {isActive && (
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--teal)',
                    marginTop: 2
                  }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
 