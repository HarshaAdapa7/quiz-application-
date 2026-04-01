import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Shield, ArrowRight } from 'lucide-react';
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
      <div className="auth-split">
        <div className="auth-left" style={{ backgroundImage: "url('/auth_hero.png')" }}>
          <div className="auth-hero-content">
            <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Join the Future.</h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '400px', lineHeight: '1.6' }}>Create a free account today to experience immersive learning, live multiplayer arenas, and beautiful analytics.</p>
          </div>
        </div>
        
        <div className="auth-right">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#fff' }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Fill in your details to get started instantly</p>
          </div>
          
          {error && <div style={{ background: 'rgba(255, 107, 129, 0.1)', borderLeft: '4px solid #ff6b81', color: '#ff6b81', padding: '12px 16px', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
          
          <form onSubmit={handleRegister}>
            <div className="input-with-icon">
              <User size={20} className="icon" />
              <input 
                type="text" 
                className="input-field" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            
            <div className="input-with-icon">
              <Mail size={20} className="icon" />
              <input 
                type="email" 
                className="input-field" 
                placeholder="Email Address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className="input-with-icon">
              <Lock size={20} className="icon" />
              <input 
                type="password" 
                className="input-field" 
                placeholder="Password (minimum 6 characters)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <div className="input-with-icon">
              <Shield size={20} className="icon" />
              <select 
                className="input-field" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ appearance: 'none' }}
              >
                <option value="student" style={{ color: 'black' }}>Enroll as Student</option>
                <option value="teacher" style={{ color: 'black' }}>Register as Teacher</option>
              </select>
            </div>
            
            <button type="submit" className="btn" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : <>Sign Up Now <ArrowRight size={18} /></>}
            </button>
          </form>
          
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 500, textDecoration: 'none' }}>Log in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
