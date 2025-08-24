import React, { useEffect, useState } from 'react';
import Users from './components/Users';
import Follow from './components/Follow';
import Post from './components/Post';
import Like from './components/Like';
import Notifications from './components/Notifications';
import { WS_BASE } from './api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [ws, setWs] = useState(null);

  // Create WS connection whenever currentUser changes
  useEffect(() => {
    if (!currentUser) {
      if (ws) {
        ws.close();
        setWs(null);
      }
      return;
    }

    const socket = new WebSocket(`${WS_BASE}?userId=${currentUser._id}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (err) => {
      console.error('WebSocket error', err);
    };

    setWs(socket);

    return () => {
      socket.close();
      setWs(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <div className="container">
      <header>
        <h1>Insyd — Notifications POC</h1>
        <div className="current-user">
          <span>Current User:</span>
          <span className="badge">{currentUser ? currentUser.name : '—'}</span>
        </div>
      </header>

      <section className="grid">
        <div className="card">
          <h2>1) Users</h2>
          <Users onPick={setCurrentUser} />
        </div>

        <div className="card">
          <h2>2) Follow</h2>
          <Follow disabled={!currentUser} currentUser={currentUser} />
        </div>

        <div className="card">
          <h2>3) Post (Notify Followers)</h2>
          <Post disabled={!currentUser} currentUser={currentUser} />
        </div>

        <div className="card">
          <h2>4) Like (Notify Owner)</h2>
          <Like disabled={!currentUser} currentUser={currentUser} />
        </div>

        <div className="card wide">
          <h2>🔔 Notifications</h2>
          <Notifications ws={ws} currentUser={currentUser} />
        </div>
      </section>
    </div>
  );
}
