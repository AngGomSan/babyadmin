import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setValid(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setDone(true);
      setTimeout(() => navigate('/'), 2000);
    }
  };

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <p className="text-muted-foreground">Invalid or expired reset link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm space-y-6 text-center fade-in">
        <h1 className="text-xl font-bold text-foreground">Set new password</h1>
        {done ? (
          <div className="space-y-2">
            <CheckCircle className="w-10 h-10 text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">Password updated. Redirecting…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 h-12"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-primary text-primary-foreground">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
