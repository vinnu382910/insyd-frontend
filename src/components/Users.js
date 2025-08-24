import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function Users({ onPick }) {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);

  const load = async () => {
    try {
      const list = await api('/api/users');
      setUsers(list);
    } catch (e) {
      alert('Failed to load users: ' + e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api('/api/users', { method: 'POST', body: JSON.stringify({ name }) });
      setName('');
      await load();
    } catch (e) {
      alert('Create user failed: ' + e.message);
    }
  };

  return (
    <div>
      <form onSubmit={create} className="row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
        <button type="submit">Create</button>
      </form>

      <ul className="list">
        {users.map((u) => (
          <li key={u._id}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="link" onClick={() => onPick(u)}>Use</button>
              <span className="pill">{u.name}</span>
              <code style={{ fontSize: '11px' }}>{u._id}</code>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
