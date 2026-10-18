# SETUP QUICK START

## 1. Install Dependencies
```bash
npm install
```

**Note**: Jika npm install gagal atau ada warning tentang terser, jalankan:
```bash
npm install --save-dev terser
```

## 2. Setup Supabase

### A. Buat Supabase Project
- Daftar di https://supabase.com
- Buat project baru
- Catat Project URL dan Anon Key

### B. Buat Tables di Supabase
Jalankan SQL ini di Supabase SQL Editor:

```sql
-- Activities Table
CREATE TABLE activities (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  images JSONB,
  description TEXT
);
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Tours Table
CREATE TABLE tours (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT,
  price TEXT,
  images JSONB,
  options JSONB
);
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

-- Fast Boat Table
CREATE TABLE fast_boat (
  id BIGINT PRIMARY KEY,
  route TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  images JSONB,
  schedules JSONB
);
ALTER TABLE fast_boat ENABLE ROW LEVEL SECURITY;

-- Nusa Penida Table
CREATE TABLE nusa_penida (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  duration TEXT,
  images JSONB,
  itinerary JSONB,
  facilities JSONB
);
ALTER TABLE nusa_penida ENABLE ROW LEVEL SECURITY;

-- Drop & Pickup Table
CREATE TABLE drop_pickup (
  id BIGINT PRIMARY KEY DEFAULT 1,
  airport_transfers JSONB,
  ubud_transfers JSONB
);
ALTER TABLE drop_pickup ENABLE ROW LEVEL SECURITY;

-- RLS Policy untuk allow public read
CREATE POLICY "Allow public read activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Allow public read tours" ON tours FOR SELECT USING (true);
CREATE POLICY "Allow public read fast_boat" ON fast_boat FOR SELECT USING (true);
CREATE POLICY "Allow public read nusa_penida" ON nusa_penida FOR SELECT USING (true);
CREATE POLICY "Allow public read drop_pickup" ON drop_pickup FOR SELECT USING (true);
```

## 3. Setup Environment Variables

Buat file `.env.local` di root folder:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Cara mendapat URL dan Key:**
- Login ke Supabase Dashboard
- Pilih project
- Settings → API → Copy Project URL dan anon key

## 4. Run Development Server

```bash
npm run dev
```

Buka browser di http://localhost:5173

## 5. Deploy ke Netlify

### A. Setup Netlify
1. Push code ke GitHub
2. Login ke https://netlify.com
3. Click "Add new site" → Choose GitHub repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click Deploy

### B. Setup Environment Variables di Netlify
1. Site settings → Environment variables
2. Tambahkan:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

3. Trigger new deploy

## ✅ Testing Real-time Sync

1. Buka website di 2 browser tabs
2. Pergi ke Admin panel di salah satu tab
3. Edit data (Activities, Tours, dll)
4. Lihat tab lain - data akan update otomatis tanpa refresh!

## 🐛 Troubleshooting White Screen

Jika white screen saat deploy:

1. **Cek Browser Console** (F12)
   - Lihat error message

2. **Cek Netlify Logs**
   - Netlify Dashboard → Deploys → klik deploy → Logs
   - Cari "VITE_SUPABASE" error

3. **Perbaiki Environment Variables**
   - Pastikan sudah set di Netlify settings
   - Trigger re-deploy

4. **Test Locally Dulu**
   ```bash
   npm run build
   npm run preview
   # Buka http://localhost:4173
   ```

## 📚 Dokumentasi Lengkap

Baca file untuk detail lebih:
- `NETLIFY_DEPLOYMENT_GUIDE.md` - Deployment guide lengkap
- `SUPABASE_INTEGRATION_GUIDE.md` - Integration details
