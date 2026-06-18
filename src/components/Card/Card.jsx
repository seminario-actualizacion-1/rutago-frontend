import './Card.css';

export default function Card({ children, title }) {
  return (
    <div className="card">
      {title && <h2 className="card-title">{title}</h2>}
      {children}
    </div>
  );
}
