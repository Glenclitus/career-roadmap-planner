import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import { formatDate } from '../../utils/validators';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/activity'),
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  const statCards = [
    { label: 'Total Users', value: stats?.stats?.totalUsers ?? 0, icon: 'bi-people-fill', color: '#3b82f6' },
    { label: 'Career Roadmaps', value: stats?.stats?.totalRoadmaps ?? 0, icon: 'bi-map-fill', color: '#10b981' },
    { label: 'Progress Records', value: stats?.stats?.totalProgressRecords ?? 0, icon: 'bi-bar-chart-fill', color: '#8b5cf6' },
  ];

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#0f2044' }}>
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-muted mb-0">Here's an overview of CareerPath.</p>
        </div>
        <Link to="/admin/roadmaps/new" className="btn btn-primary fw-semibold" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }}>
          <i className="bi bi-plus-circle me-2"></i>New Roadmap
        </Link>
      </div>

      {/* Stat cards */}
      <div className="row g-4 mb-4">
        {statCards.map((s) => (
          <div key={s.label} className="col-md-4">
            <div className="card border-0 shadow-sm p-3 p-sm-4 d-flex flex-row align-items-center gap-3" style={{ borderRadius: 12 }}>
              <div className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                style={{ width: 56, height: 56, backgroundColor: s.color, fontSize: 24 }}>
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

      <div className="row g-4">
        {/* Recent roadmaps */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0f2044' }}>Recent Roadmaps</h5>
                <Link to="/admin/roadmaps" className="small text-decoration-none" style={{ color: '#0f2044' }}>View all</Link>
              </div>
              {stats?.recentRoadmaps?.length === 0 ? (
                <p className="text-muted small">No roadmaps yet.</p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {stats?.recentRoadmaps?.map((r) => (
                    <li key={r._id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                      <div>
                        <div className="fw-semibold small" style={{ color: '#0f2044' }}>{r.title}</div>
                        <div className="text-muted" style={{ fontSize: 12 }}>{r.category}</div>
                      </div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{formatDate(r.createdAt)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Recent users */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0f2044' }}>Recent Users</h5>
                <Link to="/admin/users" className="small text-decoration-none" style={{ color: '#0f2044' }}>View all</Link>
              </div>
              {activity?.recentUsers?.length === 0 ? (
                <p className="text-muted small">No users yet.</p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {activity?.recentUsers?.map((u) => (
                    <li key={u._id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                      <div className="rounded-circle bg-info d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                        style={{ width: 32, height: 32, fontSize: 13, color: '#0f2044' }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold small" style={{ color: '#0f2044' }}>{u.name}</div>
                        <div className="text-muted" style={{ fontSize: 12 }}>{u.email}</div>
                      </div>
                      <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{u.role}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="row g-3 mt-2">
        <div className="col-12">
          <h5 className="fw-bold mb-3" style={{ color: '#0f2044' }}>Quick Actions</h5>
        </div>
        {[
          { to: '/admin/roadmaps/new', icon: 'bi-plus-circle', label: 'Create Roadmap' },
          { to: '/admin/users', icon: 'bi-people', label: 'Manage Users' },
          { to: '/admin/roadmaps', icon: 'bi-map', label: 'All Roadmaps' },
          { to: '/admin/change-password', icon: 'bi-key', label: 'Change Password' },
        ].map((link) => (
          <div key={link.to} className="col-6 col-md-3">
            <Link to={link.to} className="card border-0 shadow-sm text-center p-3 text-decoration-none" style={{ borderRadius: 12, color: '#0f2044', display: 'block' }}>
              <i className={`bi ${link.icon} fs-4 d-block mb-1`}></i>
              <small className="fw-semibold">{link.label}</small>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
