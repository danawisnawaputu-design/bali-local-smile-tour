-- Run this in Supabase SQL Editor using a project owner account.

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamp with time zone DEFAULT now()
);

INSERT INTO public.admin_users (id, email)
SELECT id, email
FROM auth.users
WHERE lower(email) = lower('usersedangpusing@gmail.com')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id = auth.uid() AND (
    EXISTS (
      SELECT 1 FROM public.admin_users WHERE id = user_id
    )
    OR lower(COALESCE(auth.jwt() ->> 'email', '')) = lower('usersedangpusing@gmail.com')
  );
$$;

ALTER TABLE public.activities
ADD COLUMN IF NOT EXISTS price text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('tours-images', 'tours-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can read tour images" ON storage.objects;
CREATE POLICY "Public can read tour images" ON storage.objects
FOR SELECT USING (bucket_id = 'tours-images');

DROP POLICY IF EXISTS "Authenticated admins can upload tour images" ON storage.objects;
CREATE POLICY "Authenticated admins can upload tour images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'tours-images'
  AND auth.role() = 'authenticated'
  AND public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Authenticated admins can delete tour images" ON storage.objects;
CREATE POLICY "Authenticated admins can delete tour images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'tours-images'
  AND auth.role() = 'authenticated'
  AND public.is_admin(auth.uid())
);
