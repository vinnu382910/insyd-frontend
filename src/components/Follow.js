import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Follow({ currentUser, disabled }) {
  const [users, setUsers] = useState([]);
  const [target, setTarget] = useState('');

  useEffect(() => {
    api('/api/users').then(setUsers).catch((e) => console.error(e));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!target) return;
    try {
      await api('/api/follows', { method: 'POST', body: JSON.stringify({ followerId: currentUser._id, followeeId: target }) });
      alert('Followed & notification sent');
      setTarget('');
    } catch (err) {
      alert('Follow failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={submit} className="row">
      <select disabled={disabled} value={target} onChange={(e) => setTarget(e.target.value)}>
        <option value="">Select user to follow</option>
        {users.filter(u => u._id !== currentUser?._id).map(u => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>
      <button disabled={disabled || !target} type="submit">Follow</button>
    </form>
  );
}
