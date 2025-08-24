import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Notifications({ ws, currentUser }) {
  const [items, setItems] = useState([]);

  const load = async () => {
    if (!currentUser) return;
    try {
      const data = await api(`/api/notifications/${currentUser._id}?limit=100`);
      setItems(data);
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (!ws) return;

    const handler = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.kind === 'notification') {
          // Preferist notification object from server
          setItems((prev) => [msg.data, ...(prev || [])]);
        }
      } catch (e) {
        console.error('Invalid WS message', e);
      }
    };

    ws.addEventListener('message', handler);
    return () => ws.removeEventListener('message', handler);
  }, [ws]);

  const markRead = async (id) => {
    try {
      await api(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setItems(items.map(n => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (e) {
      alert('Failed to mark read: ' + e.message);
    }
  };

  return (
    <div>
      {!currentUser ? <p>Select a user to see notifications.</p> : null}

      <ul className="list">
        {items.map(n => (
          <li key={n._id || Math.random()}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span className={`tag ${n.type.toLowerCase()}`}>{n.type}</span>
              <div style={{ flex: 1 }}>
                <div>
                  {n.type === 'FOLLOW' && `User ${n.actorId} started following you.`}
                  {n.type === 'POST' && `A user you follow posted: ${n.metadata?.title || 'Untitled'}`}
                  {n.type === 'LIKE' && `User ${n.actorId} liked your post ${n.metadata?.postId || ''}`}
                </div>
                <small>{new Date(n.createdAt || Date.now()).toLocaleString()}</small>
              </div>
              <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                {!n.isRead && <button onClick={() => markRead(n._id)}>Mark read</button>}
                <span style={{ opacity: 0.7 }}>{n.isRead ? 'Read' : 'Unread'}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
