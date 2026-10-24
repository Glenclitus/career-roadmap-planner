import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f7fb' }}>
      <AdminSidebar />
      <main className="flex-grow-1 p-4" style={{ overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}
