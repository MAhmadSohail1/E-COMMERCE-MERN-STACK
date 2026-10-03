import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const { register, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const res = await register(name, email, password, role);
    if (res.success) {
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <h1>Create Account</h1>
        <p>Register to start shopping and managing products</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            className="form-control"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">Email Address</label>
          <input
            id="reg-email"
            type="email"
            className="form-control"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            className="form-control"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Account Role</label>
          <select
            id="role"
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Customer / User</option>
            <option value="admin">Administrator (Admin Dashboard Access)</option>
          </select>
          <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
            Choose "Administrator" to test the Admin Dashboard management features.
          </small>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login">Sign In</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
