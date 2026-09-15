import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import Empty from '../components/Empty';

export default function Patients() {
  const { db, remove } = useStore();
  const [q, setQ] = useState('');

  const list = db.patients.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.phone.includes(q)
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Patients</h1>
        <Link to="/patients/new"><button>+ Register Patient</button></Link>
      </div>

      <input
        placeholder="Search by name or phone"
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{ marginBottom: 20, maxWidth: 320 }}
      />

      {list.length === 0
        ? <Empty text="No patients yet." />
        : (
          <table style={{ width: '100%', borderCollapse: 'collapse',
                          background: 'var(--paper)', borderRadius: 8,
                          overflow: 'hidden', border: '1px solid var(--line)' }}>
            <thead>
              <tr style={{ background: 'rgba(31,59,87,0.05)', textAlign: 'left' }}>
                {['Name', 'Age', 'Gender', 'Phone', 'Blood', ''].map(h => (
                  <th key={h} style={{ padding: '12px 14px', fontSize: 12,
                                       textTransform: 'uppercase',
                                       color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--line)' }}>
                  <td style={{ padding: '12px 14px' }}>{p.name}</td>
                  <td style={{ padding: '12px 14px' }}>{p.age}</td>
                  <td style={{ padding: '12px 14px' }}>{p.gender}</td>
                  <td style={{ padding: '12px 14px' }}>{p.phone}</td>
                  <td style={{ padding: '12px 14px' }}>{p.bloodGroup || '—'}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <Link to={`/patients/${p.id}`} style={{ color: 'var(--teal)', marginRight: 14 }}>
                      Edit
                    </Link>
                    <span
                      onClick={() => remove('patients', p.id)}
                      style={{ color: 'var(--muted)', cursor: 'pointer' }}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </>
  );
}