-- ============================================================================
-- HOW TO ADD EDIT FORMS FOR TOUR PRICES AND FACILITIES
-- ============================================================================

AdminPage.vue SUDAH PUNYA:
✅ Edit tour title, duration, price, images
✅ Edit options (name, description, places)
✅ Edit places (name, description, images)

BELUM PUNYA:
❌ Edit harga untuk setiap option (option.price)
❌ Edit facilities untuk setiap tour (tour.facilities)

SOLUSI:
Saya perlu update AdminPage.vue untuk menambahkan 2 field baru di form.

LANGKAH-LANGKAH:
1. Di form options (sekitar line 950-1000), tambah input field untuk option.price
2. Di form tour utama (sekitar line 850-900), tambah input field untuk tour.facilities

CONTOH YANG PERLU DITAMBAH:

A) Di bagian "Option Name" input, tambah field baru di bawahnya:
   <input
     v-model="newTour.options[optionIdx].price"
     placeholder="Option Price (e.g., Rp 900K-1.2 Juta)"
     class="w-full border rounded-lg p-2 text-xs mb-2"
   />

B) Di bagian tour form (sebelum Options section), tambah field baru:
   <div class="mb-4">
     <label class="text-xs font-semibold mb-2 block">Facilities (comma-separated)</label>
     <textarea
       v-model="facilitiesText"
       placeholder="Private Car & Driver, Entrance Tickets, etc."
       class="w-full border rounded-lg p-2 text-xs h-12"
     />
   </div>

PILIHANMU:
A) Manual - Anda edit AdminPage.vue sendiri mengikuti contoh di atas
B) Auto - Saya otomatis update AdminPage.vue dengan kedua field baru

Pilih A atau B?
