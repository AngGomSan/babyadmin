import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Mail, Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'forgot') {
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) {
        toast({ title: 'Something went wrong', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Check your email', description: 'We sent you a password reset link.' });
        setMode('login');
      }
      return;
    }

    const fn = mode === 'login' ? signIn : signUp;
    const { error } = await fn(email, password);
    setLoading(false);

    if (error) {
      toast({ title: 'Something went wrong', description: error.message, variant: 'destructive' });
    } else if (mode === 'signup') {
      toast({ title: 'Account created', description: 'Check your email to confirm your account.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm space-y-8 text-center fade-in">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">BabyAdmin</h1>
          <p className="text-sm text-muted-foreground">Your guide to pregnancy admin in Germany</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Reset password'}
          </h2>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>

          {mode !== 'forgot' && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 h-12"
                required
                minLength={6}
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-primary text-primary-foreground font-medium"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Log in' : mode === 'signup' ? 'Create account' : 'Send reset link'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="space-y-2 text-sm">
          {mode === 'login' && (
            <>
              <button onClick={() => setMode('forgot')} className="text-muted-foreground hover:text-foreground transition-colors block mx-auto">
                Forgot password?
              </button>
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-primary hover:underline font-medium">
                  Sign up
                </button>
              </p>
            </>
          )}
          {mode === 'signup' && (
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-primary hover:underline font-medium">
                Log in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <button onClick={() => setMode('login')} className="text-muted-foreground hover:text-foreground transition-colors">
              Back to login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
