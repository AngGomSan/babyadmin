import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Index() {
  const { user, loading: authLoading } = useAuth();
  const { state, loading: appLoading } = useApp();

  if (authLoading || appLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!state.onboardingComplete) {
    return <Onboarding />;
  }

  return <Dashboard />;
}
