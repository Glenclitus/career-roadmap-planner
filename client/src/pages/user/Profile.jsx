import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setSuccess('');
    setServerError('');
    try {
      const { data } = await api.put(`/users/${user.id}`, { name: form.name, email: form.email });
      updateUser({ ...user, name: data.user.name, email: data.user.email });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: '#0f2044' }}>My Profile</h2>
        <p className="text-muted mb-0">Update your personal information.</p>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: 12 }}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="rounded-circle bg-info d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 64, height: 64, fontSize: 28, color: '#0f2044' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h5 className="fw-bold mb-0" style={{ color: '#0f2044' }}>{user?.name}</h5>
                <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>{user?.role}</span>
              </div>
            </div>

            {success && <div className="alert alert-success py-2 mb-3"><i className="bi bi-check-circle me-2"></i>{success}</div>}
            {serverError && <div className="alert alert-danger py-2 mb-3"><i className="bi bi-exclamation-circle me-2"></i>{serverError}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Email Address</label>
                <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <button type="submit" className="btn btn-primary fw-semibold w-100" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }} disabled={saving}>
                {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
