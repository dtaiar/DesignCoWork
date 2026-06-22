import { useState } from 'react'
import { postAngles } from '../data/captures'

const topicPost = `Most design token implementations fail at the semantic layer.

Not because naming is hard. Because teams skip the step where they decide what the token means before they decide what it's called.

A color called blue-500 is a primitive. A color called action-primary is a decision.

The difference matters when you're supporting multiple brands or themes. The primitive says nothing about intent — you can't swap it without auditing every usage. The semantic name tells the system what to replace and why.

Three tiers. In this order:
1. Global primitives (values with no opinion)
2. Semantic decisions (values with a job)
3. Component overrides (values scoped to a specific context)

Most teams do 1 and 3. They skip 2 and wonder why theming is hard.`

export default function PostPanel({ open, context, onClose, showToast }) {
  const [selected, setSelected] = useState(0)

  const isTopic = context?.type === 'topic'
  const angles = isTopic ? [{ label: 'Generated draft', text: topicPost }] : postAngles

  const copy = () => {
    navigator.clipboard?.writeText(angles[selected].text)
    showToast('Copied to clipboard ✓')
  }

  return (
    <div className={`panel${open ? ' open' : ''}`}>
      <div className="panel-handle" />
      <div className="panel-head">
        <div className="panel-icon">✍️</div>
        <div className="panel-title">{isTopic ? context?.topic : 'Post draft'}</div>
        <div className="panel-sub">{isTopic ? 'Topic library · 1 angle' : 'From reference · 3 angles'}</div>
      </div>
      <div className="panel-body">
        {!isTopic && (
          <div style={{ display: 'flex', gap: 6 }}>
            {postAngles.map((a, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{
                  padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${selected === i ? 'var(--accent)' : 'var(--border)'}`,
                  background: selected === i ? 'var(--accent-2)' : 'var(--surface)',
                  color: selected === i ? 'var(--accent)' : 'var(--text-2)',
                  cursor: 'pointer', WebkitTapHighlightColor: 'transparent', fontFamily: 'inherit',
                }}
              >{a.label}</button>
            ))}
          </div>
        )}
        <div style={{
          border: '1.5px solid var(--accent)', borderRadius: 14, background: 'var(--accent-2)',
          padding: '14px 16px', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-line', color: 'var(--text-1)',
        }}>
          {angles[selected]?.text}
        </div>
        {isTopic && (
          <button
            className="btn btn-secondary btn-full"
            onClick={() => showToast('Regenerating…')}
          >
            Try a different angle
          </button>
        )}
      </div>
      <div className="panel-footer">
        <button className="btn btn-primary btn-full" onClick={copy}>Copy post</button>
        <button className="btn btn-secondary btn-full" onClick={onClose}>Save to drafts</button>
      </div>
    </div>
  )
}
