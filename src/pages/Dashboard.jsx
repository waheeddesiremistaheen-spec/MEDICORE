import { Link } from 'react-router-dom';
import { useStore } from '../store';
import Empty from '../components/Empty';

const today = () => new Date().toISOString().slice(0, 10);

export default function Dashboard() {
  const { db } = useStore();

  const stats = [
    ['Patients',     db.patients.length,     '/patients'],
    ['Doctors',      db.doctors.length,      '/doctors'],
    ['Appointments', db.appointments.length, '/appointments'],
    ['Records',      db.records.length,      '/records'],
  ];

  const nameOf = (collection, id) =>
    db[collection].find(r => r.id === id)?.name || 'Removed';

  const todays = db.appointments
    .filter(a => a.date === today())
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  const recent = [...db.patients]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 5);

  const initials = name =>
    name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>

      {/* stat tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 28,
      }}>
        {stats.map(([label, value, to]) => (
          <Link key={label} to={to} style={{ textDecoration: 'none' }}>
            <div className="card">
              <div style={{
                fontSize: 32,
                fontWeight: 600,
                color: 'var(--teal)',
                lineHeight: 1.1,
              }}>
                {value}
              </div>
              <div style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                color: 'var(--muted)',
                marginTop: 6,
              }}>
                {label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* two column area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: 20,
      }}>

        {/* today's appointments */}
        <section className="card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 16,
          }}>
            <h2 style={{ margin: 0, fontSize: 16 }}>Today's Appointments</h2>
            <Link to="/appointments/new"
                  style={{ color: 'var(--teal)', fontSize: 13 }}>
              + Book
            </Link>
          </div>

          {todays.length === 0
            ? <Empty text="Nothing scheduled for today." />
            : (
              <div>
                {todays.map(a => (
                  <div key={a.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--line)',
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 500 }}>
                        {nameOf('patients', a.patientId)}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                        with Dr. {nameOf('doctors', a.doctorId)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ color: 'var(--teal)', fontSize: 14 }}>
                        {a.time || 'all day'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                        {a.status || 'Scheduled'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </section>

        {/* recent patients */}
        <section className="card">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 16,
          }}>
            <h2 style={{ margin: 0, fontSize: 16 }}>Recent Patients</h2>
            <Link to="/patients"
                  style={{ color: 'var(--teal)', fontSize: 13 }}>
              View all
            </Link>
          </div>

          {recent.length === 0
            ? <Empty text="No patients registered yet." />
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {recent.map(p => (
                  <Link
                    key={p.id}
                    to={`/patients/${p.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      textDecoration: 'none',
                      color: 'var(--navy)',
                    }}
                  >
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: 'var(--teal)',
                      color: 'var(--paper)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}>
                      {initials(p.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 14,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {p.age} yrs · {p.gender}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
        </section>

      </div>
    </>
  );
}