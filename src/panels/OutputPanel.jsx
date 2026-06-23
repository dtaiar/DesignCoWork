// Renders the dynamic output object produced by generateOutput(skillId, input).
// Section types: 'bullets' | 'body' | 'callout' | 'issues' | 'tokens' | 'copy-variants'

function Section({ section }) {
  if (section.type === 'bullets') {
    return (
      <div className="out-section">
        <div className="out-section-label">{section.label}</div>
        <ul className="out-bullets">
          {section.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    )
  }

  if (section.type === 'body') {
    return (
      <div className="out-section">
        <div className="out-section-label">{section.label}</div>
        <div className="out-section-body">{section.text}</div>
      </div>
    )
  }

  if (section.type === 'callout') {
    return (
      <div className="out-callout">
        <div className="out-callout-label">{section.label}</div>
        <div className="out-callout-text">{section.text}</div>
      </div>
    )
  }

  if (section.type === 'issues') {
    const levelColor = { high: 'var(--red, #E85C4A)', med: 'var(--orange)', low: 'var(--text-3)', fail: 'var(--red, #E85C4A)', pass: 'var(--green)' }
    const levelLabel = { high: 'HIGH', med: 'MED', low: 'LOW', fail: '✗', pass: '✓', A: 'A', AA: 'AA' }
    return (
      <div className="out-section">
        <div className="out-section-label">{section.label}</div>
        <div className="out-issues">
          {section.items.map((item, i) => (
            <div key={i} className="out-issue-row">
              <span
                className="out-issue-badge"
                style={{ color: levelColor[item.level] || levelColor[item.status] || 'var(--text-2)' }}
              >
                {levelLabel[item.level] || item.level}
              </span>
              <div className="out-issue-content">
                <div className="out-issue-title">{item.criterion}</div>
                <div className="out-issue-detail">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (section.type === 'tokens') {
    return (
      <div className="out-section">
        <div className="out-section-label">{section.label}</div>
        <div className="out-tokens">
          {section.items.map((item, i) => (
            <div key={i} className="out-token-row">
              <div className="out-token-swatch" style={{ background: item.value }} />
              <div className="out-token-info">
                <span className="out-token-name">{item.token}</span>
                <span className="out-token-value">{item.value}</span>
              </div>
              <div className="out-token-usage">{item.usage}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (section.type === 'copy-variants') {
    return (
      <div className="out-section">
        <div className="out-section-label">{section.label}</div>
        <div className="out-variants">
          {section.items.map((item, i) => (
            <div key={i} className="out-variant">
              <div className="out-variant-label">{item.label}</div>
              <div className="out-variant-text">"{item.text}"</div>
              {item.note && <div className="out-variant-note">{item.note}</div>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export default function OutputPanel({ open, output, onClose, showToast }) {
  return (
    <div className={`panel${open ? ' open' : ''}`}>
      <div className="panel-handle" />
      {output ? (
        <>
          <div className="panel-head">
            <div className="panel-icon" style={{ color: output.skillColor }}>{output.icon}</div>
            <div className="panel-title">{output.title}</div>
            <div className="panel-sub">{output.skill}</div>
          </div>
          <div className="panel-body">
            {output.sections.map((section, i) => (
              <Section key={i} section={section} />
            ))}
          </div>
          <div className="panel-footer">
            <button
              className="btn btn-primary btn-full"
              onClick={() => { navigator.clipboard?.writeText(output.copyText || ''); showToast('Copied ✓'); onClose() }}
            >
              Copy output
            </button>
            <button className="btn btn-secondary btn-full" onClick={onClose}>Close</button>
          </div>
        </>
      ) : (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>
          Run a skill to see output here.
        </div>
      )}
    </div>
  )
}
