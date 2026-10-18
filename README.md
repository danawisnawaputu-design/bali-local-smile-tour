# Travel App - Real-time Multi-Device Synchronization

Travel booking website dengan fitur real-time data synchronization menggunakan Supabase. Data yang diedit di satu device akan otomatis terupdate di semua device yang sedang mengakses website tanpa perlu refresh.

## 🎯 Fitur Utama

✨ **Real-time Data Sync**
- Edit data di admin panel → semua device terupdate otomatis
- Menggunakan Supabase Realtime PostgreSQL Changes
- Tidak perlu refresh page untuk melihat update terbaru

🏖️ **Content Management**
- Activities Management
- Tours & Packages
- Fast Boat Ticketing
- Nusa Penida Tours
- Airport Drop & Pickup Services

📱 **Responsive Design**
- Mobile-first UI
- Optimized untuk devices dengan ukuran screen berbeda

🔐 **Admin Panel**
- Secure login authentication
- Session timeout (30 menit inactivity)
- User-friendly data editing interface

## 🚀 Teknologi

- **Frontend**: Vue 3 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Build Tool**: Vite
- **Hosting**: Netlify
- **Routing**: Vue Router 4

## 📦 Setup Cepat

### 1. Clone & Install
```bash
git clone <repo-url>
cd travel
npm install
```

### 2. Setup Supabase
- Buat akun di supabase.com
- Buat project baru
- Buat tables (lihat QUICK_START.md untuk SQL script)
- Copy Project URL dan Anon Key

### 3. Setup Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server
```bash
npm run dev
```

Buka http://localhost:5173

### 5. Deploy ke Netlify
- Push ke GitHub
- Connect repo ke Netlify
- Set environment variables
- Deploy!

## 📚 Dokumentasi

- **[QUICK_START.md](QUICK_START.md)** - Setup guide cepat
- **[NETLIFY_DEPLOYMENT_GUIDE.md](NETLIFY_DEPLOYMENT_GUIDE.md)** - Deployment guide lengkap + troubleshooting
- **[SUPABASE_INTEGRATION_GUIDE.md](SUPABASE_INTEGRATION_GUIDE.md)** - Integration details
- **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** - Admin panel guide
- **[PERSISTEN_DATA_FIX.md](PERSISTEN_DATA_FIX.md)** - Data persistence info
- **[DRAG_DROP_UPLOAD_GUIDE.md](DRAG_DROP_UPLOAD_GUIDE.md)** - Image upload guide

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Type checking & build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
travel/
├── src/
│   ├── composables/
│   │   ├── useDataSync.ts        # Real-time sync logic
│   │   └── useDataMutation.ts    # CRUD operations
│   ├── router/
│   │   └── index.ts              # Vue Router config
│   ├── App.vue                   # Root component
│   ├── main.ts                   # Entry point
│   ├── supabase.ts               # Supabase client
│   ├── activitiesData.ts
│   ├── tourData.ts
│   ├── fastBoatData.ts
│   ├── nusaPenidaData.ts
│   ├── dropPickupData.ts
│   ├── ActivitiesPage.vue
│   ├── TourPage.vue
│   ├── FastBoatPage.vue
│   ├── NusaPenidaPage.vue
│   ├── DropPickupPage.vue
│   ├── AdminPage.vue
│   ├── LoginPage.vue
│   └── ... komponen lainnya
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment (git ignored)
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── netlify.toml                  # Netlify deployment config
├── package.json
└── README.md
```

## 🔄 Cara Kerja Real-time Sync

1. **User mengedit data di Admin Panel**
   ```
   AdminPage.vue → saveTours() → Supabase Insert/Update
   ```

2. **Supabase mengirim notifikasi real-time**
   ```
   PostgreSQL Changes → Supabase Realtime WebSocket
   ```

3. **Semua client yang subscribe menerima update**
   ```
   useDataSync.ts → data ref updated → UI re-render
   ```

4. **User di device lain melihat perubahan otomatis**
   ```
   ActivitiesPage.vue → activities.value updated
   TourPage.vue → tourPackages.value updated
   Dll...
   ```

## 🐛 Troubleshooting

### White Screen saat Deploy Netlify
1. Cek browser console (F12)
2. Cek Netlify deploy logs
3. Pastikan env variables sudah set di Netlify
4. Baca NETLIFY_DEPLOYMENT_GUIDE.md

### Real-time Updates Tidak Bekerja
1. Pastikan Supabase tables sudah dibuat
2. Pastikan Realtime sudah enabled di Supabase
3. Cek Network tab di DevTools untuk WebSocket connection
4. Cek browser console untuk errors

### Data Tidak Tersimpan
1. Verifikasi Supabase credentials benar
2. Cek Supabase database tables sudah ada
3. Pastikan env variables sudah set
4. Buka Supabase logs untuk error details

## 🤝 Kontribusi

Untuk kontribusi atau laporan bug, silakan buat issue atau pull request.

## 📄 License

MIT License - lihat LICENSE file untuk detail

## 🆘 Support

- Baca dokumentasi di folder ini
- Cek console log di browser untuk error messages
- Cek Supabase dashboard untuk data issues
- Cek Netlify logs untuk deployment issues

---

**Version**: 1.0.0  
**Last Updated**: January 25, 2026
