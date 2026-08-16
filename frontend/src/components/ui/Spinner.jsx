// src/components/ui/Spinner.jsx

export default function Spinner({ size = 'default', text = '' }) {
  return (
    <div className="loading-center">
      <div className={`spinner ${size === 'sm' ? 'spinner--sm' : size === 'lg' ? 'spinner--lg' : ''}`} />
      {text && <p>{text}</p>}
    </div>
  );
}
