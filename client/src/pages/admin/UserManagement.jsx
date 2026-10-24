import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate } from '../../utils/validators';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState({ show: false, id: null });
  const [editUser, setEditUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const [formError, setFormError] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'success' }), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      const { data } = await api.get('/users', { params });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${confirm.id}`);
      showToast('User deleted.');
      setConfirm({ show: false, id: null });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/users', newUserForm);
      showToast('User created.');
      setShowAddModal(false);
      setNewUserForm({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Create failed.');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.put(`/users/${editUser._id}`, editForm);
      showToast('User updated.');
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div>
      <ConfirmDialog
        show={confirm.show}
        title="Delete User"
        message="This will permanently delete the user. Continue?"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ show: false, id: null })}
      />

      {toast.show && (
        <div className={`alert alert-${toast.type} d-flex align-items-center gap-2 mb-3 py-2`}>
          <i className="bi bi-check-circle-fill"></i> {toast.msg}
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: '#0f2044' }}>User Management</h2>
          <p className="text-muted mb-0">Manage registered users and their roles.</p>
        </div>
        <button className="btn btn-primary fw-semibold" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }}
          onClick={() => { setShowAddModal(true); setFormError(''); }}>
          <i className="bi bi-person-plus me-2"></i>Add User
        </button>
      </div>

      <div className="card border-0 shadow-sm p-3 mb-4" style={{ borderRadius: 12 }}>
        <input className="form-control" placeholder="Search by name or email…"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
      </div>

      {loading ? <Loader /> : (
        <>
          {users.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-people fs-1 d-block mb-2"></i>No users found.
            </div>
          ) : (
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th className="ps-4 py-3">User</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th className="pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle bg-info d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                              style={{ width: 36, height: 36, fontSize: 14, color: '#0f2044' }}>
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold" style={{ color: '#0f2044' }}>{u.name}</div>
                              <div className="text-muted small">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{u.role}</span>
                        </td>
                        <td className="text-muted small">{formatDate(u.createdAt)}</td>
                        <td className="pe-4">
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary"
                              onClick={() => { setEditUser(u); setEditForm({ name: u.name, email: u.email, role: u.role }); setFormError(''); }}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger"
                              onClick={() => setConfirm({ show: true, id: u._id })}>
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Add New User</h5>
                <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddUser}>
                <div className="modal-body">
                  {formError && <div className="alert alert-danger py-2 small">{formError}</div>}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input className="form-control" required value={newUserForm.name} onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input className="form-control" type="email" required value={newUserForm.email} onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input className="form-control" type="password" required value={newUserForm.password} onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Role</label>
                    <select className="form-select" value={newUserForm.role} onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }}>Create User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Edit User</h5>
                <button className="btn-close" onClick={() => setEditUser(null)}></button>
              </div>
              <form onSubmit={handleEditUser}>
                <div className="modal-body">
                  {formError && <div className="alert alert-danger py-2 small">{formError}</div>}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input className="form-control" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input className="form-control" type="email" required value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Role</label>
                    <select className="form-select" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditUser(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
