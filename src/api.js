export const API_BASE = 'http://localhost:5000';
export const WS_BASE = 'ws://localhost:5000/ws';

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
