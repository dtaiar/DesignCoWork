import { useState } from 'react'
import { topics } from '../data/captures'

export default function PostsTab({ onOpenPost, captures = [], drafts = [], onDeleteDraft, showToast }) {
  const [mode, setMode] = useState('ref')

  return (
    <>
      <div style={{ padding: '16px 20px 12px', display: 'flex', gap: 8 }}>
        {[['ref', 'From reference'], ['topic', 'Topic library']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            style={{
              flex: 1, padding: 10, borderRadius: 10,
              border: `1.5px solid ${mode === id ? 'var(--accent)' : 'var(--border)'}`,
              background: mode === id ? 'var(--accent-2)' : 'var(--surface)',
              color: mode === id ? 'var(--accent)' : 'var(--text-2)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent', fontFamily: 'inherit',
            }}
          >{label}</button>
        ))}
      </div>

      {mode === 'ref' && (
        <>
          <div className="section-header">
            <span className="section-title">Pick a capture to write about</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{captures.length} saved</span>
          </div>
          {captures.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📎</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginBottom: 6 }}>No captures yet</div>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>Paste a URL in the Capture tab to save a reference and write a post from it.</div>
            </div>
          ) : (
            <div className="item-list">
              {captures.map(c => (
                <div key={c.id} className="item-card" onClick={() => onOpenPost({ type: 'capture', capture: c })}>
                  <div className="item-top">
                    <span className="item-title">{c.title}</span>
                    {c.chip && <span className="chip chip-accent">{c.chip}</span>}
                  </div>
                  <div className="item-preview">{(c.points || [])[0]}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'topic' && (
        <>
          <div className="section-header">
            <span className="section-title">Design topics</span>
          </div>
          <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {topics.map(t => (
              <button
                key={t.name}
                onClick={() => onOpenPost({ type: 'topic', topic: t.name })}
                style={{
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14,
                  padding: 14, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
                  textAlign: 'left', fontFamily: 'inherit',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 8 }}>{t.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: 3 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{t.count} post angles</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Draft queue */}
      <div className="section-header" style={{ marginTop: 12 }}>
        <span className="section-title">Draft queue</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{drafts.length} {drafts.length === 1 ? 'draft' : 'drafts'}</span>
      </div>
      {drafts.length === 0 ? (
        <div style={{ padding: '16px 20px', color: 'var(--text-3)', fontSize: 13 }}>
          No drafts saved yet. Generate a post and hit "Save draft".
        </div>
      ) : (
        <div className="item-list">
          {drafts.map(d => (
            <div key={d.id} className="item-card">
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-2)', marginBottom: 8 }}>
                {d.source || 'Draft'}
              </div>
              <div style={{
                fontSize: 14, lineHeight: 1.6, color: 'var(--text-1)',
                display: '-webkit-box', WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-line',
              }}>
                {d.text}
              </div>
              <div className="item-footer" style={{ justifyContent: 'flex-end', gap: 8 }}>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={e => { e.stopPropagation(); onDeleteDraft?.(d.id); showToast?.('Draft deleted') }}
                >Delete</button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={e => {
                    e.stopPropagation()
                    navigator.clipboard?.writeText(d.text)
                    showToast?.('Copied to clipboard ✓')
                  }}
                >Copy</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="spacer" />
    </>
  )
}
