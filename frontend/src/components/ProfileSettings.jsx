import React, { useState } from 'react';
import { Save, User, Mail, Lock, Shield, Bell, CheckCircle } from 'lucide-react';
import { updateUserProfile } from '../services/userService';

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1",
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Cute",
  "https://api.dicebear.com/7.x/micah/svg?seed=Art",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Study",
  "https://api.dicebear.com/7.x/shapes/svg?seed=Geo",
  "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Professional"
];

const ProfileSettings = ({ userProfile, userId, onProfileUpdated }) => {
  const [username, setUsername] = useState(userProfile?.username || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [password, setPassword] = useState('');
  
  // Custom logic to handle old ui-avatars fallback vs selected predefined avatar
  const currentAvatar = userProfile?.avatarUrl || `https://ui-avatars.com/api/?name=${userProfile?.username || 'User'}&background=random&color=fff&bold=true&length=1`;
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Mock Toggles for Industry-level UI
  const [twoFactor, setTwoFactor] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const payload = {};
      if (username !== userProfile?.username) payload.username = username;
      if (email !== userProfile?.email) payload.email = email;
      if (selectedAvatar !== currentAvatar) payload.avatarUrl = selectedAvatar;
      if (password) payload.password = password;

      if (Object.keys(payload).length > 0) {
        await updateUserProfile(userId, payload);
        if (onProfileUpdated) onProfileUpdated();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile. Username/Email might be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', fontWeight: 600 }}>Profile & Settings</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        
        {/* Left Column - Main Form */}
        <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.15)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)' }}>
            <User size={20} /> Personal Information
          </h3>
          
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  style={{ paddingLeft: '45px', marginBottom: 0 }}
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  className="input-field" 
                  style={{ paddingLeft: '45px', marginBottom: 0 }}
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>New Password <span style={{fontSize: '0.8rem'}}>(Leave blank to keep current)</span></label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="input-field" 
                  style={{ paddingLeft: '45px', marginBottom: 0 }}
                  placeholder="••••••••"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button type="submit" className="btn" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
              {success && (
                <span style={{ color: '#1dd1a1', display: 'flex', alignItems: 'center', gap: '5px', animation: 'fadeIn 0.3s' }}>
                  <CheckCircle size={18} /> Profile updated!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Right Column - Avatar & Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Avatar Selector Panel */}
          <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.15)', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Your Avatar</h3>
            
            <img 
              src={selectedAvatar} 
              alt="Current Avatar" 
              style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--primary-color)', marginBottom: '1.5rem', objectFit: 'cover', background: 'var(--glass-bg)' }}
            />
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Choose from presets:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {AVATAR_OPTIONS.map((avatar, idx) => (
                <img 
                  key={idx}
                  src={avatar}
                  alt={`Preset ${idx}`}
                  onClick={() => setSelectedAvatar(avatar)}
                  style={{ 
                    width: '100%', 
                    aspectRatio: '1', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    border: selectedAvatar === avatar ? '2px solid var(--primary-color)' : '2px solid transparent',
                    background: 'rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease',
                    transform: selectedAvatar === avatar ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = selectedAvatar === avatar ? 'scale(1.1)' : 'scale(1)'}
                />
              ))}
            </div>
          </div>

          {/* Industry Level Settings Mock */}
          <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <Shield size={18} color="#fbc531" /> Security & Alerts
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>Two-Factor Auth</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Secure your account</span>
              </div>
              <div 
                onClick={() => setTwoFactor(!twoFactor)}
                style={{ width: '40px', height: '22px', borderRadius: '20px', background: twoFactor ? '#1dd1a1' : 'rgba(255,255,255,0.2)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}
              >
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: twoFactor ? '20px' : '2px', transition: '0.3s' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <div>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.95rem' }}><Bell size={14}/> Notifs</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email assignments</span>
              </div>
              <div 
                onClick={() => setEmailNotifs(!emailNotifs)}
                style={{ width: '40px', height: '22px', borderRadius: '20px', background: emailNotifs ? 'var(--primary-color)' : 'rgba(255,255,255,0.2)', cursor: 'pointer', position: 'relative', transition: '0.3s' }}
              >
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: emailNotifs ? '20px' : '2px', transition: '0.3s' }} />
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
