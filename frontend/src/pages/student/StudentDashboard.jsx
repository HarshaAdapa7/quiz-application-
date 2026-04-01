import React, { useState, useEffect } from 'react';
import { logout, getCurrentUser } from '../../services/authService';
import { getAvailableQuizzes, submitAttempt, getMyAttempts } from '../../services/studentService';
import { getUserProfile, getLeaderboard } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Target, LogOut, LayoutDashboard, ChevronRight, CheckCircle, Award, Activity, Flame, Star, Settings, Bell } from 'lucide-react';
import AdvancedLeaderboard from '../../components/AdvancedLeaderboard';
import ProfileSettings from '../../components/ProfileSettings';



const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const qRes = await getAvailableQuizzes();
      setQuizzes(Array.isArray(qRes.data) ? qRes.data : []);
      const aRes = await getMyAttempts();
      setAttempts(Array.isArray(aRes.data) ? aRes.data : []);
      
      const user = getCurrentUser();
      if(user) {
        const pRes = await getUserProfile(user.id);
        setProfile(pRes.data);
      }
      const lRes = await getLeaderboard();
      setLeaderboard(lRes.data);

    } catch(err) {
      console.error(err);
      setQuizzes([]);
      setAttempts([]);
    }
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizStartTime(new Date().toISOString());
    setTimeLeft(quiz.timeLimitMinutes * 60);
  };

  const handleSelectOption = (questionId, optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId
    });
  };

  const handeNext = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const finishQuiz = async () => {
    setSubmitting(true);
    let calculatedScore = 0;
    
    activeQuiz.questions.forEach(q => {
      const selected = selectedAnswers[q.id];
      const correctOption = q.options.find(o => o.isCorrect);
      if (correctOption && selected === correctOption.id) {
        calculatedScore += 1;
      }
    });

    try {
      await submitAttempt({
        quiz: activeQuiz,
        startTime: quizStartTime,
        score: calculatedScore
      });

      // Gamification Wow Factor: Confetti on perfect score
      if (calculatedScore === activeQuiz.questions.length && activeQuiz.questions.length > 0) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#fbc531', '#1dd1a1', '#ff4757', '#48dbfb']
        });
      }

      setActiveQuiz(null);
      fetchData(); 
    } catch(err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null) return '--:--';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    let timer;
    if (activeQuiz && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, timeLeft]);

  useEffect(() => {
    if (activeQuiz && timeLeft === 0 && !submitting) {
      finishQuiz();
    }
  }, [timeLeft]);

  const performanceData = attempts.map((a, i) => ({
    name: `A${i+1}`,
    score: a.score
  }));

  if (activeQuiz) {
    const question = activeQuiz.questions[currentQuestionIndex];
    if (!question) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>No Questions Found</h2>
            <button className="btn" onClick={() => setActiveQuiz(null)}>Back to Dashboard</button>
          </div>
        </div>
      )
    }

    const progressPercentage = ((currentQuestionIndex) / activeQuiz.questions.length) * 100;
    const isLastQuestion = currentQuestionIndex === activeQuiz.questions.length - 1;
    const hasAnsweredCurrent = !!selectedAnswers[question.id];

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        
        <div style={{ width: '100%', maxWidth: '800px', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--text-main)', textAlign: 'center', marginBottom: '1rem' }}>{activeQuiz.title}</h2>
          
          <div style={{ width: '100%', height: '8px', background: 'var(--glass-bg)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${progressPercentage}%`, 
              background: 'var(--primary-color)', 
              transition: 'width 0.3s ease' 
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}</span>
            <span style={{ color: timeLeft !== null && timeLeft <= 60 ? '#ff4757' : 'inherit', fontWeight: timeLeft !== null && timeLeft <= 60 ? 'bold' : 'normal', transition: 'color 0.3s' }}>
              <Clock size={14} style={{verticalAlign:'middle', marginRight:'4px'}}/> Time Left: {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="glass-panel glass-card" style={{ width: '100%', maxWidth: '800px', minHeight: '400px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', lineHeight: '1.4' }}>
            {question.text}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
            {question.options.map((opt) => {
              const isSelected = selectedAnswers[question.id] === opt.id;
              return (
                <div 
                  key={opt.id}
                  onClick={() => handleSelectOption(question.id, opt.id)}
                  style={{
                    padding: '1rem 1.5rem',
                    borderRadius: '12px',
                    border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--glass-border)'}`,
                    background: isSelected ? 'rgba(255, 71, 87, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.02)' : 'none'
                  }}
                >
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--text-muted)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isSelected && <div style={{width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)'}}/>}
                  </div>
                  <span style={{ fontSize: '1.1rem' }}>{opt.text}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            {isLastQuestion ? (
              <button 
                className="btn" 
                onClick={finishQuiz} 
                disabled={!hasAnsweredCurrent || submitting}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1dd1a1' }}
              >
                <CheckCircle size={18} /> {submitting ? 'Submitting...' : 'Submit Final Answers'}
              </button>
            ) : (
              <button 
                className="btn" 
                onClick={handeNext}
                disabled={!hasAnsweredCurrent}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Next Question <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <div className="glass-panel sidebar-panel">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          {profile?.username ? (
            <img 
              src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.username}&background=random&color=fff&bold=true&length=1`} 
              alt="Avatar"
              style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '10px', border: '3px solid rgba(255,255,255,0.1)' }}
            />
          ) : (
            <LayoutDashboard size={48} color="var(--text-muted)" style={{ marginBottom: '10px' }}/>
          )}
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary-color)' }}>
            {profile?.username || 'Student'}
          </h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
          <button className={`btn ${activeTab !== 'dashboard' && 'btn-secondary'}`} onClick={() => setActiveTab('dashboard')}>
            Overview
          </button>
          <button className={`btn ${activeTab !== 'history' && 'btn-secondary'}`} onClick={() => setActiveTab('history')}>
            Past History
          </button>
          <button className={`btn ${activeTab !== 'leaderboard' && 'btn-secondary'}`} onClick={() => setActiveTab('leaderboard')}>
            Leaderboard
          </button>
          <button className={`btn ${activeTab !== 'profile' && 'btn-secondary'}`} onClick={() => setActiveTab('profile')}>
            <Settings size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }}/> Profile Settings
          </button>
          <button className={`btn ${activeTab !== 'notifications' && 'btn-secondary'}`} onClick={() => setActiveTab('notifications')}>
            <Bell size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }}/> Notifications
          </button>
        </div>

        <button className="btn btn-secondary" style={{ border: 'none' }} onClick={() => { logout(); navigate('/login'); }}>
          <LogOut size={18} style={{ marginRight: '8px', verticalAlign: 'middle', color: '#ff4757' }}/> Logout
        </button>
      </div>

      <div className="main-content">
        <div className="glass-panel" style={{ minHeight: 'calc(100vh - 2rem)' }}>
          {activeTab === 'dashboard' && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Welcome back{profile?.username ? `, ${profile.username}` : ''}! Ready to learn?</h2>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div className="glass-panel glass-card" style={{ flex: '1 1 200px', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '15px', background: 'rgba(251, 197, 49, 0.2)', borderRadius: '15px' }}>
                    <Trophy size={40} color="#fbc531" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total XP</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
                      {profile ? profile.totalScore : 0}
                    </p>
                  </div>
                </div>

                <div className="glass-panel glass-card" style={{ flex: '1 1 200px', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '15px', background: 'rgba(235, 77, 75, 0.2)', borderRadius: '15px' }}>
                    <Flame size={40} color="#eb4d4b" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Streak</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
                      {profile ? profile.currentStreak : 0} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>days</span>
                    </p>
                  </div>
                </div>

                <div className="glass-panel glass-card" style={{ flex: '1 1 200px', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '15px', background: 'rgba(104, 109, 224, 0.2)', borderRadius: '15px' }}>
                    <Star size={40} color="#686de0" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Level</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
                      {profile ? profile.level : 1}
                    </p>
                  </div>
                </div>

                <div className="glass-panel glass-card" style={{ flex: '1 1 200px', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '15px', background: 'rgba(29, 209, 161, 0.2)', borderRadius: '15px' }}>
                    <Target size={40} color="#1dd1a1" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Accuracy</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
                      {profile ? profile.averageAccuracy.toFixed(1) : 0}%
                    </p>
                  </div>
                </div>

                <div className="glass-panel glass-card" style={{ flex: '1 1 200px', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '15px', background: 'rgba(72, 219, 251, 0.2)', borderRadius: '15px' }}>
                    <Award size={40} color="#48dbfb" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Quizzes</h3>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
                      {profile ? profile.totalQuizzesTaken : 0}
                    </p>
                  </div>
                </div>
              </div>

               {attempts.length > 0 && (
                 <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem', marginBottom: '2.5rem' }}>
                   <div>
                     <h3 style={{ marginBottom: '1rem', fontWeight: 500 }}>Your Performance Trend</h3>
                     <div className="glass-panel" style={{ height: '300px', padding: '1rem' }}>
                       <ResponsiveContainer width="100%" height="100%">
                         <LineChart data={performanceData}>
                           <XAxis dataKey="name" stroke="#a4b0be" tickLine={false} axisLine={false} />
                           <YAxis stroke="#a4b0be" tickLine={false} axisLine={false} />
                           <Tooltip 
                             contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                             itemStyle={{ color: 'var(--primary-color)' }}
                           />
                           <Line type="monotone" dataKey="score" stroke="var(--primary-color)" strokeWidth={4} dot={{ r: 6, fill: 'var(--primary-color)', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                         </LineChart>
                       </ResponsiveContainer>
                     </div>
                   </div>

                   <div>
                     <h3 style={{ marginBottom: '1rem', fontWeight: 500 }}>Subject Strengths (Accuracy %)</h3>
                     <div className="glass-panel" style={{ height: '300px', padding: '1rem' }}>
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={profile?.categoryAccuracy ? Object.entries(profile.categoryAccuracy).map(([name, accuracy]) => ({ name, accuracy })) : []}>
                           <XAxis dataKey="name" stroke="#a4b0be" axisLine={false} tickLine={false} />
                           <YAxis stroke="#a4b0be" axisLine={false} tickLine={false} />
                           <Tooltip 
                             contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                             cursor={{fill: 'rgba(255,255,255,0.05)'}}
                           />
                           <Bar dataKey="accuracy" fill="#48dbfb" radius={[6, 6, 0, 0]} />
                         </BarChart>
                       </ResponsiveContainer>
                     </div>
                   </div>
                 </div>
              )}

              {profile?.badges && profile.badges.length > 0 && (
                <div style={{ marginBottom: '2.5rem', animation: 'fadeIn 0.5s ease' }}>
                  <h3 style={{ fontWeight: 500, marginBottom: '1rem' }}>Earned Badges <span style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>({profile.badges.length})</span></h3>
                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    {profile.badges.map(badge => (
                      <div key={badge.id} className="glass-panel glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 20px', background: 'rgba(251, 197, 49, 0.05)', border: '1px solid rgba(251, 197, 49, 0.2)' }}>
                        <div style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px rgba(251, 197, 49, 0.5))' }}>{badge.iconUrl}</div>
                        <div>
                          <strong style={{ display: 'block', fontSize: '1rem', color: '#fbc531' }}>{badge.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{badge.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 style={{ fontWeight: 500 }}>Assigned Quizzes</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '1.5rem' }}>
                
                {/* Live Event Join Card */}
                <div className="glass-panel glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #fbc531', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <Activity color="#fbc531" size={24} />
                    <h4 style={{ margin: 0, fontSize: '1.2rem' }}>Join Live Event</h4>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                    Enter the room code provided by your teacher to join a real-time multiplayer session.
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                     <input 
                       id="roomCodeInput" 
                       className="input-field" 
                       placeholder="4-Digit Code" 
                       style={{ width: '120px', margin: 0 }} 
                       maxLength="4"
                     />
                     <button className="btn" style={{ flex: 1 }} onClick={() => {
                       const code = document.getElementById('roomCodeInput').value;
                       if (code.length === 4) navigate(`/live/${code}`);
                       else alert('Please enter a valid 4-digit room code.');
                     }}>Join Arena</button>
                  </div>
                </div>

                {quizzes.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                    <CheckCircle size={48} style={{ opacity: 0.2, margin: '0 auto 10px auto' }} />
                    No quizzes pending. You're all caught up!
                  </div>
                ) : (
                  quizzes.map(quiz => {
                  const hasAttempted = attempts.some(a => a.quiz?.id === quiz.id);
                  return (
                  <div key={quiz.id} className="glass-panel glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{quiz.title}</h4>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={16}/> {quiz.timeLimitMinutes} Minutes
                    </p>
                    <div style={{ marginTop: 'auto' }}>
                      <button 
                        className="btn" 
                        onClick={() => startQuiz(quiz)} 
                        style={{ width: '100%', padding: '12px', background: hasAttempted ? 'transparent' : '', border: hasAttempted ? '1px solid var(--primary-color)' : '', color: hasAttempted ? 'var(--primary-color)' : '' }}
                      >
                        {hasAttempted ? 'Retake Quiz' : 'Start Quiz Now'}
                      </button>
                    </div>
                  </div>
                  );
                }))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ marginBottom: '2rem' }}>Submission History</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {attempts.map(attempt => (
                  <div key={attempt.id} className="glass-panel glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                    <div>
                      <strong style={{ fontSize: '1.2rem' }}>{attempt.quiz?.title || `Quiz #${attempt.quiz?.id}`}</strong>
                      <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Completed on {new Date(attempt.startTime).toLocaleDateString()} at {new Date(attempt.startTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {attempt.score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>XP</span>
                      </div>
                    </div>
                  </div>
                ))}
                {attempts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                    <Target size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1.2rem' }}>You haven't taken any quizzes yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity color="var(--primary-color)"/> Global Leaderboard
              </h2>
              <AdvancedLeaderboard data={leaderboard} />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 style={{ marginBottom: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell color="var(--primary-color)"/> Notifications
              </h2>
              <div className="glass-panel glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={48} style={{ opacity: 0.2, margin: '0 auto 10px auto' }} />
                <p style={{ fontSize: '1.2rem' }}>You're all caught up!</p>
                <p>No new notifications at this time.</p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <ProfileSettings 
              userProfile={profile} 
              userId={getCurrentUser()?.id} 
              onProfileUpdated={fetchData} 
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
