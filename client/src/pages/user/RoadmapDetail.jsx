import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { difficultyBadgeColor, calcProgress } from '../../utils/validators';

export default function RoadmapDetail() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState({ completedTaskIds: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rmRes, progRes] = await Promise.all([
          api.get(`/roadmaps/${id}`),
          api.get(`/progress/${id}`),
        ]);
        setRoadmap(rmRes.data.roadmap);
        setProgress(progRes.data.progress || { completedTaskIds: [] });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleTask = async (taskId) => {
    const current = progress.completedTaskIds || [];
    const next = current.includes(taskId)
      ? current.filter((t) => t !== taskId)
      : [...current, taskId];

    setProgress({ ...progress, completedTaskIds: next });
    setSaving(true);
    try {
      const { data } = await api.put(`/progress/${id}`, { completedTaskIds: next });
      setProgress(data.progress);
      setToast('Progress saved!');
      setTimeout(() => setToast(''), 2000);
    } catch {
      setProgress({ ...progress, completedTaskIds: current }); // rollback
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!roadmap) return <div className="text-center py-5 text-danger">Roadmap not found.</div>;

  const pct = calcProgress(progress.completedTaskIds, roadmap);

  return (
    <div>
      {toast && (
        <div className="alert alert-success py-2 d-flex align-items-center gap-2 mb-3" style={{ position: 'sticky', top: 16, zIndex: 100 }}>
          <i className="bi bi-check-circle-fill"></i> {toast} {saving && <span className="spinner-border spinner-border-sm ms-2"></span>}
        </div>
      )}

      {/* Header */}
      <div className="card border-0 shadow-sm p-3 p-sm-4 mb-4" style={{ borderRadius: 12, backgroundColor: '#0f2044', color: 'white' }}>
        <div className="d-flex flex-wrap align-items-start justify-content-between gap-3">
          <div>
            <div className="d-flex gap-2 mb-2">
              <span className={`badge bg-${difficultyBadgeColor(roadmap.difficulty)}`}>{roadmap.difficulty}</span>
              <span className="badge bg-light text-dark">{roadmap.category}</span>
            </div>
            <h2 className="fw-bold mb-1">{roadmap.title}</h2>
            <p className="text-white-50 mb-0">{roadmap.description}</p>
          </div>
          <div className="text-end">
            <div className="small text-white-50 mb-1"><i className="bi bi-clock me-1"></i>{roadmap.estimatedDuration}</div>
            <div className="small text-white-50"><i className="bi bi-layers me-1"></i>{roadmap.learningStages?.length} stages</div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-4">
          <div className="d-flex justify-content-between small mb-1">
            <span>Your Progress</span>
            <span className="fw-semibold">{pct}%</span>
          </div>
          <div className="progress" style={{ height: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5 }}>
            <div className="progress-bar" style={{ width: `${pct}%`, backgroundColor: '#22d3ee' }}></div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Stages */}
        <div className="col-lg-8">
          <h5 className="fw-bold mb-3" style={{ color: '#0f2044' }}>Learning Stages</h5>
          {roadmap.learningStages?.sort((a, b) => a.order - b.order).map((stage, si) => {
            const stageTasks = stage.tasks || [];
            const completed = stageTasks.filter((t) => progress.completedTaskIds?.includes(t._id));
            const stagePct = stageTasks.length ? Math.round((completed.length / stageTasks.length) * 100) : 0;

            return (
              <div key={stage._id || si} className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12 }}>
                <div className="card-body p-3 p-sm-4">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                      style={{ width: 36, height: 36, backgroundColor: '#0f2044', fontSize: 14 }}>
                      {si + 1}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-0" style={{ color: '#0f2044' }}>{stage.title}</h6>
                      <small className="text-muted">{completed.length}/{stageTasks.length} tasks done</small>
                    </div>
                    <span className="fw-semibold small" style={{ color: stagePct === 100 ? '#10b981' : '#64748b' }}>
                      {stagePct === 100 ? <><i className="bi bi-check-circle-fill text-success me-1"></i>Done</> : `${stagePct}%`}
                    </span>
                  </div>

                  {stage.description && <p className="text-muted small mb-3">{stage.description}</p>}

                  {/* Progress bar for stage */}
                  <div className="progress mb-3" style={{ height: 6, borderRadius: 3 }}>
                    <div className="progress-bar" style={{ width: `${stagePct}%`, backgroundColor: '#0f2044' }}></div>
                  </div>

                  {/* Tasks */}
                  {stageTasks.map((task) => {
                    const done = progress.completedTaskIds?.includes(task._id);
                    return (
                      <div key={task._id} className="d-flex align-items-start gap-3 py-2 border-bottom">
                        <div>
                          <input type="checkbox" id={`task-${task._id}`} className="form-check-input"
                            checked={done} onChange={() => toggleTask(task._id)}
                            style={{ width: 18, height: 18, marginTop: 2, cursor: 'pointer', accentColor: '#0f2044' }} />
                        </div>
                        <label htmlFor={`task-${task._id}`} className="mb-0" style={{ cursor: 'pointer' }}>
                          <div className={`fw-semibold small ${done ? 'text-decoration-line-through text-muted' : ''}`} style={{ color: '#0f2044' }}>
                            {task.title}
                          </div>
                          {task.description && <div className="text-muted" style={{ fontSize: 12 }}>{task.description}</div>}
                        </label>
                      </div>
                    );
                  })}

                  {/* Resources */}
                  {stage.resources?.length > 0 && (
                    <div className="mt-3">
                      <small className="fw-semibold text-muted d-block mb-2"><i className="bi bi-book me-1"></i>Resources</small>
                      {stage.resources.map((res, ri) => (
                        <a key={ri} href={res.url} target="_blank" rel="noopener noreferrer"
                          className="d-flex align-items-center gap-2 mb-1 text-decoration-none small text-primary">
                          <i className="bi bi-box-arrow-up-right"></i>{res.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar info */}
        <div className="col-lg-4">
          {roadmap.skills?.length > 0 && (
            <div className="card border-0 shadow-sm p-3 mb-3" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-2" style={{ color: '#0f2044' }}><i className="bi bi-gear me-2"></i>Skills You'll Gain</h6>
              <div className="d-flex flex-wrap gap-1">
                {roadmap.skills.map((s) => (
                  <span key={s} className="badge bg-light text-dark border">{s}</span>
                ))}
              </div>
            </div>
          )}

          {roadmap.prerequisites?.length > 0 && (
            <div className="card border-0 shadow-sm p-3 mb-3" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-2" style={{ color: '#0f2044' }}><i className="bi bi-check2-square me-2"></i>Prerequisites</h6>
              <ul className="mb-0 text-muted small ps-3">
                {roadmap.prerequisites.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          )}

          {roadmap.projectSuggestions?.length > 0 && (
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: 12 }}>
              <h6 className="fw-bold mb-2" style={{ color: '#0f2044' }}><i className="bi bi-lightbulb me-2"></i>Project Ideas</h6>
              <ul className="mb-0 text-muted small ps-3">
                {roadmap.projectSuggestions.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
