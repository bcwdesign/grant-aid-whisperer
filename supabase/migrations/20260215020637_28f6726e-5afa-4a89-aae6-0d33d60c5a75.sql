
-- Update handle_new_user to also create a default organization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');

  INSERT INTO public.organizations (owner_user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'org_name', 'My Organization'));

  RETURN NEW;
END;
$$;
