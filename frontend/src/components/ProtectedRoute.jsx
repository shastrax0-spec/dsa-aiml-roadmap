import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/useAuth';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Loading...</div>;
  return token ? children : <Navigate to="/login" replace />;
}
