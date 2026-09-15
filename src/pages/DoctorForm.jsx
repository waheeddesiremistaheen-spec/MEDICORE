import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import Field from '../components/Field';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const blank = {
  name: '',
  specialty: 'General Medicine',
  qualification: '',
  phone: '',
  email: '',
  fee: '',
  availableDays: [],
  status: 'Available',
};

const SPECIALTIES = [
  'General Medicine',
  'Cardiology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Neurology',
  'Gynecology',
  'ENT',
];

export default function DoctorForm() {
  const { id } = useParams();
  const { add, update, getOne } = useStore();
  const navigate = useNavigate();
  const existing = id ? getOne('doctors', id) : null;

  const [form, setForm] = useState(existing || blank);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleDay = day => {
    const has = form.availableDays.includes(day);
    setForm({
      ...form,
      availableDays: has
        ? form.availableDays.filter(d => d !== day)
        : [...form.availableDays, day],
    });
  };

  const submit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    if (id) update('doctors', id, form);
    else add('doctors', form);

    navigate('/doctors');
  };

  return (
    <>
      <h1 style={{ marginTop: 0 }}>{id ? 'Edit Doctor' : 'Add Doctor'}</h1>

      <form onSubmit={submit} className="card" style={{ maxWidth: 620 }}>
        <Field
          label="Full Name"
          name="name"
          value={form.name}
          onChange={set}
          placeholder="Dr. Jane Okafor"
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <label style={{ display: 'block', marginBottom: 16 }}>
            <span style={{
              display: 'block', fontSize: 12, textTransform: 'uppercase',
              letterSpacing: 0.6, color: 'var(--muted)', marginBottom: 6,
            }}>
              Specialty
            </span>
            <select name="specialty" value={form.specialty} onChange={set}>
              {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </label>

          <Field
            label="Consultation Fee"
            name="fee"
            type="number"
            value={form.fee}
            onChange={set}
            placeholder="5000"
          />
        </div>

        <Field
          label="Qualification"
          name="qualification"
          value={form.qualification}
          onChange={set}
          placeholder="MBBS, MD"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={set}
            required
          />
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={set}
          />
        </div>

        {/* availability */}
        <div style={{ marginBottom: 20 }}>
          <span style={{
            display: 'block', fontSize: 12, textTransform: 'uppercase',
            letterSpacing: 0.6, color: 'var(--muted)', marginBottom: 8,
          }}>
            Available Days
          </span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {DAYS.map(day => {
              const on = form.availableDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  style={{
                    padding: '7px 14px',
                    fontSize: 13,
                    background: on ? 'var(--teal)' : 'transparent',
                    color: on ? 'var(--paper)' : 'var(--navy)',
                    border: '1px solid ' + (on ? 'var(--teal)' : 'var(--line)'),
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* status */}
        <div style={{ marginBottom: 20 }}>
          <span style={{
            display: 'block', fontSize: 12, textTransform: 'uppercase',
            letterSpacing: 0.6, color: 'var(--muted)', marginBottom: 8,
          }}>
            Status
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Available', 'On Leave'].map(s => {
              const on = form.status === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, status: s })}
                  style={{
                    padding: '7px 16px',
                    fontSize: 13,
                    background: on ? 'var(--teal)' : 'transparent',
                    color: on ? 'var(--paper)' : 'var(--navy)',
                    border: '1px solid ' + (on ? 'var(--teal)' : 'var(--line)'),
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit">{id ? 'Save Changes' : 'Add Doctor'}</button>
          <button
            type="button"
            className="ghost"
            onClick={() => navigate('/doctors')}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}