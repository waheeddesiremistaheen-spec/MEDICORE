import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import Field from '../components/Field';
import Empty from '../components/Empty';


export default function AppointmentForm() {
  const { db, add } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientId: '', doctorId: '', date: '', time: '', notes: '',
  });
  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (db.patients.length === 0 || db.doctors.length === 0) {
    return (
      <>
        <h1>Book Appointment</h1>
        <Empty text="Add at least one patient and one doctor first." />
      </>
    );
  }

  const submit = e => {
    e.preventDefault();
    if (!form.patientId || !form.doctorId || !form.date) return;
    add('appointments', { ...form, status: 'Scheduled' });
    navigate('/appointments');
  };

  return (
    <>
      <h1>Book Appointment</h1>
      <form onSubmit={submit} className="card" style={{ maxWidth: 560 }}>
        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{ display: 'block', fontSize: 12, textTransform: 'uppercase',
                         letterSpacing: .6, color: 'var(--muted)', marginBottom: 6 }}>
            Patient
          </span>
          <select name="patientId" value={form.patientId} onChange={set} required>
            <option value="">Select patient</option>
            {db.patients.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{ display: 'block', fontSize: 12, textTransform: 'uppercase',
                         letterSpacing: .6, color: 'var(--muted)', marginBottom: 6 }}>
            Doctor
          </span>
          <select name="doctorId" value={form.doctorId} onChange={set} required>
            <option value="">Select doctor</option>
            {db.doctors.map(d => (
              <option key={d.id} value={d.id}>
                Dr. {d.name} — {d.specialty}
              </option>
            ))}
          </select>
        </label>

        <Field label="Date" name="date" type="date"
               value={form.date} onChange={set} required />
        <Field label="Time" name="time" type="time"
               value={form.time} onChange={set} />
        <Field label="Notes" name="notes" as="textarea"
               value={form.notes} onChange={set} />

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit">Book</button>
          <button type="button" className="ghost"
                  onClick={() => navigate('/appointments')}>Cancel</button>
        </div>
      </form>
    </>
  );

}