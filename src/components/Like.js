import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Like({ currentUser, disabled }) {
  const [users, setUsers] = useState([]);
  const [owner, setOwner] = useState('');
  const [postId, setPostId] = useState('demo-post-1');

  useEffect(() => {
    api('/api/users').then(setUsers).catch((e) => console.error(e));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!owner) return;
    try {
      await api('/api/events/like', { method: 'POST', body: JSON.stringify({ actorId: currentUser._id, ownerId: owner, postId }) });
      alert('Owner notified');
      setPostId('demo-post-1');
    } catch (err) {
      alert('Like failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={submit} className="row">
      <select disabled={disabled} value={owner} onChange={(e) => setOwner(e.target.value)}>
        <option value="">Select post owner to like</option>
        {users.filter(u => u._id !== currentUser?._id).map(u => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>
      <input disabled={disabled} value={postId} onChange={(e) => setPostId(e.target.value)} placeholder="Post ID" />
      <button disabled={disabled || !owner} type="submit">Like</button>
    </form>
  );
}
