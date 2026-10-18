# 📸 Fitur Drag & Drop Upload Gambar

## ✨ Apa yang Baru?

Sebelumnya, Anda hanya bisa:
- ❌ Copy-paste URL gambar dari internet
- ❌ Tidak bisa upload file gambar langsung dari komputer

Sekarang, Anda bisa:
- ✅ **Drag & drop gambar** dari file explorer
- ✅ **Click untuk browse & upload** file gambar
- ✅ **Paste URL** seperti biasa
- ✅ **Preview gambar** langsung setelah upload

---

## 🎯 Cara Menggunakan

### **1. Drag & Drop Gambar**

```
1. Buka Admin Panel
2. Pergi ke Tab: Tours / Activities / Fast Boat / Nusa Penida
3. Cari bagian "Images" / "Tour Images" / "Package Images"
4. Drag gambar dari file explorer ke kotak bertanda dashed biru
5. Gambar akan otomatis ter-upload dan preview
```

### **2. Click untuk Browse**

```
1. Click di area kotak biru bertanda dashed
2. Browser file akan terbuka
3. Pilih file gambar (JPG, PNG, GIF, WebP)
4. Gambar otomatis ter-upload dan ditampilkan
```

### **3. Paste URL (Cara Lama Masih Bisa)**

```
1. Click di input field "Or paste image URL/link"
2. Paste atau ketik URL gambar
3. Tekan Enter atau tunggu auto-save
```

---

## 📋 File dan Bagian yang Support Drag & Drop

| Fitur | Lokasi | Support |
|-------|--------|---------|
| **Tours** | Add/Edit Tour → Tour Images | ✅ Ya |
| **Tours** | Options → Places → Images | ✅ Ya |
| **Activities** | Add/Edit Activity → Images | ✅ Ya |
| **Fast Boat** | Add/Edit Route → Route Images | ✅ Ya |
| **Nusa Penida** | Add/Edit Package → Package Images | ✅ Ya |

---

## 🛡️ Validasi & Keamanan

### **Validasi File yang Dilakukan:**

```typescript
1. ✅ Tipe file harus gambar (JPG, PNG, GIF, WebP)
   → Jika bukan: "Pilih file gambar yang valid"

2. ✅ Ukuran maksimal 5MB
   → Jika lebih besar: "Ukuran file terlalu besar. Maksimal 5MB."

3. ✅ File harus readable
   → Jika gagal: "Gagal membaca file. Coba lagi."
```

### **Format Output:**

File dikonversi ke **Base64** dan disimpan di localStorage bersama data lainnya.

---

## 🔧 Implementasi Teknis

### **Functions Baru:**

```typescript
// 1. Handle file upload dari input
handleFileUpload = (event: Event, callback: (url: string) => void)

// 2. Handle drag & drop
handleDragDrop = (event: DragEvent, callback: (url: string) => void)

// 3. Process dan validasi file
processFile = (file: File, callback: (url: string) => void)
```

### **Template Changes:**

Sebelum:
```vue
<input v-model="images[idx]" placeholder="Image URL" class="..." />
```

Sesudah:
```vue
<div
  @drop="handleDragDrop($event, (url) => images[idx] = url)"
  @dragover.prevent
  @dragenter.prevent
  class="border-2 border-dashed..."
>
  <input type="file" accept="image/*" 
    @change="handleFileUpload($event, (url) => images[idx] = url)" />
  <input v-model="images[idx]" placeholder="Or paste image URL/link" />
  <img v-if="images[idx]" :src="images[idx]" />
</div>
```

---

## 📸 Visual Indicator

### **Sebelum Upload:**
```
📷 Drag image here or paste URL
[Or paste image URL/link input field]
```

### **Sesudah Upload:**
```
✓ Image selected
[Or paste image URL/link input field]
[Preview gambar ditampilkan]
```

---

## 💾 Penyimpanan Data

1. **File gambar dikonversi ke Base64**
2. **Disimpan di localStorage** (sama seperti URL)
3. **Persisten** - tidak hilang saat refresh atau tutup browser
4. **Auto-save** - otomatis tersimpan saat ada perubahan

> ⚠️ **Catatan:** Base64 lebih besar dari URL. Jika upload banyak gambar besar, localStorage mungkin penuh (~5-10MB).

---

## 🎨 UI/UX Features

- **Dashed border biru** untuk area drop zone
- **Hover effect** - background berubah menjadi lebih terang saat hover
- **Image preview** - gambar ditampilkan setelah upload
- **Visual feedback** - "✓ Image selected" atau "📷 Drag image here"
- **Responsive** - berfungsi di mobile dan desktop
- **Fallback** - bisa tetap paste URL jika prefer

---

## 🚀 Keuntungan

1. **Lebih cepat** - Tidak perlu upload ke cloud lalu copy URL
2. **Offline-friendly** - Upload langsung dari komputer lokal
3. **Preview immediate** - Lihat gambar langsung setelah upload
4. **Flexibility** - Tetap bisa paste URL jika ada gambar di internet
5. **Mobile-ready** - Bisa browse dari mobile file manager

---

## ⚡ Performance Notes

- **Gambar besar** (> 2MB) akan sedikit lambat saat upload
- **localStorage limit** ~5-10MB per domain
- **Recommended** - Compress gambar sebelum upload untuk hasil terbaik

---

## 🐛 Troubleshooting

### **Gambar tidak muncul setelah drag-drop**
→ Cek file format (harus JPG, PNG, GIF, WebP)
→ Cek ukuran file (harus < 5MB)

### **"Ukuran file terlalu besar" error**
→ Compress/resize gambar menggunakan image editor
→ Gunakan online tool seperti tinypng.com

### **Preview tidak muncul**
→ Browser console mungkin ada error (F12)
→ Coba refresh page dan coba lagi

### **localStorage penuh**
→ Clear storage: Dev Tools → Application → Local Storage → Delete
→ Upload lebih sedikit/gambar yang lebih kecil

---

## 📚 File yang Dimodifikasi

- [AdminPage.vue](src/AdminPage.vue) - Tambahan functions dan template updates

## 🎓 Tips

1. **Compress gambar** sebelum upload untuk performa lebih baik
2. **Format PNG** untuk hasil terbaik (compression vs quality)
3. **Test** dengan gambar kecil terlebih dahulu sebelum banyak
4. **Backup data** secara berkala (export localStorage)
