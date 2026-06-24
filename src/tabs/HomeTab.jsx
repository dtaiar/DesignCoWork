import { sampleOutputs } from '../data/captures'
import { skills } from '../data/skills'

export default function HomeTab({ onOpenSkill, onOpenOutput, onSwitchTab, captures = [] }) {
  const quickIds = ['critique', 'a11y', 'handoff']
  const quickActions = quickIds.map(id => {
    const s = skills.find(sk => sk.id === id)
    return { id, icon: s.icon, name: s.name, desc: s.desc, bg: s.color }
  })

  return (
    <>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 6 }}>
          Good morning,<br />Daniel.
        </div>
        <button
          onClick={() => {}}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 100,
            fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-2)',
            WebkitTapHighlightColor: 'transparent', marginTop: 8, fontFamily: 'inherit',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          No active project · Set context
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
        {sampleCaptures.slice(0, 2).map(c => (
          <div key={c.id} className="item-card" onClick={() => onSwitchTab('capture')}>
            <div className="item-top">
              <span className="item-title">{c.title}</span>
              <span className="item-time">{c.daysAgo}</span>
            </div>
            <div className="item-preview">{c.previewText}</div>
            <div className="item-footer">
              <span className={`chip ${c.chip.cls}`}>{c.chip.label}</span>
              <span className={`chip ${c.chip2.cls}`}>{c.chip2.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <span className="section-title">Recent outputs</span>
        <button className="section-link" onClick={() => onSwitchTab('library')}>See all</button>
      </div>
      <div className="item-list">
        {sampleOutputs.slice(0, 2).map(o => (
          <div key={o.id} className="item-card" onClick={() => onOpenOutput(o.fullOutput)}>
            <div className="item-top">
              <span className="item-title">{o.title}</span>
              <span className="item-time">{o.age}</span>
            </div>
            <div className="item-preview">{o.preview}</div>
            <div className="item-footer">
              <span className={`chip ${o.chipCls}`}>{o.skill}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="spacer" />
    </>
  )
}
