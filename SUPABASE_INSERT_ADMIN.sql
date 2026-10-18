-- ============================================================================
-- INSERT ADMIN USER
-- ============================================================================
-- Jalankan query ini di Supabase SQL Editor untuk set admin user

INSERT INTO admin_users (id, email)
SELECT id, email
FROM auth.users
WHERE lower(email) = lower('usersedangpusing@gmail.com')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Verifikasi (uncomment untuk lihat hasilnya)
-- SELECT * FROM admin_users;
