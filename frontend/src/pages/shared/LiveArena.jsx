import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Activity, Users, Send, CheckCircle, Clock, Trophy } from 'lucide-react';

const LiveArena = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isHost = currentUser?.role === 'ROLE_TEACHER';

  const [client, setClient] = useState(null);
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [quizState, setQuizState] = useState('LOBBY'); // LOBBY, QUESTION, LEADERBOARD
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Host state
  const [hostQuestionInput, setHostQuestionInput] = useState('');
  const [hostOptions, setHostOptions] = useState([{text: '', isCorrect: true}, {text: '', isCorrect: false}]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Initialize STOMP client over SockJS
    const socket = new SockJS('http://localhost:8080/live-quiz-ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
    });

    stompClient.onConnect = () => {
      console.log('Connected to STOMP');
      stompClient.subscribe(`/topic/quiz/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        handleIncomingMessage(data);
      });

      // Announce presence
      stompClient.publish({
        destination: `/app/quiz/${roomId}/sendMessage`,
        body: JSON.stringify({ type: 'JOIN', sender: currentUser.username, content: isHost ? 'HOST' : 'PLAYER' })
      });
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, [roomId, currentUser]);

  const handleIncomingMessage = (data) => {
    if (data.type === 'JOIN') {
      setPlayers(prev => {
        if (!prev.includes(data.sender)) return [...prev, data.sender];
        return prev;
      });
      setMessages(prev => [...prev, `${data.sender} joined the arena.`]);
    } else if (data.type === 'START') {
      setQuizState('STARTING');
      setMessages(prev => [...prev, `Host started the quiz!`]);
    } else if (data.type === 'QUESTION') {
      setQuizState('QUESTION');
      setSelectedOption(null);
      setCurrentQuestion(data.content);
    } else if (data.type === 'ANSWER') {
      setMessages(prev => [...prev, `${data.sender} submitted an answer.`]);
    }
  };

  const broadcastQuestion = () => {
    if (client && isHost) {
      const qData = {
        text: hostQuestionInput,
        options: hostOptions
      };
      client.publish({
        destination: `/app/quiz/${roomId}/sendMessage`,
        body: JSON.stringify({ type: 'QUESTION', sender: currentUser.username, content: qData })
      });
      setHostQuestionInput('');
    }
  };

  const submitAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    if (client) {
      client.publish({
        destination: `/app/quiz/${roomId}/sendMessage`,
        body: JSON.stringify({ type: 'ANSWER', sender: currentUser.username, content: optionIndex })
      });
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-gradient)', color: 'white', padding: '2rem' }}>
      
      {/* Sidebar: Players & Chat Log */}
      <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', padding: '1.5rem', marginRight: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <Activity color="var(--primary-color)"/> Arena {roomId}
        </h2>
        
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1.1rem', marginBottom: '1rem' }}>
            <Users size={16}/> Players ({players.length})
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {players.map((p, i) => (
              <li key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ height: '150px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '10px', overflowY: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {messages.map((m, i) => <div key={i} style={{marginBottom: '5px'}}>{m}</div>)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {quizState === 'LOBBY' && (
          <div className="glass-panel glass-card" style={{ width: '100%', maxWidth: '600px', textAlign: 'center', padding: '3rem' }}>
            <Trophy size={64} color="#fbc531" style={{ marginBottom: '1.5rem' }} />
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Waiting for Host...</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              Get ready! The live quiz in room <b>{roomId}</b> is about to begin.
            </p>
            {isHost && (
              <button 
                className="btn" 
                onClick={() => setQuizState('STARTING')} 
                style={{ fontSize: '1.2rem', padding: '12px 24px', background: 'var(--primary-color)' }}
              >
                Start Live Quiz Now
              </button>
            )}
          </div>
        )}

        {isHost && quizState !== 'LOBBY' && (
          <div className="glass-panel glass-card" style={{ width: '100%', maxWidth: '800px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Send color="#1dd1a1"/> Broadcast Question</h2>
            <input 
              className="input-field" 
              placeholder="Enter question text..." 
              value={hostQuestionInput} 
              onChange={e => setHostQuestionInput(e.target.value)} 
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '1rem' }}>
              {hostOptions.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="radio" checked={opt.isCorrect} onChange={() => {
                    const newOpts = [...hostOptions];
                    newOpts.forEach(o => o.isCorrect = false);
                    newOpts[i].isCorrect = true;
                    setHostOptions(newOpts);
                  }} style={{ transform: 'scale(1.5)', accentColor: '#1dd1a1' }}/>
                  <input 
                    className="input-field" 
                    style={{ margin: 0, borderColor: opt.isCorrect ? '#1dd1a1' : '' }} 
                    placeholder={`Option ${i+1}`} 
                    value={opt.text} 
                    onChange={e => {
                      const newOpts = [...hostOptions];
                      newOpts[i].text = e.target.value;
                      setHostOptions(newOpts);
                    }} 
                  />
                </div>
              ))}
            </div>
            <button className="btn" onClick={broadcastQuestion} style={{ marginTop: '2rem', width: '100%', background: '#341f97' }}>
              Push Question to All Students
            </button>
          </div>
        )}

        {!isHost && quizState === 'QUESTION' && currentQuestion && (
          <div className="glass-panel glass-card" style={{ width: '100%', maxWidth: '800px', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'linear-gradient(90deg, #ff4757, #ffa502)' }}></div>
            <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem', textAlign: 'center' }}>{currentQuestion.text}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {currentQuestion.options.map((opt, i) => {
                const colors = ['#eb3b5a', '#3867d6', '#20bf6b', '#f7b731'];
                const isSelected = selectedOption === i;
                return (
                  <div 
                    key={i} 
                    onClick={() => submitAnswer(i)}
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.2)' : colors[i % colors.length],
                      padding: '2rem',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxShadow: isSelected ? `0 0 0 4px white inset` : '0 4px 15px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s',
                      transform: isSelected ? 'scale(0.95)' : 'scale(1)'
                    }}
                  >
                    {opt.text}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveArena;
