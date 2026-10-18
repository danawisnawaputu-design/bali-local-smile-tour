-- ============================================================================
-- RESET ADMIN PASSWORD VIA SQL
-- ============================================================================
-- Jalankan query ini di Supabase SQL Editor untuk ubah password admin

UPDATE auth.users 
SET encrypted_password = crypt('@SmilEtour$uBud&2026,B4tubu1an', gen_salt('bf'))
WHERE email = 'usersedangpusing@gmail.com';

-- Verifikasi (uncomment untuk check)
-- SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'usersedangpusing@gmail.com';
