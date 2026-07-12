import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { FiMail, FiLock, FiLayers } from 'react-icons/fi';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const res = await login(values.email, values.password);
      setIsSubmitting(false);

      if (res.success) {
        toast.success('Successfully logged in!');
        navigate('/');
      } else {
        toast.error(res.message || 'Login failed');
      }
    },
  });

  return (
    <div className="login-wrapper">
      <div className="glass-card login-card animated-fade-in">
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3" style={{ background: 'var(--primary-grad)', color: 'white', fontSize: '2rem' }}>
            <FiLayers />
          </div>
          <h3 className="font-weight-bold text-white mb-1">AssetFlow</h3>
          <p className="text-muted small">Relational Enterprise Asset Manager</p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label small text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-color text-muted">
                <FiMail />
              </span>
              <input
                id="email"
                type="email"
                className={`form-control border-start-0 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                placeholder="name@company.com"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 border-color text-muted">
                <FiLock />
              </span>
              <input
                id="password"
                type="password"
                className={`form-control border-start-0 ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-grad w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-4 text-center small text-white-50">
          <div>Demo Logins:</div>
          <div>Admin: <code>admin@assetflow.com</code> / <code>Password123</code></div>
          <div>Manager: <code>manager@assetflow.com</code> / <code>Password123</code></div>
          <div>Tech: <code>tech@assetflow.com</code> / <code>Password123</code></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
