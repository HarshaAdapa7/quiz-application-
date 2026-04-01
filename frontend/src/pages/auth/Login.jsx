import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import { login } from '../../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(username, password);
      if (user.role === 'ROLE_TEACHER') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-split">
        <div className="auth-left" style={{ backgroundImage: "url('/auth_hero.png')" }}>
          <div className="auth-hero-content">
            <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Level Up<br/>Your Learning.</h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', maxWidth: '400px', lineHeight: '1.6' }}>Join our premium quiz platform and experience the next generation of gamified education and interactive assessments.</p>
          </div>
        </div>
        
        <div className="auth-right">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#fff' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Enter your credentials to access your account</p>
          </div>
          
          {error && <div style={{ background: 'rgba(255, 107, 129, 0.1)', borderLeft: '4px solid #ff6b81', color: '#ff6b81', padding: '12px 16px', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
          
          <form onSubmit={handleLogin}>
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
              <Lock size={20} className="icon" />
              <input 
                type="password" 
                className="input-field" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>Forgot password?</span>
            </div>
            
            <button type="submit" className="btn" style={{ width: '100%', padding: '14px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={loading}>
              {loading ? 'Authenticating...' : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>
          
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 500, textDecoration: 'none' }}>Create one here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
