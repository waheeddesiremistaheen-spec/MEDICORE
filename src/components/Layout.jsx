import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';

const links = [
  ['/dashboard', 'Dashboard'],
  ['/patients', 'Patients'],
  ['/doctors', 'Doctors'],
  ['/appointments', 'Appointments'],
  ['/records', 'Records'],
];

export default function Layout() {
  const { db, session, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // close the drawer whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      {/* mobile top bar */}
      <div className="mobile-bar">
        <button
          className="hamburger"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <span /><span /><span />
        </button>
        <div className="mobile-brand">MEDICORE</div>
        <div className="mobile-spacer" />
      </div>

      {menuOpen && (
        <div className="backdrop" onClick={() => setMenuOpen(false)} />
      )}

      <aside className={'sidebar' + (menuOpen ? ' open' : '')}>
        <div className="sidebar-brand">MEDICORE</div>

        <nav className="sidebar-nav">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' active' : '')
              }
            >
              <span>{label}</span>
              {to === '/appointments' && db.appointments.length > 0 && (
                <span className="nav-badge">{db.appointments.length}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">
            {(session?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-name">{session?.name}</div>
            <div className="user-email">{session?.email}</div>
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}