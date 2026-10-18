-- ============================================================================
-- SECURE RLS POLICIES - ONLY ADMIN CAN WRITE
-- ============================================================================
-- Jalankan script ini di Supabase SQL Editor untuk production security

-- ============================================
-- CREATE ADMIN HELPER FUNCTION
-- ============================================
-- Fungsi ini mengecek apakah user adalah admin
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

-- Public image URLs are readable; only authenticated admins can manage files.
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
  AND is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Authenticated admins can delete tour images" ON storage.objects;
CREATE POLICY "Authenticated admins can delete tour images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'tours-images'
  AND auth.role() = 'authenticated'
  AND is_admin(auth.uid())
);

-- ============================================
-- DROP OLD POLICIES (jika ada)
-- ============================================
DROP POLICY IF EXISTS "Enable read access for all users" ON tours;
DROP POLICY IF EXISTS "Enable insert access for all users" ON tours;
DROP POLICY IF EXISTS "Enable update access for all users" ON tours;
DROP POLICY IF EXISTS "Enable delete access for all users" ON tours;

-- ============================================
-- NEW SECURE POLICIES - TOURS TABLE
-- ============================================
-- Public: hanya bisa READ
CREATE POLICY "Public can read tours" ON tours 
FOR SELECT USING (true);

-- Authenticated Admin: bisa INSERT
CREATE POLICY "Authenticated admin can insert tours" ON tours 
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' 
  AND is_admin(auth.uid())
);

-- Authenticated Admin: bisa UPDATE
CREATE POLICY "Authenticated admin can update tours" ON tours 
FOR UPDATE USING (
  auth.role() = 'authenticated' 
  AND is_admin(auth.uid())
) WITH CHECK (
  auth.role() = 'authenticated' 
  AND is_admin(auth.uid())
);

-- Authenticated Admin: bisa DELETE
CREATE POLICY "Authenticated admin can delete tours" ON tours 
FOR DELETE USING (
  auth.role() = 'authenticated' 
  AND is_admin(auth.uid())
);

-- ============================================
-- APPLY SAME TO OTHER TABLES
-- ============================================

-- DROP OLD ACTIVITIES POLICIES
DROP POLICY IF EXISTS "Enable read access for all users" ON activities;
DROP POLICY IF EXISTS "Enable insert access for all users" ON activities;
DROP POLICY IF EXISTS "Enable update access for all users" ON activities;
DROP POLICY IF EXISTS "Enable delete access for all users" ON activities;

-- NEW ACTIVITIES POLICIES
CREATE POLICY "Public can read activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Authenticated admin can insert activities" ON activities FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND is_admin(auth.uid()));
CREATE POLICY "Authenticated admin can update activities" ON activities FOR UPDATE USING (auth.role() = 'authenticated' AND is_admin(auth.uid())) WITH CHECK (auth.role() = 'authenticated' AND is_admin(auth.uid()));
CREATE POLICY "Authenticated admin can delete activities" ON activities FOR DELETE USING (auth.role() = 'authenticated' AND is_admin(auth.uid()));

-- DROP OLD DROP_PICKUP POLICIES
DROP POLICY IF EXISTS "Enable read access for all users" ON drop_pickup;
DROP POLICY IF EXISTS "Enable insert access for all users" ON drop_pickup;
DROP POLICY IF EXISTS "Enable update access for all users" ON drop_pickup;
DROP POLICY IF EXISTS "Enable delete access for all users" ON drop_pickup;

-- NEW DROP_PICKUP POLICIES
CREATE POLICY "Public can read drop_pickup" ON drop_pickup FOR SELECT USING (true);
CREATE POLICY "Authenticated admin can insert drop_pickup" ON drop_pickup FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND is_admin(auth.uid()));
CREATE POLICY "Authenticated admin can update drop_pickup" ON drop_pickup FOR UPDATE USING (auth.role() = 'authenticated' AND is_admin(auth.uid())) WITH CHECK (auth.role() = 'authenticated' AND is_admin(auth.uid()));
CREATE POLICY "Authenticated admin can delete drop_pickup" ON drop_pickup FOR DELETE USING (auth.role() = 'authenticated' AND is_admin(auth.uid()));

-- DROP OLD FAST_BOAT POLICIES
DROP POLICY IF EXISTS "Enable read access for all users" ON fast_boat;
DROP POLICY IF EXISTS "Enable insert access for all users" ON fast_boat;
DROP POLICY IF EXISTS "Enable update access for all users" ON fast_boat;
DROP POLICY IF EXISTS "Enable delete access for all users" ON fast_boat;

-- NEW FAST_BOAT POLICIES
CREATE POLICY "Public can read fast_boat" ON fast_boat FOR SELECT USING (true);
CREATE POLICY "Authenticated admin can insert fast_boat" ON fast_boat FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND is_admin(auth.uid()));
CREATE POLICY "Authenticated admin can update fast_boat" ON fast_boat FOR UPDATE USING (auth.role() = 'authenticated' AND is_admin(auth.uid())) WITH CHECK (auth.role() = 'authenticated' AND is_admin(auth.uid()));
CREATE POLICY "Authenticated admin can delete fast_boat" ON fast_boat FOR DELETE USING (auth.role() = 'authenticated' AND is_admin(auth.uid()));

-- DROP OLD NUSA_PENIDA POLICIES
DROP POLICY IF EXISTS "Enable read access for all users" ON nusa_penida;
DROP POLICY IF EXISTS "Enable insert access for all users" ON nusa_penida;
DROP POLICY IF EXISTS "Enable update access for all users" ON nusa_penida;
DROP POLICY IF EXISTS "Enable delete access for all users" ON nusa_penida;

-- NEW NUSA_PENIDA POLICIES
CREATE POLICY "Public can read nusa_penida" ON nusa_penida FOR SELECT USING (true);
CREATE POLICY "Authenticated admin can insert nusa_penida" ON nusa_penida FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND is_admin(auth.uid()));
CREATE POLICY "Authenticated admin can update nusa_penida" ON nusa_penida FOR UPDATE USING (auth.role() = 'authenticated' AND is_admin(auth.uid())) WITH CHECK (auth.role() = 'authenticated' AND is_admin(auth.uid()));
CREATE POLICY "Authenticated admin can delete nusa_penida" ON nusa_penida FOR DELETE USING (auth.role() = 'authenticated' AND is_admin(auth.uid()));

-- ============================================
-- CREATE ADMIN_USERS TABLE (untuk tracking admin)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only admin can read/write admin_users
CREATE POLICY "Only admin can view admin users" ON admin_users FOR SELECT USING (auth.uid() IN (SELECT id FROM admin_users));
CREATE POLICY "Only super admin can manage admin users" ON admin_users FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));
CREATE POLICY "Only super admin can update admin users" ON admin_users FOR UPDATE USING (auth.uid() IN (SELECT id FROM admin_users));
CREATE POLICY "Only super admin can delete admin users" ON admin_users FOR DELETE USING (auth.uid() IN (SELECT id FROM admin_users));

-- ============================================
-- SETUP: ADD YOUR ADMIN USER(S)
-- ============================================
-- Ganti dengan user_id Anda dari Supabase auth.users table
-- Jalankan query ini untuk add admin:
-- INSERT INTO admin_users (id, email) VALUES ('YOUR_USER_ID_HERE', 'your-email@example.com');
