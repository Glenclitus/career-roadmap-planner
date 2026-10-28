import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { validatePassword } from '../../utils/validators';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    const pwErrs = validatePassword(form.newPassword);
    if (pwErrs.length > 0) e.newPassword = pwErrs.join(', ');
    if (form.newPassword !== form.confirmNewPassword) e.confirmNewPassword = 'Passwords do not match';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await api.patch('/auth/change-password', form);
      setSuccess(data.message);
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      // Token is cleared server-side; redirect to login after 2s
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: '#0f2044' }}>Change Password</h2>
        <p className="text-muted mb-0">Update your account password below.</p>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-3 p-sm-4" style={{ borderRadius: 12 }}>
            {serverError && (
              <div className="alert alert-danger py-2"><i className="bi bi-exclamation-circle me-2"></i>{serverError}</div>
            )}
            {success && (
              <div className="alert alert-success py-2"><i className="bi bi-check-circle me-2"></i>{success} Redirecting…</div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold">Current Password</label>
                <input type="password" name="currentPassword" className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                  value={form.currentPassword} onChange={handleChange} />
                {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">New Password</label>
                <input type="password" name="newPassword" className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                  value={form.newPassword} onChange={handleChange} placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special" />
                {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">Confirm New Password</label>
                <input type="password" name="confirmNewPassword" className={`form-control ${errors.confirmNewPassword ? 'is-invalid' : ''}`}
                  value={form.confirmNewPassword} onChange={handleChange} />
                {errors.confirmNewPassword && <div className="invalid-feedback">{errors.confirmNewPassword}</div>}
              </div>
              <button type="submit" className="btn btn-primary fw-semibold w-100" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }} disabled={loading}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Updating…</> : 'Change Password'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-6 mt-4 mt-md-0">
          <div className="card border-0 bg-light p-4" style={{ borderRadius: 12 }}>
            <h6 className="fw-bold mb-3" style={{ color: '#0f2044' }}><i className="bi bi-info-circle me-2"></i>Password Requirements</h6>
            <ul className="text-muted small mb-0">
              <li>At least 8 characters</li>
              <li>At least one uppercase letter (A-Z)</li>
              <li>At least one number (0-9)</li>
              <li>At least one special character (!@#$%^&*)</li>
            </ul>
            <hr />
            <p className="text-muted small mb-0"><i className="bi bi-shield-check me-1"></i>You will be logged out after changing your password for security.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
