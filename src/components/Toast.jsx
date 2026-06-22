export default function Toast({ msg, show }) {
  return (
    <div style={{
      position: 'fixed', bottom: 'calc(var(--nav-h) + 16px)', left: '50%',
      transform: `translateX(-50%) translateY(${show ? '0' : '12px'})`,
      background: 'var(--text-1)', color: 'white', padding: '10px 20px',
      borderRadius: '100px', fontSize: '13px', fontWeight: 600,
      opacity: show ? 1 : 0, transition: 'all 0.22s', zIndex: 400,
      whiteSpace: 'nowrap', pointerEvents: 'none',
    }}>
      {msg}
    </div>
  )
}
