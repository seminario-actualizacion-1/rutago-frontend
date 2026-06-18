import './Button.css';

export default function Button({ children, onClick, type = 'button', variant = 'primary', fullWidth = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
    >
      {children}
    </button>
  );
}
