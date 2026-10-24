import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-5" style={{ backgroundColor: '#f4f7fb' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow p-4 p-md-5" style={{ borderRadius: 16 }}>
              <div className="text-center mb-4">
                <i className="bi bi-map fs-1" style={{ color: '#0f2044' }}></i>
                <h2 className="fw-bold mt-2" style={{ color: '#0f2044' }}>Welcome Back</h2>
                <p className="text-muted">Sign in to your CareerPath account</p>
              </div>

              {serverError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2">
                  <i className="bi bi-exclamation-circle-fill"></i> {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="login-email" className="form-label fw-semibold">Email Address</label>
                  <input id="login-email" name="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="you@example.com" value={form.email} onChange={handleChange} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="login-password" className="form-label fw-semibold">Password</label>
                  <input id="login-password" name="password" type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Your password" value={form.password} onChange={handleChange} />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-semibold py-2" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }} disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in…</> : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-muted mt-4 mb-0">
                Don't have an account? <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: '#0f2044' }}>Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
