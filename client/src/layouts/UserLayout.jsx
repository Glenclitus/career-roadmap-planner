import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/layout/UserSidebar';

export default function UserLayout() {
  return (
    <div className="d-flex flex-column flex-lg-row" style={{ minHeight: '100vh', backgroundColor: '#f4f7fb' }}>
      <UserSidebar />
      <main className="flex-grow-1 p-3 p-md-4" style={{ minWidth: 0, overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}
