-- ============================================================================
-- UPDATE TOURS DATA - ADD DESCRIPTIONS, FACILITIES, AND PRICES
-- ============================================================================
-- Jalankan hanya bagian ini saja (policies sudah ada)

-- STEP 1: Tambah kolom description dan facilities jika belum ada
ALTER TABLE IF EXISTS tours
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS facilities JSONB;

-- STEP 2: Update Full Day Ubud (id = 1)
UPDATE tours
SET 
  description = 'Explore the cultural heart of Bali with visits to sacred temples, lush rice terraces, and traditional art galleries',
  facilities = '["Private Car & Driver", "Entrance Tickets", "Travel Insurance", "Mineral Water", "Hotel Pick-up & Drop-off"]'::jsonb,
  options = (
    SELECT jsonb_agg(
      CASE 
        WHEN elem->>'name' = 'Option 1' THEN elem || '{"price": "Rp 900K-1.2 Juta"}'::jsonb
        WHEN elem->>'name' = 'Option 2' THEN elem || '{"price": "Rp 800K-1.1 Juta"}'::jsonb
        ELSE elem
      END
    )
    FROM jsonb_array_elements(options) AS elem
  )
WHERE id = 1;

-- STEP 3: Update Full Day East (id = 2)
UPDATE tours
SET 
  description = 'Visit the famous "Gates of Heaven" at Lempuyang temple and explore pristine beaches and scenic viewpoints in East Bali',
  facilities = '["Private Car & Driver", "Entrance Tickets", "Travel Insurance", "Mineral Water", "Hotel Pick-up & Drop-off"]'::jsonb,
  options = (
    SELECT jsonb_agg(
      CASE 
        WHEN elem->>'name' = 'Option 1' THEN elem || '{"price": "Rp 1 Juta-1.3 Juta"}'::jsonb
        ELSE elem
      END
    )
    FROM jsonb_array_elements(options) AS elem
  )
WHERE id = 2;

-- STEP 4: Update Full Day North (id = 3)
UPDATE tours
SET 
  description = 'Experience volcanoes, sacred temples, and breathtaking mountain views in the northern highlands of Bali',
  facilities = '["Private Car & Driver", "Entrance Tickets", "Travel Insurance", "Mineral Water", "Hotel Pick-up & Drop-off"]'::jsonb,
  options = (
    SELECT jsonb_agg(
      CASE 
        WHEN elem->>'name' = 'Option 1' THEN elem || '{"price": "Rp 900K-1.2 Juta"}'::jsonb
        WHEN elem->>'name' = 'Option 2' THEN elem || '{"price": "Rp 1.1 Juta-1.4 Juta"}'::jsonb
        ELSE elem
      END
    )
    FROM jsonb_array_elements(options) AS elem
  )
WHERE id = 3;

-- STEP 5: Update Half Day Tour (id = 4)
UPDATE tours
SET 
  description = 'Choose from iconic temples, stunning beaches, and cultural sites for a perfect afternoon adventure',
  facilities = '["Private Car & Driver", "Entrance Tickets", "Travel Insurance", "Mineral Water", "Hotel Pick-up & Drop-off"]'::jsonb,
  options = (
    SELECT jsonb_agg(
      CASE 
        WHEN elem->>'name' = 'Option 1' THEN elem || '{"price": "Rp 600K-800K"}'::jsonb
        WHEN elem->>'name' = 'Option 2' THEN elem || '{"price": "Rp 700K-950K"}'::jsonb
        WHEN elem->>'name' = 'Option 3' THEN elem || '{"price": "Rp 550K-750K"}'::jsonb
        WHEN elem->>'name' = 'Option 4' THEN elem || '{"price": "Rp 500K-700K"}'::jsonb
        ELSE elem
      END
    )
    FROM jsonb_array_elements(options) AS elem
  )
WHERE id = 4;

-- STEP 6: Verifikasi (uncomment untuk lihat hasil)
-- SELECT id, title, description, facilities FROM tours ORDER BY id;
