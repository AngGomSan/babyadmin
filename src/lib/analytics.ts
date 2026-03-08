import { supabase } from '@/integrations/supabase/client';

type AnalyticsEvent =
  | { name: 'account_created' }
  | { name: 'due_date_set' }
  | { name: 'task_completed'; data: { task_id: string } }
  | { name: 'baby_marked_born' };

export async function trackEvent(event: AnalyticsEvent) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('analytics_events' as any).insert({
    user_id: user.id,
    event_name: event.name,
    event_data: 'data' in event ? event.data : {},
  });
}
