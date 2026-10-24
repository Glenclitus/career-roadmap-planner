import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const CATEGORIES = [
  'Software Development','Data Science','Data Analytics','Full-Stack Development',
  'Cybersecurity','Cloud Engineering','AI/ML','Other',
];
const DIFFICULTIES = ['Beginner','Intermediate','Advanced'];

const emptyStage = () => ({
  title: '', description: '', order: 1,
  tasks: [{ title: '', description: '' }],
  resources: [{ title: '', url: '' }],
});

export default function RoadmapForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '', description: '', category: '', difficulty: '',
    estimatedDuration: '', prerequisites: '', skills: '',
    projectSuggestions: '', learningStages: [emptyStage()],
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/roadmaps/${id}`).then(({ data }) => {
      const r = data.roadmap;
      setForm({
        title: r.title || '',
        description: r.description || '',
        category: r.category || '',
        difficulty: r.difficulty || '',
        estimatedDuration: r.estimatedDuration || '',
        prerequisites: (r.prerequisites || []).join(', '),
        skills: (r.skills || []).join(', '),
        projectSuggestions: (r.projectSuggestions || []).join(', '),
        learningStages: r.learningStages?.length ? r.learningStages : [emptyStage()],
      });
    }).catch(() => setError('Failed to load roadmap.')).finally(() => setLoading(false));
  }, [id, isEdit]);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Stage helpers
  const setStage = (si, key, val) => {
    const stages = [...form.learningStages];
    stages[si] = { ...stages[si], [key]: val };
    setField('learningStages', stages);
  };
  const addStage = () => setField('learningStages', [...form.learningStages, { ...emptyStage(), order: form.learningStages.length + 1 }]);
  const removeStage = (si) => setField('learningStages', form.learningStages.filter((_, i) => i !== si));

  // Task helpers
  const setTask = (si, ti, key, val) => {
    const stages = [...form.learningStages];
    const tasks = [...stages[si].tasks];
    tasks[ti] = { ...tasks[ti], [key]: val };
    stages[si] = { ...stages[si], tasks };
    setField('learningStages', stages);
  };
  const addTask = (si) => {
    const stages = [...form.learningStages];
    stages[si].tasks = [...stages[si].tasks, { title: '', description: '' }];
    setField('learningStages', stages);
  };
  const removeTask = (si, ti) => {
    const stages = [...form.learningStages];
    stages[si].tasks = stages[si].tasks.filter((_, i) => i !== ti);
    setField('learningStages', stages);
  };

  // Resource helpers
  const setResource = (si, ri, key, val) => {
    const stages = [...form.learningStages];
    const resources = [...stages[si].resources];
    resources[ri] = { ...resources[ri], [key]: val };
    stages[si] = { ...stages[si], resources };
    setField('learningStages', stages);
  };
  const addResource = (si) => {
    const stages = [...form.learningStages];
    stages[si].resources = [...stages[si].resources, { title: '', url: '' }];
    setField('learningStages', stages);
  };
  const removeResource = (si, ri) => {
    const stages = [...form.learningStages];
    stages[si].resources = stages[si].resources.filter((_, i) => i !== ri);
    setField('learningStages', stages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.category || !form.difficulty || !form.estimatedDuration) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        prerequisites: form.prerequisites.split(',').map((s) => s.trim()).filter(Boolean),
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        projectSuggestions: form.projectSuggestions.split(',').map((s) => s.trim()).filter(Boolean),
        learningStages: form.learningStages.map((st, i) => ({ ...st, order: i + 1 })),
      };

      if (isEdit) {
        await api.put(`/roadmaps/${id}`, payload);
      } else {
        await api.post('/roadmaps', payload);
      }
      navigate('/admin/roadmaps');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: '#0f2044' }}>{isEdit ? 'Edit Roadmap' : 'Create Roadmap'}</h2>
        <p className="text-muted mb-0">{isEdit ? 'Update roadmap details below.' : 'Fill in the details to create a new career roadmap.'}</p>
      </div>

      {error && <div className="alert alert-danger py-2"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
          <h5 className="fw-bold mb-3" style={{ color: '#0f2044' }}>Basic Information</h5>
          <div className="row g-3">
            <div className="col-md-8">
              <label className="form-label fw-semibold">Title *</label>
              <input className="form-control" value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="e.g. Software Developer" />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Estimated Duration *</label>
              <input className="form-control" value={form.estimatedDuration} onChange={(e) => setField('estimatedDuration', e.target.value)} placeholder="e.g. 6 months" />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Description *</label>
              <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="What will learners achieve?" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category *</label>
              <select className="form-select" value={form.category} onChange={(e) => setField('category', e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Difficulty *</label>
              <select className="form-select" value={form.difficulty} onChange={(e) => setField('difficulty', e.target.value)}>
                <option value="">Select difficulty</option>
                {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Prerequisites <small className="text-muted">(comma-separated)</small></label>
              <input className="form-control" value={form.prerequisites} onChange={(e) => setField('prerequisites', e.target.value)} placeholder="e.g. Basic Python, High-school math" />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Skills <small className="text-muted">(comma-separated)</small></label>
              <input className="form-control" value={form.skills} onChange={(e) => setField('skills', e.target.value)} placeholder="e.g. Python, SQL, Git" />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Project Suggestions <small className="text-muted">(comma-separated)</small></label>
              <input className="form-control" value={form.projectSuggestions} onChange={(e) => setField('projectSuggestions', e.target.value)} placeholder="e.g. Build a to-do app, Create a weather dashboard" />
            </div>
          </div>
        </div>

        {/* Learning Stages */}
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: 12 }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold mb-0" style={{ color: '#0f2044' }}>Learning Stages</h5>
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addStage}>
              <i className="bi bi-plus-circle me-1"></i>Add Stage
            </button>
          </div>

          {form.learningStages.map((stage, si) => (
            <div key={si} className="border rounded-3 p-3 mb-3" style={{ backgroundColor: '#fafbfc' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="fw-bold mb-0" style={{ color: '#0f2044' }}>Stage {si + 1}</h6>
                {form.learningStages.length > 1 && (
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeStage(si)}>
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>

              <div className="row g-2 mb-2">
                <div className="col-md-6">
                  <input className="form-control form-control-sm" placeholder="Stage title *" value={stage.title} onChange={(e) => setStage(si, 'title', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <input className="form-control form-control-sm" placeholder="Description" value={stage.description} onChange={(e) => setStage(si, 'description', e.target.value)} />
                </div>
              </div>

              {/* Tasks */}
              <div className="mb-2">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <small className="fw-semibold text-muted">Tasks</small>
                  <button type="button" className="btn btn-sm btn-link p-0" style={{ fontSize: 12 }} onClick={() => addTask(si)}>+ Add Task</button>
                </div>
                {stage.tasks.map((task, ti) => (
                  <div key={ti} className="d-flex gap-2 mb-1">
                    <input className="form-control form-control-sm" placeholder="Task title *" value={task.title} onChange={(e) => setTask(si, ti, 'title', e.target.value)} />
                    <input className="form-control form-control-sm" placeholder="Description" value={task.description} onChange={(e) => setTask(si, ti, 'description', e.target.value)} />
                    {stage.tasks.length > 1 && (
                      <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0" onClick={() => removeTask(si, ti)}>
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Resources */}
              <div>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <small className="fw-semibold text-muted">Resources</small>
                  <button type="button" className="btn btn-sm btn-link p-0" style={{ fontSize: 12 }} onClick={() => addResource(si)}>+ Add Resource</button>
                </div>
                {stage.resources.map((res, ri) => (
                  <div key={ri} className="d-flex gap-2 mb-1">
                    <input className="form-control form-control-sm" placeholder="Resource title" value={res.title} onChange={(e) => setResource(si, ri, 'title', e.target.value)} />
                    <input className="form-control form-control-sm" placeholder="URL" value={res.url} onChange={(e) => setResource(si, ri, 'url', e.target.value)} />
                    {stage.resources.length > 0 && (
                      <button type="button" className="btn btn-sm btn-outline-danger flex-shrink-0" onClick={() => removeResource(si, ri)}>
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex gap-3">
          <button type="submit" className="btn btn-primary fw-semibold px-4" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }} disabled={saving}>
            {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</> : (isEdit ? 'Update Roadmap' : 'Create Roadmap')}
          </button>
          <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate('/admin/roadmaps')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
