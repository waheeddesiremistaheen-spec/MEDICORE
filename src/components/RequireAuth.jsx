import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../store';

export default function RequireAuth() {
  const { session } = useStore();
  if (!session) return <Navigate to="/" replace />;
  return <Outlet />;
}