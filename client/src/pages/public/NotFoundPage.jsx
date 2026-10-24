import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center text-center" style={{ backgroundColor: '#f4f7fb' }}>
      <div>
        <div style={{ fontSize: 80, color: '#0f2044' }}>
          <i className="bi bi-exclamation-triangle"></i>
        </div>
        <h1 className="display-1 fw-bold" style={{ color: '#0f2044' }}>404</h1>
        <p className="lead text-muted mb-4">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary fw-semibold px-4" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }}>
          <i className="bi bi-house me-2"></i>Back to Home
        </Link>
      </div>
    </div>
  );
}
