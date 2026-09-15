import { createContext, useContext, useState, useEffect } from 'react';

const KEY = 'hms-v1';
const StoreContext = createContext(null);

const empty = { patients: [], doctors: [], appointments: [], records: [] };

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function StoreProvider({ children }) {
  const [db, setDb] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || empty;
    } catch {
      return empty;
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(db));
  }, [db]);

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

  return (
    <StoreContext.Provider value={{ db, add, update, remove, getOne }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};