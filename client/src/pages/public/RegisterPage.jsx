import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validators';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!validateEmail(form.email)) e.email = 'Invalid email address';

    const pwErrs = validatePassword(form.password);
    if (pwErrs.length > 0) e.password = pwErrs.join(', ');

    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';

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
      const user = await register(form);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center py-5" style={{ backgroundColor: '#f4f7fb' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow p-3 p-sm-4 p-md-5" style={{ borderRadius: 16 }}>
              <div className="text-center mb-4">
                <i className="bi bi-map fs-1" style={{ color: '#0f2044' }}></i>
                <h2 className="fw-bold mt-2" style={{ color: '#0f2044' }}>Create Account</h2>
                <p className="text-muted">Start planning your career journey today</p>
              </div>

              {serverError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2">
                  <i className="bi bi-exclamation-circle-fill"></i> {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="reg-name" className="form-label fw-semibold">Full Name</label>
                  <input id="reg-name" name="name" type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Priya Sharma" value={form.name} onChange={handleChange} />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="reg-email" className="form-label fw-semibold">Email Address</label>
                  <input id="reg-email" name="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="you@example.com" value={form.email} onChange={handleChange} />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="reg-password" className="form-label fw-semibold">Password</label>
                  <input id="reg-password" name="password" type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special" value={form.password} onChange={handleChange} />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="reg-confirm" className="form-label fw-semibold">Confirm Password</label>
                  <input id="reg-confirm" name="confirmPassword" type="password" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-semibold py-2" style={{ backgroundColor: '#0f2044', borderColor: '#0f2044' }} disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating…</> : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-muted mt-4 mb-0">
                Already have an account? <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#0f2044' }}>Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
