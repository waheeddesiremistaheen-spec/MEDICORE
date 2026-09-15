import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import Field from '../components/Field';
import Empty from '../components/Empty';

const blank = {
  patientId: '',
  doctorId: '',
  date: new Date().toISOString().slice(0, 10),
  diagnosis: '',
  prescription: '',
  notes: '',
};

export default function RecordForm() {
  const { id } = useParams();
  const { db, add, update, getOne } = useStore();
  const navigate = useNavigate();
  const existing = id ? getOne('records', id) : null;

  const [form, setForm] = useState(existing || blank);
  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (db.patients.length === 0) {
    return (
      <>
        <h1 style={{ marginTop: 0 }}>New Record</h1>
        <Empty text="Register at least one patient first." />
      </>
    );
  }

  const submit = e => {
    e.preventDefault();
    if (!form.patientId || !form.diagnosis.trim()) return;

    if (id) update('records', id, form);
    else add('records', form);

    navigate('/records');
  };

  return (
    <>
      <h1 style={{ marginTop: 0 }}>{id ? 'Edit Record' : 'New Record'}</h1>

      <form onSubmit={submit} className="card" style={{ maxWidth: 620 }}>
        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{
            display: 'block', fontSize: 12, textTransform: 'uppercase',
            letterSpacing: 0.6, color: 'var(--muted)', marginBottom: 6,
          }}>
            Patient
          </span>
          <select
            name="patientId"
            value={form.patientId}
            onChange={set}
            required
          >
            <option value="">Select patient</option>
            {db.patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{
            display: 'block', fontSize: 12, textTransform: 'uppercase',
            letterSpacing: 0.6, color: 'var(--muted)', marginBottom: 6,
          }}>
            Attending Doctor
          </span>
          <select name="doctorId" value={form.doctorId} onChange={set}>
            <option value="">— None —</option>
            {db.doctors.map(d => (
              <option key={d.id} value={d.id}>
                Dr. {d.name.replace(/^Dr\.?\s*/i, '')} — {d.specialty}
              </option>
            ))}
          </select>
        </label>

        <Field
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={set}
          required
        />

        <Field
          label="Diagnosis"
          name="diagnosis"
          value={form.diagnosis}
          onChange={set}
          placeholder="e.g. Acute bronchitis"
          required
        />

        <Field
          label="Prescription"
          name="prescription"
          as="textarea"
          value={form.prescription}
          onChange={set}
          placeholder="One line per medication, with dose and duration"
        />

        <Field
          label="Clinical Notes"
          name="notes"
          as="textarea"
          value={form.notes}
          onChange={set}
        />

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit">{id ? 'Save Changes' : 'Save Record'}</button>
          <button
            type="button"
            className="ghost"
            onClick={() => navigate('/records')}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}