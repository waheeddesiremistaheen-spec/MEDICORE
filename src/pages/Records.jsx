import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import Empty from '../components/Empty';

const formatDate = iso => {
  if (!iso) return '—';
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function Records() {
  const { db, remove } = useStore();
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState(null);

  const nameOf = (collection, id) =>
    db[collection].find(r => r.id === id)?.name || null;

  // group records by patient
  const grouped = db.records.reduce((acc, r) => {
    (acc[r.patientId] ||= []).push(r);
    return acc;
  }, {});

  // sort each patient's records newest-first
  Object.values(grouped).forEach(list =>
    list.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  );

  // patient rows, sorted by patient name
  const rows = Object.entries(grouped)
    .map(([patientId, records]) => ({
      patientId,
      records,
      name: nameOf('patients', patientId) || 'Removed Patient',
    }))
    .filter(({ name }) => name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const orphanCount = db.records.filter(
    r => !db.patients.find(p => p.id === r.patientId)
  ).length;

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <h1 style={{ margin: 0 }}>Hospital Records</h1>
        <Link to="/records/new"><button>+ New Record</button></Link>
      </div>

      <input
        placeholder="Search by patient name"
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{ marginBottom: 20, maxWidth: 320 }}
      />

      {rows.length === 0
        ? <Empty text="No records yet." />
        : rows.map(({ patientId, records, name }) => {
          const isOpen = expanded === patientId || rows.length <= 3;
          const latest = records[0];

          return (
            <div
              key={patientId}
              className="card"
              style={{ marginBottom: 12, padding: 0, overflow: 'hidden' }}
            >
              {/* patient header — click to toggle */}
              <div
                onClick={() =>
                  setExpanded(expanded === patientId ? null : patientId)
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  cursor: 'pointer',
                  borderBottom: isOpen ? '1px solid var(--line)' : 'none',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 15 }}>
                    {name}
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'var(--muted)',
                    marginTop: 3,
                  }}>
                    {records.length} {records.length === 1 ? 'record' : 'records'}
                    {latest?.diagnosis ? ` · Last: ${latest.diagnosis}` : ''}
                  </div>
                </div>

                <span style={{
                  fontSize: 11,
                  color: 'var(--muted)',
                  flexShrink: 0,
                  marginLeft: 12,
                }}>
                  {isOpen ? 'Hide' : 'Show'}
                </span>
              </div>

              {/* records table */}
              {isOpen && (
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 13,
                }}>
                  <thead>
                    <tr style={{
                      background: 'rgba(31,59,87,0.04)',
                      textAlign: 'left',
                    }}>
                      {['Date', 'Doctor', 'Diagnosis', 'Prescription', ''].map(h => (
                        <th key={h} style={{
                          padding: '9px 20px',
                          fontSize: 11,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          color: 'var(--muted)',
                          fontWeight: 500,
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(r => {
                      const doctorName = nameOf('doctors', r.doctorId);
                      return (
                        <tr
                          key={r.id}
                          style={{ borderTop: '1px solid var(--line)' }}
                        >
                          <td style={{
                            padding: '11px 20px',
                            whiteSpace: 'nowrap',
                            color: 'var(--teal)',
                          }}>
                            {formatDate(r.date)}
                          </td>
                          <td style={{ padding: '11px 20px', whiteSpace: 'nowrap' }}>
                            {doctorName
                              ? `Dr. ${doctorName.replace(/^Dr\.?\s*/i, '')}`
                              : '—'}
                          </td>
                          <td style={{ padding: '11px 20px' }}>
                            {r.diagnosis || '—'}
                          </td>
                          <td style={{
                            padding: '11px 20px',
                            color: 'var(--muted)',
                            maxWidth: 220,
                          }}>
                            {r.prescription
                              ? r.prescription.split('\n')[0]
                              : '—'}
                            {r.prescription && r.prescription.includes('\n') && ' …'}
                          </td>
                          <td style={{
                            padding: '11px 20px',
                            textAlign: 'right',
                            whiteSpace: 'nowrap',
                          }}>
                            <Link
                              to={`/records/${r.id}`}
                              style={{
                                color: 'var(--teal)',
                                textDecoration: 'none',
                                marginRight: 14,
                              }}
                            >
                              Edit
                            </Link>
                            <span
                              onClick={() => remove('records', r.id)}
                              style={{ color: 'var(--muted)', cursor: 'pointer' }}
                            >
                              Delete
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}

      {orphanCount > 0 && (
        <p style={{
          fontSize: 12,
          color: 'var(--muted)',
          marginTop: 16,
        }}>
          {orphanCount} record{orphanCount === 1 ? '' : 's'} reference deleted
          patients and are not shown.
        </p>
      )}
    </>
  );
}