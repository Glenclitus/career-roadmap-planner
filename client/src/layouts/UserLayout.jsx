import { Outlet } from 'react-router-dom';
import UserSidebar from '../components/layout/UserSidebar';

export default function UserLayout() {
  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f7fb' }}>
      <UserSidebar />
      <main className="flex-grow-1 p-4" style={{ overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
}
