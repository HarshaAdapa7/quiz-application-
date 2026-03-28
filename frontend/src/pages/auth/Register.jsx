import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(username, email, password, role);
      navigate('/login');
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors && errorData.errors.length > 0) {
        setError(errorData.errors[0].defaultMessage);
      } else {
        setError(errorData?.message || 'Registration failed. Please check your inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel" style={{ width: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>
        {error && <div style={{ color: '#ff6b81', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            className="input-field" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            className="input-field" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <select 
            className="input-field" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student" style={{ color: 'black' }}>Student</option>
            <option value="teacher" style={{ color: 'black' }}>Teacher</option>
          </select>
          <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
