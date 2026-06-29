import { skills } from '../data/skills'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning,'
  if (h < 17) return 'Good afternoon,'
  return 'Good evening,'
}

function formatAge(iso) {
  if (!iso) return ''
  const ms = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(ms / 3600000)
  const days = Math.floor(ms / 86400000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export default function HomeTab({ onOpenSkill, onOpenOutput, onSwitchTab, captures = [], onOpenCapture, onOpenProject, project, outputs = [] }) {
  const quickIds = ['critique', 'a11y', 'handoff']
  const quickActions = quickIds.map(id => {
    const s = skills.find(sk => sk.id === id)
    return { id, icon: s.icon, name: s.name, desc: s.desc, bg: s.color }
  })

  const hasProject = !!project

  return (
    <>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 6 }}>
          {greeting()}<br />Daniel.
        </div>
        <button
          onClick={onOpenProject}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            background: hasProject ? 'var(--accent-2)' : 'var(--surface)',
            border: `1px solid ${hasProject ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 100,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            color: hasProject ? 'var(--accent)' : 'var(--text-2)',
            WebkitTapHighlightColor: 'transparent', marginTop: 8, fontFamily: 'inherit',
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: hasProject ? 'var(--accent)' : 'var(--text-3)',
            display: 'inline-block', flexShrink: 0,
          }} />
          {hasProject ? project.name : 'No active project · Set context'}
        </button>
      </div>

      <div className="section-header" style={{ paddingTop: 24 }}>
        <span className="section-title">Quick actions</span>
      </div>
      <div style={{ padding: '0 20px 4px', display: 'flex', gap: 10, overflowX: 'auto' }}>
        {quickActions.map(q => (
          <button
            key={q.id}
            onClick={() => onOpenSkill(q.id)}
            style={{
              flexShrink: 0, width: 130, background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 14, padding: 14,
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              textAlign: 'left', fontFamily: 'inherit',
            }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 11, background: q.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 10 }}>{q.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 2 }}>{q.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.4 }}>{q.desc}</div>
          </button>
        ))}
      </div>

      <div className="section-header">
        <span className="section-title">Recent captures</span>
        <button className="section-link" onClick={() => onSwitchTab('capture')}>See all</button>
      </div>
      <div className="item-list">
        {captures.slice(0, 2).map(c => (
          <div key={c.id} className="item-card" onClick={() => onOpenCapture ? onOpenCapture(c) : onSwitchTab('capture')}>
            <div className="item-top">
              <span className="item-title">{c.title}</span>
              <span className="item-time">{c.daysAgo}</span>
            </div>
            <div className="item-preview">{c.previewText || (c.points || [])[0] || ''}</div>
            <div className="item-footer">
              {c.chip && <span className="chip chip-accent">{c.chip}</span>}
              {c.chip2 && <span className="chip chip-neutral">{c.chip2}</span>}
            </div>
          </div>
        ))}
        {captures.length === 0 && (
          <div style={{ padding: '16px 20px', color: 'var(--text-3)', fontSize: 13 }}>
            No captures yet — paste a URL in the Capture tab.
          </div>
        )}
      </div>

      <div className="section-header">
        <span className="section-title">Recent outputs</span>
        <button className="section-link" onClick={() => onSwitchTab('library')}>See all</button>
      </div>
      <div className="item-list">
        {outputs.slice(0, 2).map(o => (
          <div key={o.id} className="item-card" onClick={() => onOpenOutput(o)}>
            <div className="item-top">
              <span className="item-title">{o.title}</span>
              <span className="item-time">{formatAge(o.savedAt)}</span>
            </div>
            {o.sections?.[0] && (
              <div className="item-preview">
                {o.sections[0].type === 'bullets'
                  ? (o.sections[0].items || [])[0]
                  : o.sections[0].text || ''}
              </div>
            )}
            <div className="item-footer">
              <span className="chip chip-accent">{o.skill}</span>
            </div>
          </div>
        ))}
        {outputs.length === 0 && (
          <div style={{ padding: '16px 20px', color: 'var(--text-3)', fontSize: 13 }}>
            Run a skill and save the output — it'll appear here.
          </div>
        )}
      </div>
      <div className="spacer" />
    </>
  )
}
