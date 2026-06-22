const output = {
  title: 'Hedging Tool — Filter Panel',
  skill: 'Design Critique',
  age: '3 days ago',
  sections: [
    {
      label: 'What was reviewed',
      body: "The filter panel in the Hedging Tool's position management screen — specifically the chip-based filter row, the reset affordance, and the loading/empty states after a filter is applied.",
    },
  ],
  bullets: [
    "Filter chips don't differentiate between available and applied state — the only visual change is a background fill that fails the 3:1 contrast check in light mode",
    'The "Reset filters" button sits in the bottom-right corner, where most users scan for a confirm/apply action. It gets triggered accidentally when users try to confirm a filter set',
    'No loading state after a filter is applied — the table either refreshes instantly (dev environment) or takes 1–3 seconds (production). No skeleton, no spinner, no indication that something is happening',
  ],
  callout: {
    label: 'Recommended fix order',
    text: 'Fix the loading state first — it costs nothing in design effort and removes the most visible production bug. Then the Reset placement. Token contrast is a design system issue, not a one-off fix.',
  },
  working: "The filter chip labels are specific and scannable. The panel's visual weight doesn't compete with the table data. Dismissal on outside click is correctly implemented.",
}

export default function OutputPanel({ open, onClose, showToast }) {
  const copyText = [output.title, ...output.bullets, output.callout.text, output.working].join('\n\n')

  return (
    <div className={`panel${open ? ' open' : ''}`}>
      <div className="panel-handle" />
      <div className="panel-head">
        <div className="panel-icon">✦</div>
        <div className="panel-title">{output.title}</div>
        <div className="panel-sub">{output.skill} · {output.age}</div>
      </div>
      <div className="panel-body">
        {output.sections.map((s, i) => (
          <div key={i} className="out-section">
            <div className="out-section-label">{s.label}</div>
            <div className="out-section-body">{s.body}</div>
          </div>
        ))}
        <div className="out-section">
          <div className="out-section-label">Priority issues</div>
          <ul className="out-bullets">
            {output.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
        <div className="out-callout">
          <div className="out-callout-label">{output.callout.label}</div>
          <div className="out-callout-text">{output.callout.text}</div>
        </div>
        <div className="out-section" style={{ marginTop: 18 }}>
          <div className="out-section-label">What&apos;s working</div>
          <div className="out-section-body">{output.working}</div>
        </div>
      </div>
      <div className="panel-footer">
        <button className="btn btn-primary btn-full" onClick={() => { navigator.clipboard?.writeText(copyText); showToast('Copied ✓'); onClose() }}>
          Copy output
        </button>
        <button className="btn btn-secondary btn-full" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
