const icons = {
  home: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M8 20v-8h6v8" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>,
  tools: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="13" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="3" y="13" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="13" y="13" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.7"/></svg>,
  capture: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.7"/><path d="M11 7v8M7 11h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  posts: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 17.5V14l9.5-9.5a2 2 0 012.83 0l1.17 1.17a2 2 0 010 2.83L8 18H4z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M12.5 5.5l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  library: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="15" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.7"/><rect x="3" y="9" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.7"/><rect x="3" y="3" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.7"/></svg>,
}

const labels = { home: 'Home', tools: 'Tools', capture: 'Capture', posts: 'Posts', library: 'Library' }

export default function BottomNav({ active, onSwitch }) {
  return (
    <nav className="bottom-nav">
      {Object.keys(icons).map(tab => (
        <button
          key={tab}
          className={`nav-item${active === tab ? ' active' : ''}`}
          onClick={() => onSwitch(tab)}
        >
          <div className="nav-icon">{icons[tab]}</div>
          {labels[tab]}
        </button>
      ))}
    </nav>
  )
}
