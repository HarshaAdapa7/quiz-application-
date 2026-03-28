import React from 'react';
import { Trophy, Medal, Award, Flame, Target, Infinity as InfinityIcon } from 'lucide-react';

const AdvancedLeaderboard = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Trophy size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
        <p>No ranked players yet.</p>
      </div>
    );
  }

  const top3 = data.slice(0, 3);
  const others = data.slice(3);

  // Rearrange top 3 for podium (2nd, 1st, 3rd)
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push({ ...top3[1], rank: 2 });
  if (top3[0]) podiumOrder.push({ ...top3[0], rank: 1 });
  if (top3[2]) podiumOrder.push({ ...top3[2], rank: 3 });

  const getPodiumStyles = (rank) => {
    switch (rank) {
      case 1: return { color: '#fbc531', bg: 'rgba(251, 197, 49, 0.15)', border: 'rgba(251, 197, 49, 0.4)', height: '200px', icon: <Trophy size={32} color="#fbc531" /> };
      case 2: return { color: '#dcdde1', bg: 'rgba(220, 221, 225, 0.1)', border: 'rgba(220, 221, 225, 0.3)', height: '160px', icon: <Medal size={28} color="#dcdde1" /> };
      case 3: return { color: '#e1b12c', bg: 'rgba(225, 177, 44, 0.1)', border: 'rgba(225, 177, 44, 0.3)', height: '140px', icon: <Award size={28} color="#e1b12c" /> };
      default: return {};
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Podium Section */}
      {top3.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'flex-end', 
          gap: '15px',
          marginTop: '2rem',
          marginBottom: '1rem',
          minHeight: '260px'
        }}>
          {podiumOrder.map((user) => {
            const styles = getPodiumStyles(user.rank);
            return (
              <div key={user.username} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                width: '140px',
                position: 'relative',
                animation: `slideUp 0.6s ease-out ${user.rank * 0.15}s backwards`
              }}>
                {/* Avatar / Icon Circle */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--glass-bg)',
                  border: `2px solid ${styles.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  position: 'relative',
                  boxShadow: `0 0 15px ${styles.bg}`,
                  zIndex: 2,
                  backgroundImage: `linear-gradient(135deg, ${styles.bg}, rgba(0,0,0,0.5))`
                }}>
                  <div style={{ position: 'absolute', top: '-15px', animation: 'bounce 2s infinite ease-in-out' }}>
                    {styles.icon}
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '10px', zIndex: 2 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: styles.color, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {user.username}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>
                    {user.totalScore} XP
                  </div>
                </div>

                {/* Podium Pedestal */}
                <div className="glass-panel" style={{
                  width: '100%',
                  height: styles.height,
                  background: styles.bg,
                  border: `1px solid ${styles.border}`,
                  borderBottom: 'none',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  borderBottomLeftRadius: '0',
                  borderBottomRightRadius: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingTop: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, right: 0, height: '4px', 
                    background: styles.color, opacity: 0.8, boxShadow: `0 0 10px ${styles.color}` 
                  }} />
                  <span style={{ 
                    fontSize: '4rem', 
                    fontWeight: 900, 
                    color: 'rgba(255,255,255,0.05)', 
                    position: 'absolute',
                    bottom: '-10px',
                    lineHeight: 1
                  }}>
                    {user.rank}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.85rem', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', title: 'Current Streak' }}>
                      <Flame size={14} color="#eb4d4b" /> {user.currentStreak}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', title: 'Accuracy' }}>
                      <Target size={14} color="#1dd1a1" /> {user.averageAccuracy.toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rank 4+ List */}
      {others.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {others.map((user, index) => {
            const actualRank = index + 4;
            return (
              <div key={user.username} className="glass-panel glass-card" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem 1.5rem', 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid rgba(255,255,255,0.05)',
                animation: `slideLeft 0.5s ease-out ${index * 0.05}s backwards`
              }}>
                <div style={{ width: '40px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                  #{actualRank}
                </div>
                
                {/* Avatar */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: '15px', color: 'var(--text-main)', fontWeight: 'bold'
                }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <strong style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {user.username} 
                    <span style={{ 
                      background: 'rgba(104, 109, 224, 0.1)', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      color: '#a29bfe', 
                      border: '1px solid rgba(104, 109, 224, 0.3)' 
                    }}>
                      Lvl {user.level}
                    </span>
                  </strong>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Flame size={12} color="#ff7675" /> {user.currentStreak} day streak
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Target size={12} color="#55efc4" /> {user.averageAccuracy.toFixed(1)}% acc
                    </span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {user.totalScore} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default AdvancedLeaderboard;
