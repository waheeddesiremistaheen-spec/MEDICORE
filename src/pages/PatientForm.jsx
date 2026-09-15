import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import Field from '../components/Field';

const blank = {
  name: '', age: '', gender: 'Female', phone: '',
  bloodGroup: '', address: '', condition: '',
};

export default function PatientForm() {
  const { id } = useParams();
  const { add, update, getOne } = useStore();
  const navigate = useNavigate();
  const existing = id ? getOne('patients', id) : null;

  const [form, setForm] = useState(existing || blank);
  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    if (id) update('patients', id, form);
    else add('patients', form);

    navigate('/patients');
  };

  return (
    <>
      <h1>{id ? 'Edit Patient' : 'Register Patient'}</h1>

      <form onSubmit={submit} className="card" style={{ maxWidth: 560 }}>
        <Field label="Full Name" name="name" value={form.name}
               onChange={set} required />
        <Field label="Age" name="age" type="number" value={form.age}
               onChange={set} required />

        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={{ display: 'block', fontSize: 12, textTransform: 'uppercase',
                         letterSpacing: .6, color: 'var(--muted)', marginBottom: 6 }}>
            Gender
          </span>
          <select name="gender" value={form.gender} onChange={set}>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </label>

        <Field label="Phone" name="phone" value={form.phone}
               onChange={set} required />
        <Field label="Blood Group" name="bloodGroup" value={form.bloodGroup}
               onChange={set} />
        <Field label="Condition / Reason" name="condition" value={form.condition}
               onChange={set} />
        <Field label="Address" name="address" as="textarea"
               value={form.address} onChange={set} />

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit">{id ? 'Save Changes' : 'Register'}</button>
          <button type="button" className="ghost"
                  onClick={() => navigate('/patients')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}