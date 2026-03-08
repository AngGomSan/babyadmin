
CREATE VIEW public.user_task_completion_stats AS
SELECT
  user_id,
  count(*)::int AS tasks_completed_count,
  min(created_at) AS first_task_completed_at,
  max(created_at) AS last_task_completed_at
FROM public.analytics_events
WHERE event_name = 'task_completed'
GROUP BY user_id;
