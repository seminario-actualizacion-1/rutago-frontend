import logo from '../../assets/RutaGo.png';

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img
        src={logo}
        alt="RutaGo"
        style={{ height: 36, display: 'block' }}
      />
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