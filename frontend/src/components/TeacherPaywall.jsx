import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const TeacherPaywall = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // 1. If user is NOT a teacher, let them pass (This guard only affects teachers)
  if (user?.role !== 'teacher') return <Outlet />;

  // 2. Define the logic: Does the teacher have an active plan?
  const hasPlan = user?.subscription?.plan && user?.subscription?.plan !== 'none';

  if (!hasPlan) {
    // If they are trying to access anything other than 'subscription' or 'settings', block them
    const allowedPaths = ['/dashboard/teacher/subscription', '/dashboard/teacher/settings'];
    const isAllowed = allowedPaths.includes(location.pathname);

    if (!isAllowed) {
        // Redirect them to the pricing page
        return <Navigate to="/dashboard/teacher/subscription" replace />;
    }
  }

  return <Outlet />;
};

export default TeacherPaywall;