import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { calcProgress, difficultyBadgeColor } from '../../utils/validators';

export default function UserDashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progRes, roadRes] = await Promise.all([
          api.get('/progress'),
          api.get('/roadmaps', { params: { limit: 6 } }),
        ]);
        setProgress(progRes.data.progress);
        setRoadmaps(roadRes.data.roadmaps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const inProgress = progress.filter((p) => p.completedTaskIds.length > 0);

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: '#0f2044' }}>
          Welcome, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-muted mb-0">Continue your learning journey or explore new career paths.</p>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Paths in Progress', value: inProgress.length, icon: 'bi-play-circle-fill', color: '#3b82f6' },
          { label: 'Paths Available', value: roadmaps.length, icon: 'bi-map-fill', color: '#10b981' },
          { label: 'Completed Paths', value: progress.filter((p) => {
            const r = p.roadmapId;
            if (!r) return false;
            const total = r.learningStages?.reduce((s, st) => s + st.tasks.length, 0) || 0;
            return total > 0 && p.completedTaskIds.length >= total;
          }).length, icon: 'bi-trophy-fill', color: '#f59e0b' },
        ].map((s) => (
          <div key={s.label} className="col-md-4">
            <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3" style={{ borderRadius: 12 }}>
              <div className="rounded-2 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                style={{ width: 48, height: 48, backgroundColor: s.color, fontSize: 20 }}>
                <i className={`bi ${s.icon}`}></i>
              </div>
              <div>
                <div className="fs-3 fw-bold" style={{ color: '#0f2044' }}>{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* In-progress roadmaps */}
      {inProgress.length > 0 && (
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0" style={{ color: '#0f2044' }}>Continue Learning</h5>
            <Link to="/dashboard/progress" className="small text-decoration-none" style={{ color: '#0f2044' }}>View all →</Link>
          </div>
          <div className="row g-3">
            {inProgress.slice(0, 3).map((p) => {
              const r = p.roadmapId;
              if (!r) return null;
              const pct = calcProgress(p.completedTaskIds, r);
              return (
                <div key={p._id} className="col-md-4">
                  <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 12 }}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="fw-semibold small" style={{ color: '#0f2044' }}>{r.title}</span>
                      <span className={`badge bg-${difficultyBadgeColor(r.difficulty)}`}>{r.difficulty}</span>
                    </div>
                    <div className="progress mb-2" style={{ height: 8, borderRadius: 4 }}>
                      <div className="progress-bar" style={{ width: `${pct}%`, backgroundColor: '#0f2044' }}></div>
                    </div>
                    <div className="d-flex justify-content-between small text-muted">
                      <span>{pct}% complete</span>
                      <Link to={`/dashboard/roadmap/${r._id}`} className="text-decoration-none fw-semibold" style={{ color: '#0f2044' }}>Continue →</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured roadmaps */}
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#0f2044' }}>Explore Career Paths</h5>
          <Link to="/dashboard/explore" className="small text-decoration-none" style={{ color: '#0f2044' }}>View all →</Link>
        </div>
        <div className="row g-3">
          {roadmaps.slice(0, 3).map((r) => (
            <div key={r._id} className="col-md-4">
              <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 12 }}>
                <span className={`badge bg-${difficultyBadgeColor(r.difficulty)} mb-2 align-self-start`}>{r.difficulty}</span>
                <h6 className="fw-bold" style={{ color: '#0f2044' }}>{r.title}</h6>
                <p className="text-muted small mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {r.description}
                </p>
                <Link to={`/dashboard/roadmap/${r._id}`} className="btn btn-sm btn-outline-primary fw-semibold"
                  style={{ borderColor: '#0f2044', color: '#0f2044' }}>
                  View Roadmap
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
