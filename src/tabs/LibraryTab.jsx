import { useState } from 'react'
import { sampleOutputs } from '../data/captures'

const filters = ['All', 'Critique', 'A11y', 'Handoff', 'UX Copy']
const filterMap = { 'Critique': 'Design Critique', 'A11y': 'Accessibility Review', 'Handoff': 'Dev Handoff', 'UX Copy': 'UX Copy' }

export default function LibraryTab({ onOpenOutput, showToast }) {
  const [active, setActive] = useState('All')

  return (
    <>
      <div style={{ padding: '12px 20px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 100,
              border: `1.5px solid ${active === f ? 'var(--accent)' : 'var(--border)'}`,
              background: active === f ? 'var(--accent-2)' : 'var(--surface)',
              color: active === f ? 'var(--accent)' : 'var(--text-2)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent', fontFamily: 'inherit',
            }}
          >{f}</button>
        ))}
      </div>
      <div className="item-list">
        {sampleOutputs.filter(o => active === 'All' || o.skill === filterMap[active]).map(o => (
          <div key={o.id} className="item-card" onClick={() => onOpenOutput(o.fullOutput)}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: o.skillColor, marginBottom: 5 }}>{o.skill}</div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 8 }}>{o.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{o.preview}</div>
            <div className="item-footer" style={{ justifyContent: 'space-between' }}>
              <span className="chip chip-neutral">{o.age}</span>
              <button className="btn btn-sm btn-secondary" onClick={e => { e.stopPropagation(); showToast('Copied ✓') }}>Copy</button>
            </div>
          </div>
        ))}
      </div>
      <div className="spacer" />
    </>
  )
}
