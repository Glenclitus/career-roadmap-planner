import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { calcProgress, difficultyBadgeColor } from '../../utils/validators';

export default function MyProgress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/progress')
      .then(({ data }) => setProgress(data.progress))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const withRoadmap = progress.filter((p) => p.roadmapId);

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: '#0f2044' }}>My Learning Progress</h2>
        <p className="text-muted mb-0">Track your completion across all career roadmaps.</p>
      </div>

      {withRoadmap.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-bar-chart fs-1 d-block mb-2"></i>
          <p>You haven't started any roadmaps yet.</p>
          <Link to="/dashboard/explore" className="btn btn-primary" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }}>
            Explore Careers
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {withRoadmap.map((p) => {
            const r = p.roadmapId;
            const pct = calcProgress(p.completedTaskIds, r);
            const totalTasks = r.learningStages?.reduce((s, st) => s + st.tasks.length, 0) || 0;

            return (
              <div key={p._id} className="col-md-6">
                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
                  <div className="d-flex align-items-start justify-content-between mb-2">
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: '#0f2044' }}>{r.title}</h5>
                      <div className="d-flex gap-2">
                        <span className={`badge bg-${difficultyBadgeColor(r.difficulty)}`}>{r.difficulty}</span>
                        <span className="badge bg-light text-dark border">{r.category}</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold fs-4" style={{ color: pct === 100 ? '#10b981' : '#0f2044' }}>{pct}%</div>
                      <div className="small text-muted">{p.completedTaskIds.length}/{totalTasks} tasks</div>
                    </div>
                  </div>

                  <div className="progress my-3" style={{ height: 10, borderRadius: 5 }}>
                    <div
                      className="progress-bar"
                      style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#10b981' : '#0f2044', transition: 'width 0.6s' }}
                    ></div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between">
                    {pct === 100 ? (
                      <span className="text-success fw-semibold small"><i className="bi bi-trophy-fill me-1"></i>Completed!</span>
                    ) : (
                      <span className="text-muted small"><i className="bi bi-clock me-1"></i>In Progress</span>
                    )}
                    <Link to={`/dashboard/roadmap/${r._id}`} className="btn btn-sm btn-outline-primary fw-semibold"
                      style={{ borderColor: '#0f2044', color: '#0f2044' }}>
                      {pct === 100 ? 'Review' : 'Continue'} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
