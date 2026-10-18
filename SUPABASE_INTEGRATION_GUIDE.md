# AdminPage Integration dengan Supabase

## Langkah-langkah untuk mengintegrasikan AdminPage dengan Supabase:

### 1. Import Supabase di AdminPage.vue

Tambahkan di atas script:
```typescript
import { supabase } from './supabase'
```

### 2. Ubah fungsi saveTours untuk sync ke Supabase

Ganti fungsi `saveTours`:
```typescript
const saveTours = async (tours: Tour[]) => {
  try {
    // Simpan di localStorage sebagai backup
    localStorage.setItem('tours', JSON.stringify(tours));
    
    // Sync ke Supabase untuk setiap tour
    for (const tour of tours) {
      const { error } = await supabase
        .from('tours')
        .upsert({
          id: tour.id,
          title: tour.title,
          duration: tour.duration,
          price: tour.price,
          images: tour.images, // Akan di-parse otomatis
          options: tour.options
        })
        .eq('id', tour.id);
      
      if (error) {
        console.error('Error saving tour to Supabase:', error);
      }
    }
    console.log('Tours saved to Supabase');
  } catch (error) {
    console.error('Error saving tours:', error);
  }
};
```

### 3. Ubah semua fungsi save serupa:

- `saveActivities` - sync ke table 'activities'
- `saveDropPickup` - sync ke table 'drop_pickup'
- `saveFastBoat` - sync ke table 'fast_boat'
- `saveNusaPenida` - sync ke table 'nusa_penida'

Gunakan pattern yang sama dengan `saveTours`.

### 4. Struktur Tabel Supabase yang Diperlukan

#### tours
- id (integer, primary key)
- title (text)
- duration (text)
- price (text)
- images (jsonb)
- options (jsonb)

#### activities
- id (integer, primary key)
- title (text)
- images (jsonb)
- description (text)

#### fast_boat
- id (integer, primary key)
- route (text)
- duration (text)
- description (text)
- images (jsonb)
- schedules (jsonb)

#### nusa_penida
- id (integer, primary key)
- name (text)
- price (text)
- duration (text)
- images (jsonb)
- itinerary (jsonb)
- facilities (jsonb)

#### drop_pickup
- id (integer, primary key)
- airport_transfers (jsonb)
- ubud_transfers (jsonb)

## Fitur Real-time yang Sudah Diimplementasikan:

✅ ActivitiesPage - Sync real-time
✅ TourPage - Sync real-time
✅ FastBoatPage - Sync real-time
✅ NusaPenidaPage - Sync real-time
✅ DropPickupPage - Sync real-time

## TODO untuk AdminPage:

- [ ] Update saveTours untuk Supabase sync
- [ ] Update saveActivities untuk Supabase sync
- [ ] Update saveDropPickup untuk Supabase sync
- [ ] Update saveFastBoat untuk Supabase sync
- [ ] Update saveNusaPenida untuk Supabase sync
