export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg,#08863A,#FDC202)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="7" width="16" height="10" rx="2" fill="#fff" />
          <rect x="6" y="9" width="4" height="3" fill="#08863A" />
          <rect x="14" y="9" width="4" height="3" fill="#FDC202" />
          <rect x="5" y="14" width="3" height="2" fill="#fff" />
          <rect x="16" y="14" width="3" height="2" fill="#fff" />
          <rect x="6" y="17" width="3" height="2" fill="#333" />
          <rect x="15" y="17" width="3" height="2" fill="#333" />
        </svg>
      </div>
      <span
        style={{
          fontSize: '1.35rem',
          fontWeight: 700,
          color: '#08863A',
          letterSpacing: '-0.3px',
        }}
      >
        Ruta<span style={{ color: '#FDC202' }}>Go</span>
      </span>
    </div>
  );
}
