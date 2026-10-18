# Admin Panel - Data Management Guide

## Akses Admin Panel

Untuk mengakses admin panel, navigasi ke:
```
http://localhost:5174/admin
```

Atau klik link **"Admin Panel"** di home page (teks kecil di bawah menu).

## Fitur Admin Panel

Admin panel memiliki 3 tab utama:
- **Tours**: Mengelola tour packages
- **Activities**: Mengelola activities
- **Drop & Pickup**: Mengelola destinasi drop & pickup services

---

## TAB 1: TOURS

### 1. **Add New Tour**
- Klik tombol **"Add New Tour"** untuk membuka form
- Isi data tour:
  - **Tour Title**: Nama tour (contoh: "FULL DAY UBUD")
  - **Duration**: Durasi (contoh: "9 hours")
  - **Price**: Harga (contoh: "IDR 700K")
  - **Tour Images**: URL gambar thumbnail tour

### 2. **Tambah Option**
- Setiap tour bisa memiliki banyak option (pilihan)
- Klik **"Add Option"** untuk tambah option baru
- Isi:
  - **Option Name**: Nama option (contoh: "Option 1", "Option 2")
  - **Option Description**: Deskripsi singkat option

### 3. **Tambah Places (Lokasi)**
- Setiap option bisa memiliki banyak places
- Klik **"Add Place"** untuk tambah place baru
- Isi:
  - **Place Name**: Nama lokasi (contoh: "Monkey Forest")
  - **Place Description**: Deskripsi lokasi
  - **Images**: URL gambar lokasi (bisa banyak gambar per lokasi)

### 4. **Simpan Tour**
- Klik **"Save Tour"** untuk menyimpan tour baru
- Data otomatis tersimpan di **localStorage** (penyimpanan browser)
- Data tidak perlu di-commit ke kode

### 5. **Edit Tour**
- Di list tour, klik tombol **"Edit"** pada tour yang ingin diubah
- Form akan terbuka dengan data tour
- Ubah data sesuai kebutuhan
- Klik **"Update Tour"** untuk simpan perubahan

### 6. **Delete Tour**
- Klik tombol **"Delete"** untuk menghapus tour

### 7. **Reset Tours ke Default**
- Klik **"Reset Default"** untuk mengembalikan semua tour ke original
- Akan diminta konfirmasi sebelum reset

---

## TAB 2: ACTIVITIES

### 1. **Add New Activity**
- Klik tab **"Activities"** untuk beralih ke tab activities
- Klik tombol **"Add New Activity"** untuk membuka form
- Isi data activity:
  - **Activity Title**: Nama activity (contoh: "ATV Quad Bike")
  - **Activity Description**: Deskripsi lengkap activity
  - **Images**: URL gambar activity (bisa banyak gambar)

### 2. **Tambah Images**
- Setiap activity bisa memiliki banyak gambar
- Input field otomatis tersedia
- Klik **"Add Image"** untuk tambah field gambar baru
- Klik **"Remove"** untuk hapus gambar yang tidak perlu

### 3. **Simpan Activity**
- Klik **"Save Activity"** untuk menyimpan activity baru
- Data otomatis tersimpan di **localStorage**

### 4. **Edit Activity**
- Di list activities, klik tombol **"Edit"** pada activity yang ingin diubah
- Form akan terbuka dengan data activity
- Ubah data sesuai kebutuhan
- Klik **"Update Activity"** untuk simpan perubahan

### 5. **Delete Activity**
- Klik tombol **"Delete"** untuk menghapus activity

### 6. **Reset Activities ke Default**
- Klik **"Reset Default"** untuk mengembalikan semua activities ke original
- Akan diminta konfirmasi sebelum reset

---

## TAB 3: DROP & PICKUP SERVICES

### 1. **Sub Tabs**
Drop & Pickup memiliki 2 sub-tab:
- **Airport Transfer**: Harga transfer dari/ke Bandara Ngurah Rai
- **Ubud Transfer**: Harga transfer dari/ke Ubud ke berbagai lokasi

Klik salah satu tab untuk mengelola destinasi tersebut.

### 2. **Add Destination**
- Klik tombol **"Add Destination"** untuk membuka form
- Isi data transfer:
  - **Destination**: Nama destinasi (contoh: "Kuta", "Seminyak", "Ubud")
  - **Price**: Harga transfer (contoh: "Rp200.000")

### 3. **Simpan Destinasi**
- Klik **"Save Destination"** untuk menyimpan
- Jika destinasi sudah ada, data akan terupdate
- Jika destinasi baru, akan ditambahkan ke list

### 4. **Edit Destinasi**
- Di list transfer, klik tombol **"Edit"** pada destinasi yang ingin diubah
- Form akan terbuka dengan data destinasi
- Ubah price sesuai kebutuhan
- Klik **"Save Destination"** untuk simpan perubahan

### 5. **Delete Destinasi**
- Klik tombol **"Delete"** untuk menghapus destinasi

### 6. **Reset ke Default**
- Klik **"Reset Default"** untuk mengembalikan semua data drop & pickup ke original
- Akan diminta konfirmasi sebelum reset

---

## Data Structure

### Tour Structure
```typescript
{
  id: number,
  title: string,
  duration: string,
  price: string,
  images: string[],
  options: [
    {
      name: string,
      description: string,
      places: [
        {
          name: string,
          description: string,
          images: string[]
        }
      ]
    }
  ]
}
```

### Activity Structure
```typescript
{
  id: number,
  title: string,
  images: string[],
  description: string
}
```

### Drop & Pickup Structure
```typescript
{
  airportTransfers: [
    {
      destination: string,
      price: string
    }
  ],
  ubudTransfers: [
    {
      destination: string,
      price: string
    }
  ]
}
```

---

## Contoh Data

### Tour Example
```
Title: FULL DAY NORTH
Duration: 9 hours
Price: IDR 750K
Images: [URL_gambar_thumbnail]

Option 1: Rice Terrace, Coffee Plantation, Water Temple, ...
  - Place: Monkey Forest
    Description: Sacred forest sanctuary...
    Images: [URL_gambar_1, URL_gambar_2, ...]
```

### Activity Example
```
Title: ATV Quad Bike
Description: Experience thrilling off-road adventure through Bali's scenic landscapes...
Images: [URL_gambar_1, URL_gambar_2, ...]
```

### Drop & Pickup Example
```
AIRPORT TRANSFER:
- Destination: Kuta, Price: Rp200.000
- Destination: Ubud, Price: Rp450.000

UBUD TRANSFER:
- Destination: Airport, Price: Rp400.000
- Destination: Seminyak, Price: Rp400.000
```

---

## Penyimpanan Data

- **Lokasi**: Browser's localStorage
- **Keys**: 
  - `tours` untuk tour packages
  - `activities` untuk activities
  - `dropPickup` untuk drop & pickup services
- **Format**: JSON string
- **Otomatis**: Data disimpan setiap kali ada perubahan
- **Persisten**: Data tetap ada meski browser ditutup

---

## Tips

1. **Image URLs**: Gunakan HTTPS URLs untuk gambar (misalnya dari Unsplash)
2. **Multiple Images**: Bisa menambah banyak gambar per place atau activity
3. **Edit Data**: Gunakan fitur Edit untuk mengubah item yang sudah ada
4. **Backup**: Jika ingin backup data, gunakan browser dev tools (F12 > Application > LocalStorage)
5. **Copy Images**: Saat menambah option baru dengan places yang sama, Anda bisa copy URL gambar dari option sebelumnya

---

## Troubleshooting

### Data tidak muncul di page?
- Refresh halaman browser
- Cek browser console (F12) untuk error message

### Ingin mulai dari awal?
- Klik "Reset Default" di admin panel untuk tours, activities, atau drop & pickup
- Atau hapus manual via browser dev tools

### Mau export/import data?
- Buka browser dev tools (F12)
- Masuk ke Application > LocalStorage
- Cari key "tours", "activities", atau "dropPickup"
- Copy/paste JSON sesuai kebutuhan

### Image tidak muncul?
- Pastikan menggunakan HTTPS URL
- Cek kembali URL image di form
- Beberapa CORS policy mungkin block image tertentu

---

## Workflow Rekomendasi

1. **Pertama kali setup**: 
   - Default data sudah ada dari database
   - Sesuaikan sesuai kebutuhan bisnis

2. **Tambah tour/activity/destinasi baru**:
   - Ke admin panel
   - Pilih tab yang sesuai
   - Klik "Add New..." button
   - Isi semua field dengan data lengkap
   - Klik Save

3. **Edit item yang ada**:
   - Ke admin panel
   - Klik "Edit" pada item yang ingin diubah
   - Update data sesuai kebutuhan
   - Klik "Update"

4. **Delete item**:
   - Ke admin panel
   - Klik "Delete" pada item yang ingin dihapus
   - Konfirmasi penghapusan

5. **Lihat hasil di public page**:
   - Tours: `/tours`
   - Activities: `/activities`
   - Drop & Pickup: `/drop-pickup`
   - Data akan muncul otomatis dari localStorage

---

## KEAMANAN ADMIN PANEL

### 1. **Login Required**
- Akses ke `/admin` **harus login terlebih dahulu**
- Jika belum login, akan diarahkan ke halaman login: `/admin/login`
- Tidak ada link admin di halaman utama untuk menjaga keamanan

### 2. **Token Expiration (24 Jam)**
- Token login berlaku selama **24 jam**
- Setelah 24 jam, user harus login ulang
- Token otomatis dihapus jika sudah kadaluarsa

### 3. **Session Timeout (30 Menit)**
- Jika tidak ada aktivitas selama **30 menit**, session otomatis logout
- Aktivitas yang terdeteksi: mouse movement, keyboard, scroll, touchscreen
- Ini melindungi jika Anda lupa logout dari komputer publik

### 4. **Credentials**
- Username: `admin`
- Password: `admin123`
- **PENTING**: Ubah password ini sebelum production deployment!
- Simpan credentials di `.env` atau environment variables untuk production

### 5. **Rekomendasi untuk Production**
- [ ] Integrasikan dengan backend authentication API
- [ ] Gunakan HTTPS untuk semua komunikasi
- [ ] Implement rate limiting pada endpoint login
- [ ] Gunakan JWT atau session tokens yang lebih secure
- [ ] Add password encryption di backend
- [ ] Implement 2FA (Two-Factor Authentication)
- [ ] Add audit logs untuk setiap perubahan data
- [ ] Use environment variables untuk sensitive data

---

Sekarang Anda bisa mengelola data tour, activities, dan drop & pickup services tanpa perlu mengubah kode! 🎉

Semua perubahan tersimpan di browser dan akan tetap ada sampai Anda menghapusnya atau reset ke default.
