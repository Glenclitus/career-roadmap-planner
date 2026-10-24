import { Link } from 'react-router-dom';
import { difficultyBadgeColor } from '../../utils/validators';

export default function RoadmapCard({ roadmap }) {
  const categoryIcons = {
    'Software Development': 'bi-code-slash',
    'Data Science': 'bi-graph-up',
    'Data Analytics': 'bi-bar-chart',
    'Full-Stack Development': 'bi-layers',
    'Cybersecurity': 'bi-shield-lock',
    'Cloud Engineering': 'bi-cloud',
    'AI/ML': 'bi-robot',
    'Other': 'bi-briefcase',
  };

  const icon = categoryIcons[roadmap.category] || 'bi-briefcase';

  return (
    <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '12px', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
    >
      <div className="card-body d-flex flex-column p-4">
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white"
            style={{ width: 48, height: 48, backgroundColor: '#0f2044', fontSize: 20 }}
          >
            <i className={`bi ${icon}`}></i>
          </div>
          <span className={`badge bg-${difficultyBadgeColor(roadmap.difficulty)}`}>
            {roadmap.difficulty}
          </span>
        </div>

        <h5 className="card-title fw-bold mb-1" style={{ color: '#0f2044' }}>{roadmap.title}</h5>
        <p className="text-muted small mb-2">{roadmap.category}</p>
        <p className="card-text text-muted small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {roadmap.description}
        </p>

        <div className="mt-3 d-flex align-items-center justify-content-between small text-muted">
          <span><i className="bi bi-clock me-1"></i>{roadmap.estimatedDuration}</span>
          <span><i className="bi bi-layers me-1"></i>{roadmap.learningStages?.length || 0} stages</span>
        </div>

        <Link
          to={`/dashboard/roadmap/${roadmap._id}`}
          className="btn btn-outline-primary btn-sm mt-3 fw-semibold"
          style={{ borderColor: '#0f2044', color: '#0f2044' }}
        >
          View Roadmap <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
    </div>
  );
}
