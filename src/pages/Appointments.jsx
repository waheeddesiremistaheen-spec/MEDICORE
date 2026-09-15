import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import Empty from '../components/Empty';

const today = () => new Date().toISOString().slice(0, 10);

const STATUSES = ['Scheduled', 'Completed', 'Cancelled'];

const formatDate = iso => {
  if (!iso) return 'No date';
  const d = new Date(iso + 'T00:00:00');
  const t = today();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  if (iso === t) return 'Today';
  if (iso === tomorrow) return 'Tomorrow';
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  });
};

export default function Appointments() {
  const { db, update, remove } = useStore();
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const nameOf = (collection, id) =>
    db[collection].find(r => r.id === id)?.name || 'Removed';

  const doctorOf = id => {
    const d = db.doctors.find(r => r.id === id);
    return d ? `Dr. ${d.name.replace(/^Dr\.?\s*/i, '')}` : 'Removed';
  };

  const filtered = db.appointments.filter(a => {
    if (filter !== 'All' && (a.status || 'Scheduled') !== filter) return false;
    if (!q.trim()) return true;
    const needle = q.toLowerCase();
    return (
      nameOf('patients', a.patientId).toLowerCase().includes(needle) ||
      doctorOf(a.doctorId).toLowerCase().includes(needle)
    );
  });

  // group by date string
  const grouped = filtered.reduce((acc, a) => {
    const key = a.date || 'no-date';
    (acc[key] ||= []).push(a);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => {
    if (a === 'no-date') return 1;
    if (b === 'no-date') return -1;
    return b.localeCompare(a); // newest first
  });

  const setStatus = (id, status) => update('appointments', id, { status });

  const cycleStatus = current => {
    const i = STATUSES.indexOf(current || 'Scheduled');
    return STATUSES[(i + 1) % STATUSES.length];
  };

  const counts = {
    All: db.appointments.length,
    Scheduled: db.appointments.filter(a => (a.status || 'Scheduled') === 'Scheduled').length,
    Completed: db.appointments.filter(a => a.status === 'Completed').length,
    Cancelled: db.appointments.filter(a => a.status === 'Cancelled').length,
  };

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <h1 style={{ margin: 0 }}>Appointments</h1>
        <Link to="/appointments/new"><button>+ Book</button></Link>
      </div>

      {/* filter bar */}
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 24,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <input
          placeholder="Search patient or doctor"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            style={{
              padding: '7px 14px',
              fontSize: 13,
              background: filter === s ? 'var(--teal)' : 'transparent',
              color: filter === s ? 'var(--paper)' : 'var(--navy)',
              border: '1px solid ' + (filter === s ? 'var(--teal)' : 'var(--line)'),
            }}
          >
            {s}
            <span style={{
              marginLeft: 8,
              opacity: 0.7,
              fontSize: 11,
            }}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {sortedDates.length === 0
        ? <Empty text="No appointments match this filter." />
        : sortedDates.map(dateKey => (
          <section key={dateKey} style={{ marginBottom: 28 }}>
            {/* date header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 12,
            }}>
              <h2 style={{
                margin: 0,
                fontSize: 14,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                color: dateKey === today() ? 'var(--teal)' : 'var(--navy)',
              }}>
                {dateKey === 'no-date' ? 'No Date Set' : formatDate(dateKey)}
              </h2>
              <div style={{
                flex: 1,
                height: 1,
                background: 'var(--line)',
              }} />
              <span style={{
                fontSize: 12,
                color: 'var(--muted)',
              }}>
                {grouped[dateKey].length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {grouped[dateKey]
                .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
                .map(a => {
                  const status = a.status || 'Scheduled';
                  const isCancelled = status === 'Cancelled';
                  return (
                    <div
                      key={a.id}
                      className="card"
                      style={{
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        opacity: isCancelled ? 0.55 : 1,
                      }}
                    >
                      {/* time column */}
                      <div style={{
                        flexShrink: 0,
                        width: 72,
                        textAlign: 'center',
                        paddingRight: 16,
                        borderRight: '1px solid var(--line)',
                      }}>
                        <div style={{
                          fontSize: 15,
                          fontWeight: 500,
                          color: 'var(--teal)',
                        }}>
                          {a.time || '—'}
                        </div>
                        <div style={{
                          fontSize: 11,
                          color: 'var(--muted)',
                          marginTop: 2,
                        }}>
                          {a.time ? 'hrs' : 'all day'}
                        </div>
                      </div>

                      {/* main info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 500,
                          fontSize: 15,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {nameOf('patients', a.patientId)}
                        </div>
                        <div style={{
                          fontSize: 13,
                          color: 'var(--muted)',
                          marginTop: 3,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {doctorOf(a.doctorId)}
                          {a.notes ? ` · ${a.notes}` : ''}
                        </div>
                      </div>

                      {/* status pill — click to cycle */}
                      <button
                        type="button"
                        onClick={() => setStatus(a.id, cycleStatus(status))}
                        title="Click to change status"
                        style={{
                          flexShrink: 0,
                          padding: '5px 12px',
                          fontSize: 11,
                          letterSpacing: 0.4,
                          textTransform: 'uppercase',
                          borderRadius: 12,
                          background:
                            status === 'Scheduled' ? 'var(--teal)' :
                            status === 'Completed' ? 'var(--navy)' :
                            'transparent',
                          color:
                            status === 'Scheduled' || status === 'Completed'
                              ? 'var(--paper)'
                              : 'var(--muted)',
                          border: '1px solid ' +
                            (status === 'Cancelled' ? 'var(--line)' : 'transparent'),
                        }}
                      >
                        {status}
                      </button>

                      {/* actions */}
                      <div style={{
                        flexShrink: 0,
                        display: 'flex',
                        gap: 12,
                        fontSize: 13,
                      }}>
                        <Link
                          to={`/patients/${a.patientId}`}
                          style={{ color: 'var(--teal)', textDecoration: 'none' }}
                        >
                          Patient
                        </Link>
                        <span
                          onClick={() => remove('appointments', a.id)}
                          style={{ color: 'var(--muted)', cursor: 'pointer' }}
                        >
                          Delete
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        ))}
    </>
  );
}