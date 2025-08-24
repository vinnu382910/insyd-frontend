export const API_BASE = 'https://insyd-backend-b1hs.onrender.com';
export const WS_BASE = 'wss://insyd-backend-b1hs.onrender.com/ws';

export async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  // If no content
  if (res.status === 204) return null;
  return res.json();
}
