import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import RoadmapCard from '../../components/roadmap/RoadmapCard';

const CATEGORIES = ['Software Development','Data Science','Data Analytics','Full-Stack Development','Cybersecurity','Cloud Engineering','AI/ML','Other'];

export default function ExploreCareers() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const fetchRoadmaps = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
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

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: '#0f2044' }}>Explore Career Paths</h2>
        <p className="text-muted mb-0">Browse all available career roadmaps and start learning.</p>
      </div>

      <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: 12 }}>
        <div className="row g-2 align-items-end">
          <div className="col-md-5">
            <input className="form-control" placeholder="Search career paths…" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="col-md-3">
            <select className="form-select" value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
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
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          {roadmaps.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-search fs-1 d-block mb-2"></i>
              No roadmaps found. Try a different search.
            </div>
          ) : (
            <>
              <p className="text-muted mb-3 small">{pagination.total} roadmap{pagination.total !== 1 ? 's' : ''} found</p>
              <div className="row g-4">
                {roadmaps.map((r) => (
                  <div key={r._id} className="col-md-6 col-lg-4">
                    <RoadmapCard roadmap={r} />
                  </div>
                ))}
              </div>
            </>
          )}

          {pagination.pages > 1 && (
            <nav className="mt-4 d-flex justify-content-center">
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
