export default function Loader({ text = 'Loading…' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border text-info mb-3" style={{ width: '2.5rem', height: '2.5rem' }} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      <p className="text-muted">{text}</p>
    </div>
  );
}
