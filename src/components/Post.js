import React, { useState } from 'react';
import { api } from '../api';

export default function Post({ currentUser, disabled }) {
  const [title, setTitle] = useState('My first post');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api('/api/events/post', {
        method: 'POST',
        body: JSON.stringify({ authorId: currentUser._id, title, postId: (Date.now() + '-' + Math.random()).toString() })
      });
      alert('Posted & followers notified');
      setTitle('My first post');
    } catch (err) {
      alert('Post failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={submit} className="row">
      <input disabled={disabled} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
      <button disabled={disabled} type="submit">Notify Followers</button>
    </form>
  );
}
