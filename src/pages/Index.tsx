import { useApp } from '@/contexts/AppContext';
import Onboarding from '@/components/Onboarding';
import Dashboard from '@/components/Dashboard';

export default function Index() {
  const { state } = useApp();

  if (!state.onboardingComplete) {
    return <Onboarding />;
  }

  return <Dashboard />;
}
