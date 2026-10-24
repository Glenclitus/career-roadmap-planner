import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { difficultyBadgeColor, formatDate } from '../../utils/validators';

export default function RoadmapManagement() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState({ show: false, id: null });
  const [toast, setToast] = useState('');

  const categories = [
    'Software Development','Data Science','Data Analytics','Full-Stack Development',
    'Cybersecurity','Cloud Engineering','AI/ML','Other',
  ];

  const fetchRoadmaps = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (filterCat) params.category = filterCat;
      if (filterDiff) params.difficulty = filterDiff;
      const { data } = await api.get('/roadmaps', { params });
      setRoadmaps(data.roadmaps);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, filterCat, filterDiff]);

  useEffect(() => { fetchRoadmaps(); }, [fetchRoadmaps]);

  const handleDelete = async () => {
    try {
      await api.delete(`/roadmaps/${confirm.id}`);
      setToast('Roadmap deleted successfully.');
      setConfirm({ show: false, id: null });
      fetchRoadmaps();
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div>
      <ConfirmDialog
        show={confirm.show}
        title="Delete Roadmap"
        message="Are you sure you want to delete this roadmap? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ show: false, id: null })}
      />

      {toast && (
        <div className="alert alert-success alert-dismissible d-flex align-items-center gap-2 mb-3 py-2">
          <i className="bi bi-check-circle-fill"></i> {toast}
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#0f2044' }}>Career Roadmaps</h2>
          <p className="text-muted mb-0">Create and manage all career roadmaps.</p>
        </div>
        <Link to="/admin/roadmaps/new" className="btn btn-primary fw-semibold" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }}>
          <i className="bi bi-plus-circle me-2"></i>New Roadmap
        </Link>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: 12 }}>
        <div className="row g-2 align-items-end">
          <div className="col-md-5">
            <input className="form-control" placeholder="Search by title or description…" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}>
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className="form-select" value={filterDiff} onChange={(e) => { setFilterDiff(e.target.value); setPage(1); }}>
              <option value="">All Levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary w-100" onClick={() => { setSearch(''); setFilterCat(''); setFilterDiff(''); setPage(1); }}>
              <i className="bi bi-x-circle me-1"></i>Reset
            </button>
          </div>
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          {roadmaps.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-map fs-1 d-block mb-2"></i>
              No roadmaps found. <Link to="/admin/roadmaps/new">Create one.</Link>
            </div>
          ) : (
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th className="ps-4 py-3">Title</th>
                      <th>Category</th>
                      <th>Difficulty</th>
                      <th>Stages</th>
                      <th>Created</th>
                      <th className="pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roadmaps.map((r) => (
                      <tr key={r._id}>
                        <td className="ps-4">
                          <div className="fw-semibold" style={{ color: '#0f2044' }}>{r.title}</div>
                          <div className="text-muted small">{r.estimatedDuration}</div>
                        </td>
                        <td><span className="badge bg-light text-dark border">{r.category}</span></td>
                        <td><span className={`badge bg-${difficultyBadgeColor(r.difficulty)}`}>{r.difficulty}</span></td>
                        <td>{r.learningStages?.length}</td>
                        <td className="text-muted small">{formatDate(r.createdAt)}</td>
                        <td className="pe-4">
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => navigate(`/admin/roadmaps/edit/${r._id}`)}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirm({ show: true, id: r._id })}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <nav className="mt-3 d-flex justify-content-center">
              <ul className="pagination">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
