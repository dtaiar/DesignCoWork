export default function Header({ project }) {
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-title">Design Companion</div>
        <div className="header-sub" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {project ? (
            <>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--accent)', display: 'inline-block', flexShrink: 0,
              }} />
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{project.name}</span>
              <span style={{ color: 'var(--text-3)' }}>· {date}</span>
            </>
          ) : (
            <span>{date}</span>
          )}
        </div>
      </div>
      <button className="header-btn" aria-label="Settings">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="2" fill="currentColor"/>
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </header>
  )
}
