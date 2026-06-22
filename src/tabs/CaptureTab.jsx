import { useState } from 'react'
import { sampleCaptures } from '../data/captures'

export default function CaptureTab({ onOpenPost, showToast }) {
  const [type, setType] = useState('url')
  const [input, setInput] = useState('')
  const [captures, setCaptures] = useState(sampleCaptures)
  const [loading, setLoading] = useState(false)

  const placeholders = {
    url: 'Paste a URL, LinkedIn post, or article link…',
    text: 'Paste text, a quote, or a snippet…',
    note: 'Write a quick note or observation…',
  }

  const runCapture = () => {
    if (!input.trim()) { showToast('Paste a URL or text first'); return }
    setLoading(true)
    setInput('')
    setTimeout(() => {
      setCaptures(prev => [{
        id: Date.now(),
        type: 'Article',
        typeColor: 'var(--accent)',
        title: 'The Invisible Interface — Designing for Zero UI',
        source: 'UX Collective · Jun 22, 2026',
        points: [
          "Zero UI isn't about removing interfaces — it's about moving interaction to where the data already lives",
          'The cases that work share one trait: the system anticipates the next action with enough confidence to surface it without being asked',
          'Failure mode is over-automation — when the system guesses wrong, the user has no visible model to correct it against',
        ],
        relevance: "The Hedging Tool's position entry flow has 6 manual steps that could be reduced to 2 if the system inferred counterparty and currency from the contract type. This article gives you the framing to make that argument to the PM.",
        chip: { label: 'Article', cls: 'chip-accent' },
        chip2: { label: 'UX Collective', cls: 'chip-neutral' },
        previewText: '',
        daysAgo: 'now',
      }, ...prev])
      setLoading(false)
      showToast('Reference saved ✓')
    }, 1800)
  }

  return (
    <>
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Add a design reference
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          {['url', 'text', 'note'].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                padding: '5px 12px', borderRadius: 100,
                border: `1.5px solid ${type === t ? 'var(--accent)' : 'var(--border)'}`,
                background: type === t ? 'var(--accent-2)' : 'var(--surface)',
                color: type === t ? 'var(--accent)' : 'var(--text-2)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent', fontFamily: 'inherit',
                textTransform: 'capitalize',
              }}
            >{t}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={placeholders[type]}
            onKeyDown={e => e.key === 'Enter' && runCapture()}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary btn-sm" onClick={runCapture}>Analyze</button>
        </div>
      </div>

      <div className="section-header">
        <span className="section-title">Saved references</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{captures.length} captures</span>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading && (
          <div className="cap-card">
            <div className="enrich-loading">
              <div className="pulse" />
              <span className="enrich-loading-text">Fetching and enriching…</span>
            </div>
          </div>
        )}
        {captures.map(c => (
          <div key={c.id} className="cap-card">
            <div className="cap-header">
              <div className="cap-type" style={{ color: c.typeColor }}>{c.type}</div>
              <div className="cap-title">{c.title}</div>
              <div className="cap-source">{c.source}</div>
            </div>
            <div className="cap-brief">
              <div className="cap-brief-title">Three things that matter</div>
              <ul className="cap-points">
                {c.points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div className="cap-relevance">
              <div className="cap-relevance-label">Why it matters for your work</div>
              <div className="cap-relevance-text">{c.relevance}</div>
            </div>
            <div className="cap-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => showToast('Copied to clipboard ✓')}>Copy brief</button>
              <button className="btn btn-secondary btn-sm" onClick={() => onOpenPost({ type: 'capture', capture: c })}>Write post</button>
            </div>
          </div>
        ))}
      </div>
      <div className="spacer" />
    </>
  )
}
