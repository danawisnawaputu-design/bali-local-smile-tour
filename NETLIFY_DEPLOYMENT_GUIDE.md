# Travel App Deployment Guide - Netlify

## Troubleshooting White Screen di Netlify

Jika website menampilkan white screen saat di-deploy di Netlify, ikuti langkah-langkah di bawah:

### 1. Pastikan Environment Variables Sudah Set

Di Netlify:
1. Buka project settings → Environment
2. Tambahkan variable berikut:
   ```
   VITE_SUPABASE_URL = https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-supabase-anon-key
   ```

### 2. Cek Build Configuration

File `netlify.toml` sudah dikonfigurasi dengan benar:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Penjelasan:**
- `command = "npm run build"` - menjalankan build script dari package.json
- `publish = "dist"` - folder output dari Vite
- `[[redirects]]` - SPA routing configuration yang penting untuk Vue Router

### 3. Pastikan package.json Scripts Benar

Cek bahwa script sudah ada:
```json
"scripts": {
  "dev": "vite",
  "build": "vue-tsc --noEmit && vite build",
  "preview": "vite preview"
}
```

### 4. Cek Build Log di Netlify

Jika masih white screen:
1. Buka Netlify Dashboard → Deploys
2. Klik deploy terbaru → Logs
3. Cari error atau warning

Umumnya error adalah:
- `VITE_SUPABASE_URL is not defined` - tambahkan env variable
- Build failed - pastikan semua dependencies terinstall dengan benar

### 5. Local Testing Sebelum Deploy

```bash
npm run build
npm run preview
```

Buka `http://localhost:4173` untuk test preview build.

## Setup Project untuk Real-time Data Sync

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru
3. Buat tables berikut:

#### Activities Table
```sql
CREATE TABLE activities (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  images JSONB,
  description TEXT
);
```

#### Tours Table
```sql
CREATE TABLE tours (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT,
  price TEXT,
  images JSONB,
  options JSONB
);
```

#### Fast Boat Table
```sql
CREATE TABLE fast_boat (
  id BIGINT PRIMARY KEY,
  route TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  images JSONB,
  schedules JSONB
);
```

#### Nusa Penida Table
```sql
CREATE TABLE nusa_penida (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT,
  duration TEXT,
  images JSONB,
  itinerary JSONB,
  facilities JSONB
);
```

#### Drop & Pickup Table
```sql
CREATE TABLE drop_pickup (
  id BIGINT PRIMARY KEY DEFAULT 1,
  airport_transfers JSONB,
  ubud_transfers JSONB
);
```

### 3. Setup Environment Variables

1. Copy `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` dan tambahkan Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Dapatkan credentials dari Supabase:
   - Login ke Supabase Dashboard
   - Project Settings → API → Project URL & anon key

### 4. Run Development Server

```bash
npm run dev
```

Akan membuka `http://localhost:5173`

## Real-time Data Sync Features

### Bagaimana Data Bersinkronisasi?

1. **Admin mengedit data** di halaman Admin → data tersimpan di Supabase
2. **Supabase mengirim notifikasi real-time** ke semua client yang terkoneksi
3. **Client menerima update** dan UI di-update secara otomatis
4. **Semua devices melihat data yang sama** tanpa refresh

### Halaman yang Support Real-time Sync:

✅ Activities Page - sync dengan table `activities`
✅ Tours Page - sync dengan table `tours`
✅ Fast Boat Page - sync dengan table `fast_boat`
✅ Nusa Penida Page - sync dengan table `nusa_penida`
✅ Drop & Pickup Page - sync dengan table `drop_pickup`

### Implementasi di Composable

File `src/composables/useDataSync.ts` menangani:
- Fetch data awal dari Supabase
- Setup real-time subscription menggunakan PostgreSQL changes
- Handle INSERT, UPDATE, DELETE events
- Fallback ke default data jika error

## Debugging

### Chrome DevTools

1. Buka DevTools → Console
2. Cek untuk errors
3. Cek Network tab untuk Supabase requests

### Common Issues:

**"Supabase environment variables missing"**
- Solusi: Setup `.env.local` dengan credentials yang benar

**"White screen on load"**
- Buka Console untuk cek error
- Pastikan netlify.toml redirects sudah benar
- Cek env variables di Netlify settings

**"Real-time updates tidak bekerja"**
- Pastikan Supabase Realtime sudah enabled
- Cek Network tab untuk WebSocket connection
- Verifikasi data table schema sudah benar

## Deployment Checklist

- [ ] `.env.local` dengan Supabase credentials sudah setup
- [ ] Supabase tables sudah dibuat dengan schema yang benar
- [ ] `netlify.toml` sudah benar
- [ ] `package.json` build script benar
- [ ] Environment variables sudah ditambahkan di Netlify settings
- [ ] Local test dengan `npm run build && npm run preview` berhasil
- [ ] Push ke GitHub dan trigger Netlify deploy
- [ ] Cek Netlify deploy logs untuk errors
- [ ] Test website di domain yang sudah di-deploy
- [ ] Cek real-time sync dengan buka di 2 devices/tabs sekaligus

## Support

Jika ada masalah:

1. Cek console log di browser (F12 → Console)
2. Cek Netlify deploy logs
3. Pastikan semua environment variables benar
4. Verifikasi Supabase project sudah setup dengan benar
