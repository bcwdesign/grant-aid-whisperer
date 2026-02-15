
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  org_type TEXT,
  mission TEXT,
  location_country TEXT,
  location_state TEXT,
  location_city TEXT,
  annual_budget_range TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orgs" ON public.organizations FOR SELECT USING (auth.uid() = owner_user_id);
CREATE POLICY "Users can insert own orgs" ON public.organizations FOR INSERT WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "Users can update own orgs" ON public.organizations FOR UPDATE USING (auth.uid() = owner_user_id);
CREATE POLICY "Users can delete own orgs" ON public.organizations FOR DELETE USING (auth.uid() = owner_user_id);

-- Grant sources table
CREATE TABLE public.grant_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.grant_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own org sources" ON public.grant_sources FOR ALL
  USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_user_id = auth.uid()));

-- Grants table
CREATE TABLE public.grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  external_id TEXT,
  grant_title TEXT NOT NULL,
  funder_name TEXT,
  program_name TEXT,
  summary TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  geographic_eligibility TEXT,
  eligible_applicants TEXT[] DEFAULT '{}',
  funding_amount_json JSONB,
  funding_type TEXT,
  number_of_awards INT,
  status TEXT DEFAULT 'unknown',
  open_date DATE,
  deadline_date DATE,
  deadline_time TEXT,
  timezone TEXT,
  rolling_deadline BOOLEAN DEFAULT false,
  info_session_dates DATE[],
  award_announcement_date DATE,
  project_start_date DATE,
  project_end_date DATE,
  date_confidence TEXT DEFAULT 'unknown',
  deadline_raw_text TEXT,
  application_url TEXT,
  source_url TEXT,
  source_domain TEXT,
  requirements TEXT,
  documents TEXT,
  last_verified_date DATE,
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  is_stale BOOLEAN DEFAULT false,
  needs_review BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, source_url)
);
ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own org grants" ON public.grants FOR ALL
  USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_user_id = auth.uid()));

-- Saved grants (pipeline)
CREATE TABLE public.saved_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  grant_id UUID NOT NULL REFERENCES public.grants(id) ON DELETE CASCADE,
  pipeline_status TEXT NOT NULL DEFAULT 'not_started',
  priority_score NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, grant_id)
);
ALTER TABLE public.saved_grants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own saved grants" ON public.saved_grants FOR ALL
  USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_user_id = auth.uid()));

-- Tasks
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  saved_grant_id UUID REFERENCES public.saved_grants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'todo',
  assigned_to_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own org tasks" ON public.tasks FOR ALL
  USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_user_id = auth.uid()));

-- Notification settings
CREATE TABLE public.notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE UNIQUE,
  email_enabled BOOLEAN DEFAULT true,
  remind_days_before INT[] DEFAULT '{14,7,3,1}',
  daily_digest BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own notification settings" ON public.notification_settings FOR ALL
  USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_user_id = auth.uid()));

-- Agent runs
CREATE TABLE public.agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  run_type TEXT NOT NULL DEFAULT 'manual',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running',
  sources_count INT DEFAULT 0,
  grants_found INT DEFAULT 0,
  errors_json JSONB DEFAULT '[]',
  raw_response_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own agent runs" ON public.agent_runs FOR ALL
  USING (organization_id IN (SELECT id FROM public.organizations WHERE owner_user_id = auth.uid()));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_grant_sources_updated_at BEFORE UPDATE ON public.grant_sources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_grants_updated_at BEFORE UPDATE ON public.grants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_saved_grants_updated_at BEFORE UPDATE ON public.saved_grants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON public.notification_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
