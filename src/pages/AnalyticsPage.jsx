import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Sector,
  BarChart, Bar, Cell as BarCell, ReferenceLine,
} from 'recharts'
import { useTx } from '../context/TxContext'
import BottomNav from '../components/BottomNav'

// ── constants ────────────────────────────────────────────────
const MONTH_NAMES  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_LABELS   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const DONUT_COLORS = ['#1D9E75','#D85A30','#5DCAA5','#F59E0B','#6366F1','#EC4899','#14B8A6','#8B5CF6']
const HEAT_COLORS  = ['#eef9f4','#9FE1CB','#5DCAA5','#1D9E75','#0F6E56','#085041']

function fmtY(n) { return n >= 1000 ? `₹${(n/1000).toFixed(1)}k` : `₹${n}` }

// ── Line chart tooltip ───────────────────────────────────────
function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'var(--surface,#fff)', border:'1px solid var(--border,#e5e7eb)', borderRadius:10, padding:'10px 14px', fontSize:13 }}>
      <p style={{ fontWeight:700, marginBottom:6 }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color:p.color, margin:'2px 0' }}>{p.name}: ₹{p.value.toLocaleString('en-IN')}</p>)}
    </div>
  )
}

// ── Waterfall tooltip ────────────────────────────────────────
function WaterfallTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  const colors = { Income:'#1D9E75', Expense:'#D85A30', Balance:'#5DCAA5', Savings:'#F59E0B' }
  return (
    <div style={{ background:'var(--surface,#fff)', border:'1px solid var(--border,#e5e7eb)', borderRadius:10, padding:'10px 14px', fontSize:13 }}>
      <p style={{ fontWeight:700, marginBottom:4 }}>{label}</p>
      <p style={{ color: colors[d.type] || '#555', margin:0 }}>₹{d.displayAmt?.toLocaleString('en-IN')}</p>
    </div>
  )
}

// ── Active donut slice ───────────────────────────────────────
function ActiveShape({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value }) {
  return (
    <g>
      <text x={cx} y={cy-12} textAnchor="middle" fill="var(--ink1,#111)" style={{ fontSize:13, fontWeight:700 }}>{payload.name}</text>
      <text x={cx} y={cy+10} textAnchor="middle" fill="var(--ink2,#555)" style={{ fontSize:12 }}>₹{value.toLocaleString('en-IN')}</text>
      <text x={cx} y={cy+28} textAnchor="middle" fill="var(--ink3,#999)" style={{ fontSize:11 }}>{(percent*100).toFixed(1)}%</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius+6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={innerRadius-4} outerRadius={innerRadius-2} startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  )
}

export default function AnalyticsPage() {
  const { transactions, categoryTotals } = useTx()
  const navigate = useNavigate()
  const [activeDonut, setActiveDonut]   = useState(0)
  const [hoveredCell, setHoveredCell]   = useState(null)

  // ── Monthly data ──────────────────────────────────────────
  const monthlyData = useMemo(() => {
    const map = {}
    transactions.forEach(tx => {
      const d   = new Date(tx.date)
      const key = `${MONTH_NAMES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`
      if (!map[key]) map[key] = { month:key, income:0, expense:0, savings:0, _ts:d.getTime() }
      if (tx.type === 'income') map[key].income += tx.amount
      else map[key].expense += tx.amount
    })
    return Object.values(map).sort((a,b)=>a._ts-b._ts).map(m=>({ ...m, savings:Math.max(0,m.income-m.expense) }))
  }, [transactions])

  // ── Donut data ────────────────────────────────────────────
  const donutData = useMemo(() =>
    categoryTotals.filter(([,a])=>a>0).slice(0,8).map(([cat,amt])=>({ name:cat, value:amt }))
  , [categoryTotals])

  // ── Heatmap data ──────────────────────────────────────────
  const { heatGrid, weeks, maxAmt } = useMemo(() => {
    const dayMap = {}
    transactions.forEach(tx => {
      if (tx.type === 'expense') dayMap[tx.date] = (dayMap[tx.date]||0) + tx.amount
    })
    const today   = new Date()
    const diff    = (today.getDay() + 6) % 7
    const lastMon = new Date(today)
    lastMon.setDate(today.getDate() - diff - 9*7)
    lastMon.setHours(0,0,0,0)
    const grid = [], wLabels = []
    let maxA = 0
    for (let w = 0; w < 10; w++) {
      const row = []
      for (let d = 0; d < 7; d++) {
        const cur = new Date(lastMon)
        cur.setDate(lastMon.getDate() + w*7 + d)
        const dateStr = cur.toISOString().slice(0,10)
        const amt = dayMap[dateStr] || 0
        if (amt > maxA) maxA = amt
        row.push({ dateStr, amount:amt, future: cur > today })
      }
      const mon = new Date(lastMon)
      mon.setDate(lastMon.getDate() + w*7)
      wLabels.push(`${MONTH_NAMES[mon.getMonth()]} ${mon.getDate()}`)
      grid.push(row)
    }
    return { heatGrid:grid, weeks:wLabels, maxAmt:maxA }
  }, [transactions])

  function heatColor(amount, future) {
    if (future) return '#f5f5f5'
    if (amount === 0) return HEAT_COLORS[0]
    return HEAT_COLORS[Math.min(5, Math.ceil((amount/(maxAmt||1))*5))]
  }

  // ── Waterfall data ────────────────────────────────────────
  // Per month: Start → +Income → -Expense → End balance
  const waterfallData = useMemo(() => {
    if (!monthlyData.length) return []
    const bars = []
    let runningBalance = 0

    monthlyData.forEach(m => {
      const startBal = runningBalance
      // invisible offset bar + income bar
      bars.push({ name: m.month, offset: startBal, displayAmt: m.income, barAmt: m.income, type:'Income', fill:'#1D9E75' })
      // expense bar (floats from startBal + income downward)
      bars.push({ name: m.month, offset: startBal + m.income - m.expense, displayAmt: m.expense, barAmt: m.expense, type:'Expense', fill:'#D85A30' })
      runningBalance = startBal + m.income - m.expense
      // ending balance
      bars.push({ name: m.month, offset: 0, displayAmt: runningBalance, barAmt: runningBalance, type:'Balance', fill: runningBalance >= 0 ? '#5DCAA5' : '#F59E0B' })
    })
    return bars
  }, [monthlyData])

  // Simpler waterfall — one bar per month showing net (income - expense) stacked
  const simpleWaterfall = useMemo(() => {
    return monthlyData.map(m => ({
      name:    m.month,
      Income:  m.income,
      Expense: m.expense,
      Net:     m.income - m.expense,
    }))
  }, [monthlyData])

  const hasMonthly  = monthlyData.length > 0
  const hasDonut    = donutData.length > 0
  const hasHeat     = maxAmt > 0
  const hasWaterfall= simpleWaterfall.length > 0

  const cardStyle = {
    margin: '12px 16px 0',
    background: 'var(--surface,#fff)',
    borderRadius: 16, padding: '18px 12px 14px',
    border: '1px solid var(--border,#e5e7eb)',
  }

  return (
    <div className="page-shell" style={{ background:'var(--bg,#f5f5f5)' }}>
      <div style={{ maxWidth:480, margin:'0 auto', padding:'0 0 80px' }}>

        {/* ── Header ── */}
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:'20px 20px 16px', background:'var(--surface,#fff)', borderBottom:'1px solid var(--border,#e5e7eb)' }}>
          <button onClick={() => navigate('/home')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ink2,#555)', padding:0, display:'flex', alignItems:'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <div style={{ fontSize:17, fontWeight:700, color:'var(--ink1,#111)' }}>Analytics</div>
            <div style={{ fontSize:12, color:'var(--ink3,#999)' }}>Your spending insights</div>
          </div>
        </div>

        {/* ── 1. Monthly Trends ── */}
        <div style={{ ...cardStyle, marginTop:16 }}>
          <div style={{ paddingLeft:6, marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--ink1,#111)' }}>📈 Monthly Trends</div>
            <div style={{ fontSize:12, color:'var(--ink3,#999)', marginTop:2 }}>Income · Expenses · Savings over time</div>
          </div>
          {!hasMonthly ? (
            <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink3,#999)', fontSize:14 }}>No transactions yet!</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData} margin={{ top:4, right:10, left:-10, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border,#e5e7eb)" />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'var(--ink3,#999)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtY} tick={{ fontSize:11, fill:'var(--ink3,#999)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<LineTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12, paddingTop:10 }} />
                <Line type="monotone" dataKey="income"  name="Income"  stroke="#1D9E75" strokeWidth={2.5} dot={{ r:4, fill:'#1D9E75' }} activeDot={{ r:6 }} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#D85A30" strokeWidth={2.5} dot={{ r:4, fill:'#D85A30' }} activeDot={{ r:6 }} />
                <Line type="monotone" dataKey="savings" name="Savings" stroke="#5DCAA5" strokeWidth={2} strokeDasharray="5 5" dot={{ r:3, fill:'#5DCAA5' }} activeDot={{ r:5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── 2. Donut ── */}
        <div style={cardStyle}>
          <div style={{ paddingLeft:6, marginBottom:8 }}>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--ink1,#111)' }}>🍩 Category Breakdown</div>
            <div style={{ fontSize:12, color:'var(--ink3,#999)', marginTop:2 }}>Tap a slice to see details</div>
          </div>
          {!hasDonut ? (
            <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink3,#999)', fontSize:14 }}>No expense categories yet!</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} dataKey="value"
                    activeIndex={activeDonut} activeShape={<ActiveShape />}
                    onMouseEnter={(_,i) => setActiveDonut(i)}>
                    {donutData.map((_,i) => <Cell key={i} fill={DONUT_COLORS[i%DONUT_COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 12px', padding:'4px 6px 2px' }}>
                {donutData.map((d,i) => (
                  <div key={d.name} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer', fontSize:12 }} onMouseEnter={() => setActiveDonut(i)}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:DONUT_COLORS[i%DONUT_COLORS.length], flexShrink:0 }} />
                    <span style={{ color:'var(--ink2,#555)' }}>{d.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── 3. Heatmap ── */}
        <div style={cardStyle}>
          <div style={{ paddingLeft:6, marginBottom:12 }}>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--ink1,#111)' }}>🔥 Spending Heatmap</div>
            <div style={{ fontSize:12, color:'var(--ink3,#999)', marginTop:2 }}>Daily expenses — last 10 weeks</div>
          </div>
          {!hasHeat ? (
            <div style={{ height:160, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink3,#999)', fontSize:14 }}>No expense data yet!</div>
          ) : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'44px repeat(7,1fr)', gap:3, marginBottom:3 }}>
                <div />
                {DAY_LABELS.map(d => <div key={d} style={{ fontSize:10, color:'var(--ink3,#999)', textAlign:'center' }}>{d}</div>)}
              </div>
              {heatGrid.map((row,wi) => (
                <div key={wi} style={{ display:'grid', gridTemplateColumns:'44px repeat(7,1fr)', gap:3, marginBottom:3 }}>
                  <div style={{ fontSize:10, color:'var(--ink3,#999)', display:'flex', alignItems:'center' }}>{weeks[wi]}</div>
                  {row.map((cell,di) => (
                    <div key={di} style={{
                      height:22, borderRadius:4,
                      background: heatColor(cell.amount, cell.future),
                      cursor: cell.amount > 0 ? 'pointer' : 'default',
                      border: hoveredCell?.dateStr===cell.dateStr ? '1.5px solid #1D9E75' : '1.5px solid transparent',
                      transform: hoveredCell?.dateStr===cell.dateStr ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.1s',
                    }}
                    onMouseEnter={() => cell.amount>0 && setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    />
                  ))}
                </div>
              ))}
              {hoveredCell && (
                <div style={{ marginTop:10, padding:'8px 12px', background:'#e8f5f0', borderRadius:8, fontSize:12, color:'#0F6E56', display:'flex', justifyContent:'space-between' }}>
                  <span>📅 {hoveredCell.dateStr}</span>
                  <span style={{ fontWeight:700 }}>₹{hoveredCell.amount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:12, paddingLeft:2 }}>
                <span style={{ fontSize:10, color:'var(--ink3,#999)', marginRight:4 }}>Less</span>
                {HEAT_COLORS.map((c,i) => <div key={i} style={{ width:14, height:14, borderRadius:3, background:c }} />)}
                <span style={{ fontSize:10, color:'var(--ink3,#999)', marginLeft:4 }}>More</span>
              </div>
            </>
          )}
        </div>

        {/* ── 4. Waterfall ── */}
        <div style={cardStyle}>
          <div style={{ paddingLeft:6, marginBottom:16 }}>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--ink1,#111)' }}>💧 Income vs Expense Waterfall</div>
            <div style={{ fontSize:12, color:'var(--ink3,#999)', marginTop:2 }}>Monthly cash flow — green = surplus, red = deficit</div>
          </div>
          {!hasWaterfall ? (
            <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink3,#999)', fontSize:14 }}>No data yet!</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={simpleWaterfall} margin={{ top:4, right:10, left:-10, bottom:0 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border,#e5e7eb)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize:11, fill:'var(--ink3,#999)' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={fmtY} tick={{ fontSize:11, fill:'var(--ink3,#999)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val, name) => [`₹${Math.abs(val).toLocaleString('en-IN')}`, name]}
                    contentStyle={{ background:'var(--surface,#fff)', border:'1px solid var(--border,#e5e7eb)', borderRadius:10, fontSize:13 }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12, paddingTop:10 }} />
                  <ReferenceLine y={0} stroke="var(--border,#e5e7eb)" strokeWidth={1.5} />
                  <Bar dataKey="Income"  name="Income"  fill="#1D9E75" radius={[4,4,0,0]} maxBarSize={28} />
                  <Bar dataKey="Expense" name="Expense" fill="#D85A30" radius={[4,4,0,0]} maxBarSize={28} />
                  <Bar dataKey="Net" name="Net" radius={[4,4,0,0]} maxBarSize={28}>
                    {simpleWaterfall.map((entry, i) => (
                      <BarCell key={i} fill={entry.Net >= 0 ? '#5DCAA5' : '#F59E0B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Monthly summary pills */}
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:10, paddingTop:10, borderTop:'1px solid var(--border,#e5e7eb)' }}>
                {simpleWaterfall.map(m => (
                  <div key={m.name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12 }}>
                    <span style={{ color:'var(--ink2,#555)', fontWeight:600, minWidth:56 }}>{m.name}</span>
                    <span style={{ color:'#1D9E75' }}>+₹{m.Income.toLocaleString('en-IN')}</span>
                    <span style={{ color:'#D85A30' }}>−₹{m.Expense.toLocaleString('en-IN')}</span>
                    <span style={{
                      fontWeight:700,
                      color: m.Net >= 0 ? '#1D9E75' : '#D85A30',
                      background: m.Net >= 0 ? '#e8f5f0' : '#fef0eb',
                      padding:'2px 8px', borderRadius:6,
                    }}>
                      {m.Net >= 0 ? '+' : ''}₹{m.Net.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
      <BottomNav />
    </div>
  )
}

