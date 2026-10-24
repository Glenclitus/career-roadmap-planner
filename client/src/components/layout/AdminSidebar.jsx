import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: 'bi-speedometer2', end: true },
    { to: '/admin/roadmaps', label: 'Career Roadmaps', icon: 'bi-map' },
    { to: '/admin/users', label: 'User Management', icon: 'bi-people' },
    { to: '/admin/change-password', label: 'Change Password', icon: 'bi-key' },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="d-none d-lg-flex flex-column p-3 text-white"
        style={{ width: '240px', minHeight: '100vh', backgroundColor: '#0f2044', position: 'sticky', top: 0 }}
      >
        <div className="mb-4 mt-2">
          <span className="fs-5 fw-bold">
            <i className="bi bi-map me-2 text-info"></i>CareerPath
          </span>
          <div className="small text-info mt-1">Admin Panel</div>
        </div>

        <div className="mb-4 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-info d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 36, height: 36, fontSize: 14 }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="fw-semibold small">{user?.name}</div>
              <div className="text-info" style={{ fontSize: 11 }}>Administrator</div>
            </div>
          </div>
        </div>

        <nav className="nav flex-column gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 rounded px-3 py-2 ${
                  isActive ? 'bg-info text-dark fw-semibold' : 'text-white-50 hover-nav'
                }`
              }
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <button
            className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>

      {/* Mobile top bar */}
      <nav className="navbar navbar-dark d-lg-none" style={{ backgroundColor: '#0f2044' }}>
        <div className="container-fluid">
          <span className="navbar-brand fw-bold">
            <i className="bi bi-map me-2 text-info"></i>CareerPath Admin
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminMobileNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="adminMobileNav">
            <ul className="navbar-nav mt-2">
              {navItems.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `nav-link ${isActive ? 'text-info fw-bold' : 'text-white-50'}`}
                  >
                    <i className={`bi ${item.icon} me-2`}></i>{item.label}
                  </NavLink>
                </li>
              ))}
              <li className="nav-item mt-2">
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
