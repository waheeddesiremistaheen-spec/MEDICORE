import { createContext, useContext, useState, useEffect } from 'react';

const KEY = 'hms-v1';
const SESSION_KEY = 'hms-session';
const StoreContext = createContext(null);

const empty = { patients: [], doctors: [], appointments: [], records: [], users: [] };

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function StoreProvider({ children }) {
  const [db, setDb] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY));
      return stored ? { ...empty, ...stored } : empty;
    } catch {
      return empty;
    }
  });

  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(db));
  }, [db]);

  useEffect(() => {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  const add = (collection, item) => {
    const row = { ...item, id: uid(), createdAt: new Date().toISOString() };
    setDb(d => ({ ...d, [collection]: [row, ...d[collection]] }));
    return row;
  };

  const update = (collection, id, patch) =>
    setDb(d => ({
      ...d,
      [collection]: d[collection].map(r => (r.id === id ? { ...r, ...patch } : r)),
    }));

  const remove = (collection, id) =>
    setDb(d => ({
      ...d,
      [collection]: d[collection].filter(r => r.id !== id),
    }));

  const getOne = (collection, id) =>
    db[collection].find(r => r.id === id) || null;

  // ---- auth ----

  const signup = ({ name, email, password }) => {
    const clean = email.trim().toLowerCase();
    const exists = db.users.find(u => u.email === clean);
    if (exists) return { ok: false, error: 'That email is already registered.' };

    const user = {
      id: uid(),
      name: name.trim(),
      email: clean,
      password, // NOTE: plaintext for demo only, never do this in production
      createdAt: new Date().toISOString(),
    };
    setDb(d => ({ ...d, users: [...d.users, user] }));

    const s = { id: user.id, name: user.name, email: user.email };
    setSession(s);
    return { ok: true };
  };

  const login = ({ email, password }) => {
    const clean = email.trim().toLowerCase();
    const user = db.users.find(
      u => u.email === clean && u.password === password
    );
    if (!user) return { ok: false, error: 'Invalid email or password.' };

    const s = { id: user.id, name: user.name, email: user.email };
    setSession(s);
    return { ok: true };
  };

  const logout = () => setSession(null);

  return (
    <StoreContext.Provider
      value={{ db, session, add, update, remove, getOne, signup, login, logout }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};