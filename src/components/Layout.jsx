import { NavLink, Outlet } from 'react-router-dom';
import { useStore } from '../store';

const links = [
  ['/', 'Dashboard'],
  ['/patients', 'Patients'],
  ['/doctors', 'Doctors'],
  ['/appointments', 'Appointments'],
  ['/records', 'Records'],
];

export default function Layout() {
  const { db } = useStore();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: 220,
        background: 'var(--navy)',
        color: 'var(--paper)',
        padding: '24px 16px',
        flexShrink: 0,
      }}>
        <h2 style={{ fontSize: 16, letterSpacing: 1, margin: '0 0 28px 8px' }}>
          MEDICORE
        </h2>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                padding: '9px 12px',
                borderRadius: 6,
                textDecoration: 'none',
                fontSize: 14,
                color: isActive ? 'var(--navy)' : 'var(--paper)',
                background: isActive ? 'var(--paper)' : 'transparent',
                opacity: isActive ? 1 : 0.75,
              })}
            >
              {label}
              {to === '/appointments' && db.appointments.length > 0 && (
                <span style={{
                  float: 'right',
                  background: 'var(--teal)',
                  color: 'var(--paper)',
                  borderRadius: 10,
                  padding: '1px 7px',
                  fontSize: 11,
                }}>
                  {db.appointments.length}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 32, maxWidth: 1100 }}>
        <Outlet />
      </main>
    </div>
  );
}