import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import Empty from '../components/Empty';

const initials = name =>
  name.replace(/^Dr\.?\s*/i, '')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function Doctors() {
  const { db, remove } = useStore();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');

  const specialties = ['All', ...new Set(db.doctors.map(d => d.specialty))];

  const list = db.doctors.filter(d => {
    const matchesQ =
      d.name.toLowerCase().includes(q.toLowerCase()) ||
      d.specialty.toLowerCase().includes(q.toLowerCase());
    const matchesFilter = filter === 'All' || d.specialty === filter;
    return matchesQ && matchesFilter;
  });

  // count appointments per doctor, useful context
  const apptCount = id =>
    db.appointments.filter(a => a.doctorId === id).length;

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <h1 style={{ margin: 0 }}>Doctors</h1>
        <Link to="/doctors/new"><button>+ Add Doctor</button></Link>
      </div>

      {/* filters */}
      <div style={{
        display: 'flex',
        gap: 10,
        marginBottom: 20,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <input
          placeholder="Search by name or specialty"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ maxWidth: 300 }}
        />
        {specialties.map(s => (
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
          </button>
        ))}
      </div>

      {list.length === 0
        ? <Empty text="No doctors match this search." />
        : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}>
            {list.map(d => {
              const onLeave = d.status === 'On Leave';
              return (
                <div key={d.id} className="card" style={{ padding: 20 }}>

                  {/* header row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    marginBottom: 16,
                  }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'var(--navy)',
                      color: 'var(--paper)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 15,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}>
                      {initials(d.name)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontWeight: 500,
                        fontSize: 15,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        Dr. {d.name.replace(/^Dr\.?\s*/i, '')}
                      </div>
                      <div style={{
                        fontSize: 13,
                        color: 'var(--teal)',
                        marginTop: 2,
                      }}>
                        {d.specialty}
                      </div>
                      {d.qualification && (
                        <div style={{
                          fontSize: 12,
                          color: 'var(--muted)',
                          marginTop: 4,
                        }}>
                          {d.qualification}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* details */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    fontSize: 13,
                    marginBottom: 14,
                    paddingBottom: 14,
                    borderBottom: '1px solid var(--line)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>Phone</span>
                      <span>{d.phone}</span>
                    </div>
                    {d.email && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <span style={{ color: 'var(--muted)', flexShrink: 0 }}>Email</span>
                        <span style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {d.email}
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>Fee</span>
                      <span>{d.fee ? `₦${d.fee}` : '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>Appointments</span>
                      <span>{apptCount(d.id)}</span>
                    </div>
                  </div>

                  {/* availability strip */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: 0.6,
                      color: 'var(--muted)',
                      marginBottom: 6,
                    }}>
                      Available
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                        const on = (d.availableDays || []).includes(day);
                        return (
                          <div
                            key={day}
                            style={{
                              flex: 1,
                              textAlign: 'center',
                              fontSize: 10,
                              padding: '4px 0',
                              borderRadius: 4,
                              background: on ? 'var(--teal)' : 'transparent',
                              color: on ? 'var(--paper)' : 'var(--muted)',
                              border: '1px solid ' + (on ? 'var(--teal)' : 'var(--line)'),
                            }}
                          >
                            {day[0]}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: 11,
                      padding: '3px 10px',
                      borderRadius: 10,
                      border: '1px solid ' + (onLeave ? 'var(--line)' : 'var(--teal)'),
                      color: onLeave ? 'var(--muted)' : 'var(--teal)',
                    }}>
                      {d.status || 'Available'}
                    </span>

                    <div style={{ display: 'flex', gap: 14, fontSize: 13 }}>
                      <Link
                        to={`/doctors/${d.id}`}
                        style={{ color: 'var(--teal)', textDecoration: 'none' }}
                      >
                        Edit
                      </Link>
                      <span
                        onClick={() => remove('doctors', d.id)}
                        style={{ color: 'var(--muted)', cursor: 'pointer' }}
                      >
                        Delete
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
    </>
  );
}