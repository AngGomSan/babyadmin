
-- Create table for user app state persistence
CREATE TABLE public.user_app_state (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  due_date TEXT,
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  intro_seen BOOLEAN NOT NULL DEFAULT false,
  completed_tasks TEXT[] NOT NULL DEFAULT '{}',
  completed_checklist TEXT[] NOT NULL DEFAULT '{}',
  baby_born BOOLEAN NOT NULL DEFAULT false,
  birth_date TEXT,
  reassurance_dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_app_state ENABLE ROW LEVEL SECURITY;

-- Users can only access their own state
CREATE POLICY "Users can view their own state"
  ON public.user_app_state FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own state"
  ON public.user_app_state FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own state"
  ON public.user_app_state FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_user_app_state_updated_at
  BEFORE UPDATE ON public.user_app_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create state row on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_app_state (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
