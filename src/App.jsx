import { Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import Doctors from './pages/Doctors';
import DoctorForm from './pages/DoctorForm';
import Appointments from './pages/Appointments';
import AppointmentForm from './pages/AppointmentForm';
import Records from './pages/Records';
import RecordForm from './pages/RecordForm';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients/:id" element={<PatientForm />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/new" element={<DoctorForm />} />
          <Route path="/doctors/:id" element={<DoctorForm />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointments/new" element={<AppointmentForm />} />
          <Route path="/records" element={<Records />} />
          <Route path="/records/new" element={<RecordForm />} />
          <Route path="/records/:id" element={<RecordForm />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}