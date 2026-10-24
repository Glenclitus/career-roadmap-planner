import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';

export default function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <Outlet />
      <footer className="text-center py-4 mt-5" style={{ backgroundColor: '#0f2044', color: '#8ba0c0' }}>
        <div className="container">
          <p className="mb-1">
            <i className="bi bi-map me-2 text-info"></i>
            <strong className="text-white">CareerPath</strong> — Career Roadmap Planner
          </p>
          <p className="small mb-0">
            Web Technology IA3 Project · 23CS2048 · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}
