<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import SocialFooter from './SocialFooter.vue';
import { supabase } from './supabase';
import { tourPackages as defaultTours } from './tourData';
import { activitiesData as defaultActivities } from './activitiesData';
import { dropPickupData as defaultDropPickup } from './dropPickupData';
import { defaultFastBoatRoutes } from './fastBoatData';
import { defaultNusaPenidaPackages, NusaPenidaPackage } from './nusaPenidaData';

const router = useRouter();

// --- TIPE DATA ---
type TabType = 'tours' | 'activities' | 'dropPickup' | 'fastBoat' | 'nusaPenida' | 'inbox' | 'revenue';

interface BookingOrder {
  id: string;
  item_name: string;
  category: string;
  price_text: string | null;
  amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

interface PageNote {
  id: number;
  page_name: string;
  content: string;
  is_active: boolean;
}

interface Place {
  id?: number;
  name: string;
  description: string;
  images: string[];
}

interface TourOption {
  id?: number;
  name: string;
  description: string;
  price?: string;
  places: Place[];
}

interface Tour {
  id: number;
  title: string;
  duration: string;
  images: string[];
  description?: string;
  facilities?: string[];
  options: TourOption[];
}

interface Activity {
  id: number;
  title: string;
  price?: string;
  images: string[];
  description: string;
}

interface Transfer {
  destination: string;
  price: string;
}

interface DropPickupData {
  airportTransfers: Transfer[];
  ubudTransfers: Transfer[];
}

interface FastBoatSchedule {
  time: string;
  operator: string;
  price: string;
}

interface FastBoatRoute {
  id: number;
  route: string;
  images: string[];
  schedules: FastBoatSchedule[];
  duration: string;
  description: string;
}

// --- LOADERS & STATE ---
const loadTours = (): Tour[] => {
  try {
    const stored = localStorage.getItem('tours');
    const tours = stored ? JSON.parse(stored) : defaultTours;
    return tours.map((tour: Tour) => ({
      ...tour,
      options: tour.options.map((option: TourOption, optIdx: number) => ({
        ...option,
        id: option.id || optIdx + 1,
        places: option.places.map((place: Place, placeIdx: number) => ({
          ...place,
          id: place.id || placeIdx + 1
        }))
      }))
    }));
  } catch (error) { return defaultTours; }
};

const loadActivities = (): Activity[] => { try { return JSON.parse(localStorage.getItem('activities') || '') || defaultActivities; } catch { return defaultActivities; } };
const loadDropPickup = (): DropPickupData => { try { return JSON.parse(localStorage.getItem('dropPickup') || '') || defaultDropPickup; } catch { return defaultDropPickup; } };
const loadFastBoat = (): FastBoatRoute[] => { try { return JSON.parse(localStorage.getItem('fastBoat') || '') || defaultFastBoatRoutes; } catch { return defaultFastBoatRoutes; } };
const loadNusaPenida = (): NusaPenidaPackage[] => { try { return JSON.parse(localStorage.getItem('nusaPenida') || '') || defaultNusaPenidaPackages; } catch { return defaultNusaPenidaPackages; } };

const tours = ref<Tour[]>(loadTours());
const activities = ref<Activity[]>(loadActivities());
const dropPickup = ref<DropPickupData>(loadDropPickup());
const fastBoat = ref<FastBoatRoute[]>(loadFastBoat());
const nusaPenida = ref<NusaPenidaPackage[]>(loadNusaPenida());
const pageNotes = ref<PageNote[]>([]);
const bookingOrders = ref<BookingOrder[]>([]);

const activeTab = ref<TabType | 'notes'>('tours');
const activeSubTab = ref<'airport' | 'ubud'>('airport');
const showForm = ref(false);
const editingId = ref<number | null>(null);
const editingRouteId = ref<number | null>(null);
const facilitiesText = ref('');
const acceptedRevenue = computed(() => bookingOrders.value
  .filter(order => order.status === 'accepted')
  .reduce((total, order) => total + Number(order.amount || 0), 0));
const pendingOrders = computed(() => bookingOrders.value.filter(order => order.status === 'pending'));
const acceptedOrders = computed(() => bookingOrders.value.filter(order => order.status === 'accepted'));
const totalOrderAmount = computed(() => bookingOrders.value
  .reduce((total, order) => total + Number(order.amount || 0), 0));
const pendingPercent = computed(() => bookingOrders.value.length
  ? Math.round((pendingOrders.value.length / bookingOrders.value.length) * 100)
  : 0);
const acceptedPercent = computed(() => bookingOrders.value.length
  ? Math.round((acceptedOrders.value.length / bookingOrders.value.length) * 100)
  : 0);
const revenuePercent = computed(() => totalOrderAmount.value
  ? Math.round((acceptedRevenue.value / totalOrderAmount.value) * 100)
  : 0);
const ringStyle = (percent: number, color: string) => ({
  background: `conic-gradient(${color} ${percent}%, #e7ece9 0)`
});

// --- HELPERS ---
const deleteImageFromStorage = async (imageUrl: string) => {
  try {
    const marker = '/storage/v1/object/public/tours-images/';
    const storagePath = imageUrl.includes(marker)
      ? decodeURIComponent(imageUrl.split(marker)[1])
      : imageUrl.split('/').pop();
    if (!storagePath) return;
    await supabase.storage.from('tours-images').remove([storagePath]);
  } catch (error) { console.error('Error:', error); }
};

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('adminAuth');
    router.push({ name: 'Home' });
  }
};

// --- NOTES LOGIC (UPDATED: AUTO-FIX MISSING PAGES) ---
const loadPageNotes = async () => {
  // 1. Ambil data yang sudah ada di database
  const { data } = await supabase
    .from('page_notes')
    .select('*')
    .order('page_name', { ascending: true });
    
  const existingNotes = data || [];

  // 2. Daftar Halaman Wajib (King bisa tambah disini kalau ada halaman baru)
  const requiredPages = ['activities', 'drop_pickup', 'fast_boat', 'nusa_penida', 'tour_detail'];

  // 3. Gabungkan: Kalau belum ada di DB, buatkan template kosong
  const mergedNotes = requiredPages.map(pageName => {
    const found = existingNotes.find((n: PageNote) => n.page_name === pageName);
    if (found) return found;

    // Template default jika data hilang
    return {
      id: 0, // ID 0 tandanya belum disimpan di DB
      page_name: pageName,
      content: '', // Konten kosong dulu
      is_active: true
    } as PageNote;
  });

  pageNotes.value = mergedNotes;
};

const updateNote = async (note: PageNote) => {
  // Siapkan data yang mau disimpan
  const payload: any = { 
    page_name: note.page_name, 
    content: note.content, 
    is_active: note.is_active 
  };

  // Hanya kirim ID jika bukan data baru (bukan 0)
  // Supabase akan otomatis buat ID baru kalau kita tidak kirim ID
  if (note.id !== 0) {
    payload.id = note.id;
  }

  const { data, error } = await supabase
    .from('page_notes')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    alert('Gagal update: ' + error.message);
  } else {
    // Update ID lokal dengan ID asli dari database agar sinkron
    if (data) note.id = data.id; 
    alert('Note berhasil disimpan!');
  }
};

const loadBookingOrders = async () => {
  const { data, error } = await supabase
    .from('booking_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    alert('Gagal memuat pesan masuk: ' + error.message);
    return;
  }
  bookingOrders.value = (data || []) as BookingOrder[];
};

const updateBookingOrder = async (order: BookingOrder, status?: BookingOrder['status']) => {
  const amount = Number(order.amount) || 0;
  if (status === 'accepted' && amount <= 0) {
    alert('Isi nilai pesanan lebih dari 0 sebelum menerima pesanan.');
    return;
  }

  const updates = { amount, ...(status ? { status } : {}) };
  const { error } = await supabase
    .from('booking_orders')
    .update(updates)
    .eq('id', order.id);

  if (error) {
    alert('Gagal memperbarui pesanan: ' + error.message);
    await loadBookingOrders();
    return;
  }
  Object.assign(order, updates);
};

const formatCurrency = (amount: number) => `Rp${Number(amount || 0).toLocaleString('id-ID')}`;
const formatOrderDate = (date: string) => new Date(date).toLocaleString('id-ID');

// --- CRUD & SAVE ---
const saveTours = async (toursData: Tour[]) => { localStorage.setItem('tours', JSON.stringify(toursData)); await supabase.from('tours').upsert(toursData, { onConflict: 'id' }); };
const fetchRealToursFromSupabase = async () => {
  const { data } = await supabase.from('tours').select('*').order('id', { ascending: true });
  if (data) {
    tours.value = data.map((t: any) => ({
      ...t,
      facilities: typeof t.facilities === 'string' ? JSON.parse(t.facilities) : (t.facilities || []),
      images: typeof t.images === 'string' ? JSON.parse(t.images) : (t.images || []),
      options: typeof t.options === 'string' ? JSON.parse(t.options) : (t.options || [])
    }));
  }
};
const deleteTour = async (id: number) => {
  if (!confirm('Hapus tour ini? Foto akan dihapus.')) return;
  const tourToDelete = tours.value.find(t => t.id === id);
  if (tourToDelete?.images) for (const imgUrl of tourToDelete.images) await deleteImageFromStorage(imgUrl);
  tours.value = tours.value.filter(t => t.id !== id);
  await supabase.from('tours').delete().eq('id', id);
};
const resetToDefault = () => { if (confirm('Reset Tours to default?')) { tours.value = JSON.parse(JSON.stringify(defaultTours)); saveTours(tours.value); } };

const saveActivities = async (v: Activity[]) => {
  localStorage.setItem('activities', JSON.stringify(v));
  const { error } = await supabase.from('activities').upsert(v, { onConflict: 'id' });
  if (error) {
    console.error('Error saving activities:', error);
    alert(`Gagal menyinkronkan Activities ke Supabase: ${error.message}`);
  }
};
const fetchRealActivitiesFromSupabase = async () => {
  const { data, error } = await supabase.from('activities').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Error fetching activities:', error);
    return;
  }

  const cachedPrices = new Map(activities.value.map(activity => [activity.id, activity.price]));
  if (data?.length) {
    const remoteIds = new Set(data.map((activity: Activity) => activity.id));
    const syncedActivities = data.map((activity: Activity) => ({
      ...activity,
      price: activity.price || cachedPrices.get(activity.id) || ''
    }));
    activities.value = [
      ...syncedActivities,
      ...activities.value.filter(activity => !remoteIds.has(activity.id))
    ];
  } else if (activities.value.length) {
    await saveActivities(activities.value);
  }
};
const deleteActivity = async (id: number) => {
  if (!confirm('Hapus activity?')) return;
  const item = activities.value.find(a => a.id === id);
  if (item?.images) for (const url of item.images) await deleteImageFromStorage(url);
  activities.value = activities.value.filter(a => a.id !== id);
  await supabase.from('activities').delete().eq('id', id);
  saveActivities(activities.value);
};
const resetActivityData = () => { if (confirm('Reset Activities to default?')) { activities.value = JSON.parse(JSON.stringify(defaultActivities)); saveActivities(activities.value); } };

const saveDropPickup = async (v: DropPickupData) => { 
  localStorage.setItem('dropPickup', JSON.stringify(v)); 
  const { error } = await supabase.from('drop_pickup').upsert({ 
    id: 1, 
    airport_transfers: JSON.stringify(v.airportTransfers), 
    ubud_transfers: JSON.stringify(v.ubudTransfers) 
  }, { onConflict: 'id' });
  if (error) console.error('Error saving drop_pickup:', error);
};
const resetDropPickupData = () => { if (confirm('Reset Transport to default?')) { dropPickup.value = JSON.parse(JSON.stringify(defaultDropPickup)); saveDropPickup(dropPickup.value); } };

const saveFastBoat = async (v: FastBoatRoute[]) => { localStorage.setItem('fastBoat', JSON.stringify(v)); await supabase.from('fast_boat').upsert(v); };
const deleteFastBoatRoute = async (id: number) => {
  if (!confirm('Hapus rute?')) return;
  const item = fastBoat.value.find(r => r.id === id);
  if (item?.images) for (const url of item.images) await deleteImageFromStorage(url);
  fastBoat.value = fastBoat.value.filter(r => r.id !== id);
  await supabase.from('fast_boat').delete().eq('id', id);
  saveFastBoat(fastBoat.value);
};
const resetFastBoatData = () => { if (confirm('Reset FastBoat to default?')) { fastBoat.value = JSON.parse(JSON.stringify(defaultFastBoatRoutes)); saveFastBoat(fastBoat.value); } };

const saveNusaPenida = async (v: NusaPenidaPackage[]) => {
  const clean = v.map(p => ({ ...p, duration: p.duration || '-', name: p.name || 'Untitled', price: p.price || 'Ask', facilities: p.facilities || [], itinerary: p.itinerary || [], images: p.images || [] }));
  localStorage.setItem('nusaPenida', JSON.stringify(clean));
  await supabase.from('nusa_penida').upsert(clean);
  nusaPenida.value = clean;
};
const deleteNusaPenida = async (id: number) => {
  if (!confirm('Hapus paket?')) return;
  const item = nusaPenida.value.find(p => p.id === id);
  if (item?.images) for (const url of item.images) await deleteImageFromStorage(url);
  nusaPenida.value = nusaPenida.value.filter(p => p.id !== id);
  await supabase.from('nusa_penida').delete().eq('id', id);
  saveNusaPenida(nusaPenida.value);
};
const resetNusaPenidaData = () => { if (confirm('Reset Nusa Penida to default?')) { nusaPenida.value = JSON.parse(JSON.stringify(defaultNusaPenidaPackages)); saveNusaPenida(nusaPenida.value); } };

// --- FILE HANDLERS ---
const handleFileUpload = (event: Event, callback: (url: string) => void) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) processFile(input.files[0], callback);
};
const handleDragDrop = (event: DragEvent, callback: (url: string) => void) => {
  event.preventDefault(); event.stopPropagation();
  if (event.dataTransfer?.files.length) processFile(event.dataTransfer.files[0], callback);
};
const processFile = async (file: File, callback: (url: string) => void) => {
  if (!file.type.startsWith('image/')) return alert('File harus gambar!');
  if (file.size > 5 * 1024 * 1024) return alert('Ukuran gambar maksimal 5 MB.');
  try {
    const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const filePath = `public/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from('tours-images').upload(filePath, file, {
      contentType: file.type,
      upsert: false
    });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('tours-images').getPublicUrl(filePath);
    callback(publicUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Gagal upload gambar:', error);
    alert(`Gagal upload gambar: ${message}`);
  }
};

// --- MODELS & ACTIONS ---
const newTour = ref<Tour>({ id: 0, title: '', duration: '', description: '', images: [''], facilities: [''], options: [{ id: 1, name: 'Option 1', description: '', price: '', places: [{ id: 1, name: '', description: '', images: [''] }] }] });
const newActivity = ref<Activity>({ id: 0, title: '', price: '', images: [''], description: '' });
const newTransfer = ref<Transfer>({ destination: '', price: '' });
const newFastBoatRoute = ref<FastBoatRoute>({ id: 0, route: '', images: [''], schedules: [{ time: '', operator: '', price: '' }], duration: '', description: '' });
const newNusaPenida = ref<NusaPenidaPackage>({ id: 0, name: '', price: '', images: [''], duration: '', itinerary: [{ time: '', activity: '' }], facilities: [''] });

const resetForm = () => { newTour.value = { id: 0, title: '', duration: '', description: '', facilities: [], images: [''], options: [{ id: 1, name: 'Option 1', description: '', price: '', places: [{ id: 1, name: '', description: '', images: [''] }] }] }; facilitiesText.value = ''; editingId.value = null; showForm.value = false; };
const resetActivityForm = () => { newActivity.value = { id: 0, title: '', price: '', images: [''], description: '' }; editingId.value = null; showForm.value = false; };
const resetFastBoatForm = () => { newFastBoatRoute.value = { id: 0, route: '', images: [''], schedules: [{ time: '', operator: '', price: '' }], duration: '', description: '' }; editingRouteId.value = null; showForm.value = false; };
const resetNusaPenidaForm = () => { newNusaPenida.value = { id: 0, name: '', price: '', images: [''], duration: '', itinerary: [{ time: '', activity: '' }], facilities: [''] }; editingId.value = null; showForm.value = false; };

const addTour = () => { newTour.value.facilities = facilitiesText.value.split(',').map(f => f.trim()).filter(f => f.length > 0); if (!editingId.value) { newTour.value.id = Math.max(0, ...tours.value.map(t => t.id)) + 1; tours.value.push({ ...newTour.value }); } else { const idx = tours.value.findIndex(t => t.id === editingId.value); if (idx >= 0) tours.value[idx] = { ...newTour.value }; } saveTours(tours.value); resetForm(); };
const editTour = (t: Tour) => { newTour.value = JSON.parse(JSON.stringify(t)); facilitiesText.value = (Array.isArray(t.facilities) ? t.facilities : []).join(', '); editingId.value = t.id; showForm.value = true; };
const addActivity = () => { if (!editingId.value) { newActivity.value.id = Math.max(0, ...activities.value.map(a => a.id)) + 1; activities.value.push({ ...newActivity.value }); } else { const idx = activities.value.findIndex(a => a.id === editingId.value); if (idx >= 0) activities.value[idx] = { ...newActivity.value }; } saveActivities(activities.value); resetActivityForm(); };
const editActivity = (a: Activity) => { newActivity.value = JSON.parse(JSON.stringify(a)); editingId.value = a.id; showForm.value = true; };
const addTransfer = () => { const list = activeSubTab.value === 'airport' ? dropPickup.value.airportTransfers : dropPickup.value.ubudTransfers; const idx = list.findIndex(t => t.destination === newTransfer.value.destination); if (idx >= 0) list[idx] = { ...newTransfer.value }; else list.push({ ...newTransfer.value }); saveDropPickup(dropPickup.value); newTransfer.value = { destination: '', price: '' }; };
const editTransfer = (t: Transfer) => { newTransfer.value = { ...t }; showForm.value = true; };
const deleteTransfer = (d: string) => { const list = activeSubTab.value === 'airport' ? dropPickup.value.airportTransfers : dropPickup.value.ubudTransfers; const idx = list.findIndex(t => t.destination === d); if (idx >= 0) list.splice(idx, 1); saveDropPickup(dropPickup.value); };
const addFastBoatRoute = () => { if (!editingRouteId.value) { newFastBoatRoute.value.id = Math.max(0, ...fastBoat.value.map(r => r.id)) + 1; fastBoat.value.push(JSON.parse(JSON.stringify(newFastBoatRoute.value))); } else { const idx = fastBoat.value.findIndex(r => r.id === editingRouteId.value); if (idx >= 0) fastBoat.value[idx] = JSON.parse(JSON.stringify(newFastBoatRoute.value)); } saveFastBoat(fastBoat.value); resetFastBoatForm(); };
const editFastBoatRoute = (r: FastBoatRoute) => { newFastBoatRoute.value = JSON.parse(JSON.stringify(r)); editingRouteId.value = r.id; showForm.value = true; };
const addNusaPenida = () => { if (!editingId.value) { newNusaPenida.value.id = Math.max(0, ...nusaPenida.value.map(p => p.id)) + 1; nusaPenida.value.push(JSON.parse(JSON.stringify(newNusaPenida.value))); } else { const idx = nusaPenida.value.findIndex(p => p.id === editingId.value); if (idx >= 0) nusaPenida.value[idx] = JSON.parse(JSON.stringify(newNusaPenida.value)); } saveNusaPenida(nusaPenida.value); resetNusaPenidaForm(); };
const editNusaPenida = (p: NusaPenidaPackage) => { newNusaPenida.value = JSON.parse(JSON.stringify(p)); editingId.value = p.id; showForm.value = true; };

// --- ARRAY HELPERS ---
const addOption = () => { newTour.value.options.push({ id: Date.now(), name: `Option`, description: '', places: [{ id: 1, name: '', description: '', images: [''] }] }); };
const addPlace = (i: number) => newTour.value.options[i].places.push({ id: Date.now(), name: '', description: '', images: [''] });
const addImage = (o: number, p: number) => newTour.value.options[o].places[p].images.push('');
const removeOption = (i: number) => newTour.value.options.splice(i, 1);
const removePlace = (o: number, p: number) => newTour.value.options[o].places.splice(p, 1);
const removeImage = (o: number, p: number, img: number) => newTour.value.options[o].places[p].images.splice(img, 1);
const addTourImage = () => newTour.value.images.push('');
const removeTourImage = (i: number) => newTour.value.images.splice(i, 1);
const addActivityImage = () => newActivity.value.images.push('');
const removeActivityImage = (i: number) => newActivity.value.images.splice(i, 1);
const addFastBoatImage = () => newFastBoatRoute.value.images.push('');
const removeFastBoatImage = (i: number) => newFastBoatRoute.value.images.splice(i, 1);
const addFastBoatSchedule = () => newFastBoatRoute.value.schedules.push({ time: '', operator: '', price: '' });
const removeFastBoatSchedule = (i: number) => newFastBoatRoute.value.schedules.splice(i, 1);
const addNusaPenidaImage = () => newNusaPenida.value.images.push('');
const removeNusaPenidaImage = (i: number) => newNusaPenida.value.images.splice(i, 1);
const addItineraryItem = () => newNusaPenida.value.itinerary.push({ time: '', activity: '' });
const removeItineraryItem = (i: number) => newNusaPenida.value.itinerary.splice(i, 1);
const addFacility = () => newNusaPenida.value.facilities.push('');
const removeFacility = (i: number) => newNusaPenida.value.facilities.splice(i, 1);

const switchTab = (t: TabType | 'notes') => { activeTab.value = t; showForm.value = false; resetForm(); resetActivityForm(); resetFastBoatForm(); resetNusaPenidaForm(); newTransfer.value = { destination: '', price: '' }; if (t === 'notes') loadPageNotes(); if (t === 'inbox' || t === 'revenue') loadBookingOrders(); };
const switchSubTab = (t: 'airport' | 'ubud') => { activeSubTab.value = t; showForm.value = false; newTransfer.value = { destination: '', price: '' }; };

watch(tours, (v) => saveTours(v), { deep: true });
watch(activities, (v) => saveActivities(v), { deep: true });
watch(dropPickup, (v) => saveDropPickup(v), { deep: true });
watch(fastBoat, (v) => saveFastBoat(v), { deep: true });
watch(nusaPenida, (v) => saveNusaPenida(v), { deep: true });

onMounted(() => { fetchRealToursFromSupabase(); fetchRealActivitiesFromSupabase(); loadBookingOrders(); });
</script>

<template>
  <div class="min-h-screen bg-[#f2f5f3] text-slate-800">
    <header class="border-b border-white/10 bg-[#17352f] text-white">
      <div class="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <div class="grid h-10 w-10 place-items-center rounded-xl bg-[#d4e7a8] text-sm font-black text-[#17352f]">BL</div>
          <div>
            <p class="text-sm font-bold">Bali Local Smile</p>
            <p class="text-[11px] text-white/60">OPERATIONS CONSOLE</p>
          </div>
        </div>
        <button @click="handleLogout" class="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10">Logout</button>
      </div>
    </header>
    
    <div class="mx-auto max-w-[1480px] px-4 pb-12 pt-8 sm:px-6 lg:px-8">
      <div class="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="mb-2 text-xs font-bold uppercase text-[#55766d]">Admin / Workspace</p>
          <h1 class="text-3xl font-bold text-[#17352f]">Dashboard</h1>
          <p class="mt-1 text-sm text-slate-500">Kelola pemesanan dan konten website dalam satu tempat.</p>
        </div>
      </div>

      <section class="mb-7 grid gap-4 md:grid-cols-3" aria-label="Ringkasan pesanan dan omset">
        <article class="flex min-h-[168px] items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="grid h-[112px] w-[112px] shrink-0 place-items-center rounded-full p-[9px]" :style="ringStyle(pendingPercent, '#d18b35')" role="img" :aria-label="`${pendingPercent}% pesanan masih pending`">
            <div class="grid h-full w-full place-items-center rounded-full bg-white text-center">
              <div><p class="text-2xl font-bold text-slate-800">{{ bookingOrders.length }}</p><p class="text-[9px] font-bold uppercase text-slate-400">Pesan</p></div>
            </div>
          </div>
          <div><p class="text-xs font-bold uppercase text-slate-400">Pesan Masuk</p><p class="mt-1 text-lg font-bold text-slate-800">{{ pendingOrders.length }} pending</p><p class="mt-1 text-xs leading-relaxed text-slate-500">{{ pendingPercent }}% dari total pesanan menunggu keputusan.</p></div>
        </article>

        <article class="flex min-h-[168px] items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="grid h-[112px] w-[112px] shrink-0 place-items-center rounded-full p-[9px]" :style="ringStyle(acceptedPercent, '#398e78')" role="img" :aria-label="`${acceptedPercent}% pesanan diterima`">
            <div class="grid h-full w-full place-items-center rounded-full bg-white text-center">
              <div><p class="text-2xl font-bold text-slate-800">{{ acceptedOrders.length }}</p><p class="text-[9px] font-bold uppercase text-slate-400">Diterima</p></div>
            </div>
          </div>
          <div><p class="text-xs font-bold uppercase text-slate-400">Pesanan Diterima</p><p class="mt-1 text-lg font-bold text-slate-800">{{ acceptedPercent }}% dari total</p><p class="mt-1 text-xs leading-relaxed text-slate-500">Pesanan accepted tercatat sebagai pemasukan.</p></div>
        </article>

        <article class="flex min-h-[168px] items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="grid h-[112px] w-[112px] shrink-0 place-items-center rounded-full p-[9px]" :style="ringStyle(revenuePercent, '#4b83ad')" role="img" :aria-label="`${revenuePercent}% omset accepted dari total nilai pesanan`">
            <div class="grid h-full w-full place-items-center rounded-full bg-white text-center">
              <div><p class="text-[11px] font-bold text-slate-800">{{ revenuePercent }}%</p><p class="text-[9px] font-bold uppercase text-slate-400">Omset</p></div>
            </div>
          </div>
          <div><p class="text-xs font-bold uppercase text-slate-400">Omset Accepted</p><p class="mt-1 text-lg font-bold text-slate-800">{{ formatCurrency(acceptedRevenue) }}</p><p class="mt-1 text-xs leading-relaxed text-slate-500">Porsi dari total nilai semua pesanan.</p></div>
        </article>
      </section>

      <nav class="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm" aria-label="Navigasi admin">
        <button @click="switchTab('tours')" :class="['shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors', activeTab === 'tours' ? 'bg-[#17352f] text-white' : 'text-slate-600 hover:bg-slate-100']">Tours</button>
        <button @click="switchTab('activities')" :class="['shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors', activeTab === 'activities' ? 'bg-[#17352f] text-white' : 'text-slate-600 hover:bg-slate-100']">Activities</button>
        <button @click="switchTab('dropPickup')" :class="['shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors', activeTab === 'dropPickup' ? 'bg-[#17352f] text-white' : 'text-slate-600 hover:bg-slate-100']">Transport</button>
        <button @click="switchTab('fastBoat')" :class="['shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors', activeTab === 'fastBoat' ? 'bg-[#17352f] text-white' : 'text-slate-600 hover:bg-slate-100']">Fast Boat</button>
        <button @click="switchTab('nusaPenida')" :class="['shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors', activeTab === 'nusaPenida' ? 'bg-[#17352f] text-white' : 'text-slate-600 hover:bg-slate-100']">Nusa Penida</button>
        <button @click="switchTab('inbox')" :class="['shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors', activeTab === 'inbox' ? 'bg-[#17352f] text-white' : 'text-slate-600 hover:bg-slate-100']">Pesan Masuk<span v-if="pendingOrders.length" class="ml-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">{{ pendingOrders.length }}</span></button>
        <button @click="switchTab('revenue')" :class="['shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors', activeTab === 'revenue' ? 'bg-[#17352f] text-white' : 'text-slate-600 hover:bg-slate-100']">Omset</button>
        <button @click="switchTab('notes')" :class="['shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors', activeTab === 'notes' ? 'bg-[#17352f] text-white' : 'text-slate-600 hover:bg-slate-100']">Site Notes</button>
      </nav>

      <div v-if="activeTab === 'inbox'" class="space-y-3">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">Pesan Masuk ({{ bookingOrders.length }})</h3>
          <button @click="loadBookingOrders" class="text-sm text-blue-600">Muat ulang</button>
        </div>
        <div v-if="bookingOrders.length === 0" class="py-8 text-center text-sm text-gray-500">Belum ada pesanan.</div>
        <article v-for="order in bookingOrders" :key="order.id" class="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div class="flex justify-between gap-3">
            <div>
              <p class="font-semibold">{{ order.item_name }}</p>
              <p class="text-xs text-gray-500">{{ order.category }} · {{ formatOrderDate(order.created_at) }}</p>
            </div>
            <span :class="['h-fit px-2 py-1 rounded text-xs font-semibold', order.status === 'pending' ? 'bg-amber-100 text-amber-800' : order.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">{{ order.status }}</span>
          </div>
          <p v-if="order.price_text" class="mt-2 text-sm text-gray-600">Harga tercatat: {{ order.price_text }}</p>
          <p class="mt-2 text-xs text-gray-600">{{ order.message }}</p>
          <label class="mt-3 block text-xs font-medium text-gray-600">Nilai pesanan (Rp)</label>
          <div class="mt-1 flex gap-2">
            <input v-model.number="order.amount" type="number" min="0" class="min-w-0 flex-1 border rounded px-2 py-1 text-sm" />
            <button @click="updateBookingOrder(order)" class="px-3 py-1 border rounded text-xs">Simpan nilai</button>
          </div>
          <div v-if="order.status === 'pending'" class="mt-3 flex gap-2">
            <button @click="updateBookingOrder(order, 'accepted')" class="flex-1 bg-green-600 text-white py-2 rounded text-sm font-semibold">Accept</button>
            <button @click="updateBookingOrder(order, 'rejected')" class="flex-1 bg-red-600 text-white py-2 rounded text-sm font-semibold">Reject</button>
          </div>
        </article>
      </div>

      <div v-if="activeTab === 'revenue'" class="space-y-4">
        <section class="bg-green-50 border border-green-200 rounded-lg p-4">
          <p class="text-sm text-green-800">Total omset dari pesanan diterima</p>
          <p class="mt-1 text-2xl font-bold text-green-900">{{ formatCurrency(acceptedRevenue) }}</p>
          <p class="mt-1 text-xs text-green-800">{{ bookingOrders.filter(order => order.status === 'accepted').length }} pesanan diterima</p>
        </section>
        <h3 class="text-lg font-semibold">Rincian Pesanan Diterima</h3>
        <div v-if="!bookingOrders.some(order => order.status === 'accepted')" class="py-6 text-center text-sm text-gray-500">Belum ada pesanan yang diterima.</div>
        <article v-for="order in bookingOrders.filter(order => order.status === 'accepted')" :key="order.id" class="flex justify-between gap-3 border-b border-gray-200 py-3">
          <div>
            <p class="font-medium">{{ order.item_name }}</p>
            <p class="text-xs text-gray-500">{{ order.category }} · {{ formatOrderDate(order.created_at) }}</p>
          </div>
          <p class="font-semibold whitespace-nowrap">{{ formatCurrency(order.amount) }}</p>
        </article>
      </div>

      <div v-if="activeTab === 'tours'">
        <div class="mb-4 flex gap-2">
          <button @click="showForm = !showForm" class="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600">{{ showForm ? 'Cancel' : 'Add New Tour' }}</button>
          <button @click="resetToDefault" class="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600">Reset Default</button>
        </div>

        <div v-if="showForm" class="bg-white rounded-lg p-4 mb-6 shadow-lg max-h-[80vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">{{ editingId ? 'Edit Tour' : 'Add New Tour' }}</h3>
          <div class="space-y-3 mb-4">
            <input v-model="newTour.title" placeholder="Tour Title" class="w-full border rounded-lg p-2 text-sm" />
            <input v-model="newTour.duration" placeholder="Duration" class="w-full border rounded-lg p-2 text-sm" />
            <textarea v-model="newTour.description" placeholder="Description" class="w-full border rounded-lg p-2 text-sm h-12"></textarea>
            <textarea v-model="facilitiesText" placeholder="Facilities (comma separated)" class="w-full border rounded-lg p-2 text-sm h-24"></textarea>
          </div>
          <div class="mb-4">
            <label class="text-xs font-semibold mb-2 block">Tour Images</label>
            <div v-for="(_, idx) in newTour.images" :key="idx" class="mb-2 relative">
               <div @drop.prevent="handleDragDrop($event, (url) => newTour.images[idx] = url)" @dragover.prevent class="border-2 border-dashed border-gray-300 p-2 rounded">
                  <input type="file" @change="handleFileUpload($event, (url) => newTour.images[idx] = url)" class="text-xs mb-1 w-full"/>
                  <input v-model="newTour.images[idx]" placeholder="Image URL" class="w-full border rounded p-1 text-xs" />
               </div>
              <button v-if="newTour.images.length > 1" @click="removeTourImage(idx)" class="text-red-500 text-xs mt-1">Remove</button>
            </div>
            <button @click="addTourImage" class="text-xs bg-green-500 text-white px-2 py-1 rounded">Add Image</button>
          </div>
          <div class="mb-4">
             <div class="flex justify-between mb-2"><label class="text-xs font-semibold">Options</label><button @click="addOption" class="text-xs bg-green-500 text-white px-2 py-1 rounded">Add Option</button></div>
             <div v-for="(opt, optIdx) in newTour.options" :key="opt.id" class="border-l-2 border-blue-300 pl-3 mb-4">
               <input v-model="opt.name" placeholder="Option Name" class="w-full border rounded p-1 text-xs mb-1" />
               <input v-model="opt.price" placeholder="Price" class="w-full border rounded p-1 text-xs mb-1 bg-yellow-50" />
               <textarea v-model="opt.description" placeholder="Desc" class="w-full border rounded p-1 text-xs mb-1"></textarea>
               <div class="ml-2 mt-2">
                 <div class="flex justify-between mb-1"><label class="text-[10px] font-bold">Places</label><button @click="addPlace(optIdx)" class="text-[10px] bg-green-500 text-white px-1 rounded">Add Place</button></div>
                 <div v-for="(plc, plcIdx) in opt.places" :key="plc.id" class="bg-gray-50 p-2 rounded mb-2">
                   <input v-model="plc.name" placeholder="Place Name" class="w-full border rounded p-1 text-xs mb-1" />
                   <textarea v-model="plc.description" placeholder="Place Desc" class="w-full border rounded p-1 text-xs h-10 mb-1"></textarea>
                   <div v-for="(_, imgIdx) in plc.images" :key="imgIdx" class="mb-1">
                      <div @drop.prevent="handleDragDrop($event, (url) => plc.images[imgIdx] = url)" @dragover.prevent class="border-dashed border p-1 rounded">
                         <input type="file" @change="handleFileUpload($event, (url) => plc.images[imgIdx] = url)" class="text-[10px] mb-1"/>
                         <input v-model="plc.images[imgIdx]" placeholder="URL" class="w-full border rounded p-1 text-[10px]" />
                      </div>
                      <button v-if="plc.images.length > 1" @click="removeImage(optIdx, plcIdx, imgIdx)" class="text-[10px] text-red-500">Remove Img</button>
                   </div>
                   <button @click="addImage(optIdx, plcIdx)" class="text-[10px] text-blue-500 underline">Add Image</button>
                   <button v-if="opt.places.length > 1" @click="removePlace(optIdx, plcIdx)" class="text-[10px] text-red-500 ml-2">Del Place</button>
                 </div>
               </div>
               <button v-if="newTour.options.length > 1" @click="removeOption(optIdx)" class="text-xs text-red-500 mt-1">Remove Option</button>
             </div>
          </div>
          <button @click="addTour" class="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold">{{ editingId ? 'Update' : 'Save' }}</button>
        </div>

        <div class="space-y-3">
          <h3 class="text-lg font-semibold">Tours ({{ tours.length }})</h3>
          <div v-for="tour in tours" :key="tour.id" class="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500 flex justify-between">
            <div><h4 class="font-semibold">{{ tour.title }}</h4><p class="text-xs text-gray-500">{{ tour.duration }}</p></div>
            <div class="flex gap-2"><button @click="editTour(tour)" class="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-600">Edit</button><button @click="deleteTour(tour.id)" class="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600">Del</button></div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'activities'">
        <div class="mb-4 flex gap-2">
          <button @click="showForm = !showForm" class="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600">{{ showForm ? 'Cancel' : 'Add Activity' }}</button>
          <button @click="resetActivityData" class="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600">Reset Default</button>
        </div>
        <div v-if="showForm" class="bg-white rounded p-4 mb-4 shadow">
          <input v-model="newActivity.title" placeholder="Title" class="w-full border rounded p-2 mb-2 text-sm" />
          <input v-model="newActivity.price" placeholder="Price (e.g. Rp500.000)" class="w-full border rounded p-2 mb-2 text-sm" />
          <textarea v-model="newActivity.description" placeholder="Desc" class="w-full border rounded p-2 mb-2 text-sm h-20"></textarea>
          <div v-for="(_, idx) in newActivity.images" :key="idx" class="mb-2">
            <div @drop.prevent="handleDragDrop($event, (url) => newActivity.images[idx] = url)" @dragover.prevent class="border-dashed border p-1 rounded">
               <input type="file" @change="handleFileUpload($event, (url) => newActivity.images[idx] = url)" class="text-xs mb-1"/>
               <input v-model="newActivity.images[idx]" placeholder="URL" class="w-full border rounded p-1 text-xs" />
            </div>
            <button v-if="newActivity.images.length > 1" @click="removeActivityImage(idx)" class="text-red-500 text-xs">Remove</button>
          </div>
          <button @click="addActivityImage" class="text-xs text-green-500 underline mb-2">Add Image</button>
          <button @click="addActivity" class="w-full bg-blue-500 text-white py-2 rounded">{{ editingId ? 'Update' : 'Save' }}</button>
        </div>
        <div class="space-y-3">
          <h3 class="text-lg font-semibold">Activities ({{ activities.length }})</h3>
          <div v-for="act in activities" :key="act.id" class="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500 flex justify-between">
            <div><span class="font-semibold">{{ act.title }}</span><p v-if="act.price" class="text-xs text-gray-500">{{ act.price }}</p></div>
            <div class="gap-2 flex"><button @click="editActivity(act)" class="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-600">Edit</button><button @click="deleteActivity(act.id)" class="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600">Del</button></div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'dropPickup'">
        <div class="flex gap-2 mb-4">
          <button @click="switchSubTab('airport')" :class="['flex-1 py-1 rounded text-sm', activeSubTab === 'airport' ? 'bg-green-500 text-white' : 'bg-gray-200']">Airport Transfer</button>
          <button @click="switchSubTab('ubud')" :class="['flex-1 py-1 rounded text-sm', activeSubTab === 'ubud' ? 'bg-green-500 text-white' : 'bg-gray-200']">Ubud Transfer</button>
        </div>
        <div class="mb-4 flex gap-2">
           <button @click="showForm = !showForm" class="flex-1 bg-green-500 text-white py-2 rounded font-semibold">{{ showForm ? 'Cancel' : 'Add Destination' }}</button>
           <button @click="resetDropPickupData" class="flex-1 bg-gray-500 text-white py-2 rounded font-semibold">Reset</button>
        </div>
        <div v-if="showForm" class="bg-white p-4 rounded shadow mb-4">
          <input v-model="newTransfer.destination" placeholder="Destination" class="w-full border rounded p-2 mb-2 text-sm" />
          <input v-model="newTransfer.price" placeholder="Price" class="w-full border rounded p-2 mb-2 text-sm" />
          <button @click="addTransfer" class="w-full bg-green-500 text-white py-2 rounded">Save</button>
        </div>
        <div class="space-y-3">
          <div v-for="t in (activeSubTab === 'airport' ? dropPickup.airportTransfers : dropPickup.ubudTransfers)" :key="t.destination" class="bg-white rounded-lg p-4 shadow-md border-l-4 border-green-500 flex justify-between">
            <div><p class="font-bold text-sm">{{ t.destination }}</p><p class="text-xs">{{ t.price }}</p></div>
            <div class="gap-2 flex"><button @click="editTransfer(t)" class="bg-blue-500 text-white px-3 py-1 rounded text-xs">Edit</button><button @click="deleteTransfer(t.destination)" class="bg-red-500 text-white px-3 py-1 rounded text-xs">Del</button></div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'fastBoat'">
        <div class="mb-4 flex gap-2">
          <button @click="showForm = !showForm" class="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600">{{ showForm ? 'Cancel' : 'Add Route' }}</button>
          <button @click="resetFastBoatData" class="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600">Reset Default</button>
        </div>
        <div v-if="showForm" class="bg-white p-4 rounded shadow mb-4">
          <input v-model="newFastBoatRoute.route" placeholder="Route Name" class="w-full border rounded p-2 mb-2 text-sm" />
          <input v-model="newFastBoatRoute.duration" placeholder="Duration" class="w-full border rounded p-2 mb-2 text-sm" />
          <textarea v-model="newFastBoatRoute.description" placeholder="Desc" class="w-full border rounded p-2 mb-2 text-sm"></textarea>
          
          <div class="mb-2">
            <label class="text-xs font-bold">Images</label>
            <div v-for="(_, idx) in newFastBoatRoute.images" :key="idx" class="mb-2">
               <div @drop.prevent="handleDragDrop($event, (url) => newFastBoatRoute.images[idx] = url)" @dragover.prevent class="border-dashed border p-1 rounded">
                  <input type="file" @change="handleFileUpload($event, (url) => newFastBoatRoute.images[idx] = url)" class="text-xs mb-1"/>
                  <input v-model="newFastBoatRoute.images[idx]" placeholder="URL" class="w-full border rounded p-1 text-xs" />
               </div>
               <button v-if="newFastBoatRoute.images.length > 1" @click="removeFastBoatImage(idx)" class="text-red-500 text-xs">Remove</button>
            </div>
            <button @click="addFastBoatImage" class="text-xs text-green-500 underline">Add Image</button>
          </div>

          <div class="mb-2">
            <label class="text-xs font-bold">Schedules</label>
            <div v-for="(_, idx) in newFastBoatRoute.schedules" :key="idx" class="flex gap-1 mb-1">
              <input v-model="newFastBoatRoute.schedules[idx].time" placeholder="Time" class="w-1/4 border rounded p-1 text-xs" />
              <input v-model="newFastBoatRoute.schedules[idx].operator" placeholder="Operator" class="w-1/2 border rounded p-1 text-xs" />
              <input v-model="newFastBoatRoute.schedules[idx].price" placeholder="Price" class="w-1/4 border rounded p-1 text-xs" />
              <button @click="removeFastBoatSchedule(idx)" class="text-red-500 text-xs">x</button>
            </div>
            <button @click="addFastBoatSchedule" class="text-xs text-green-500">+ Schedule</button>
          </div>

          <button @click="addFastBoatRoute" class="w-full bg-blue-500 text-white py-2 rounded">{{ editingRouteId ? 'Update' : 'Save' }}</button>
        </div>
        <div class="space-y-3">
           <div v-for="route in fastBoat" :key="route.id" class="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500 flex justify-between">
             <div><p class="font-bold text-sm">{{ route.route }}</p><p class="text-xs">{{ route.duration }}</p></div>
             <div class="gap-2 flex"><button @click="editFastBoatRoute(route)" class="bg-blue-500 text-white px-3 py-1 rounded text-xs">Edit</button><button @click="deleteFastBoatRoute(route.id)" class="bg-red-500 text-white px-3 py-1 rounded text-xs">Del</button></div>
           </div>
        </div>
      </div>

      <div v-if="activeTab === 'nusaPenida'">
        <div class="mb-4 flex gap-2">
          <button @click="showForm = !showForm" class="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600">{{ showForm ? 'Cancel' : 'Add Package' }}</button>
          <button @click="resetNusaPenidaData" class="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600">Reset Default</button>
        </div>
        <div v-if="showForm" class="bg-white p-4 rounded shadow mb-4">
          <input v-model="newNusaPenida.name" placeholder="Name" class="w-full border rounded p-2 mb-2 text-sm" />
          <input v-model="newNusaPenida.price" placeholder="Price" class="w-full border rounded p-2 mb-2 text-sm" />
          <input v-model="newNusaPenida.duration" placeholder="Duration" class="w-full border rounded p-2 mb-2 text-sm" />
          
          <div class="mb-2">
            <label class="text-xs font-bold">Images</label>
            <div v-for="(_, idx) in newNusaPenida.images" :key="idx" class="mb-2">
               <div @drop.prevent="handleDragDrop($event, (url) => newNusaPenida.images[idx] = url)" @dragover.prevent class="border-dashed border p-1 rounded">
                  <input type="file" @change="handleFileUpload($event, (url) => newNusaPenida.images[idx] = url)" class="text-xs mb-1"/>
                  <input v-model="newNusaPenida.images[idx]" placeholder="URL" class="w-full border rounded p-1 text-xs" />
               </div>
               <button v-if="newNusaPenida.images.length > 1" @click="removeNusaPenidaImage(idx)" class="text-red-500 text-xs">Remove</button>
            </div>
            <button @click="addNusaPenidaImage" class="text-xs text-green-500 underline">Add Image</button>
          </div>

          <div class="mb-2">
             <label class="text-xs font-bold">Itinerary</label>
             <div v-for="(_, idx) in newNusaPenida.itinerary" :key="idx" class="flex gap-1 mb-1">
               <input v-model="newNusaPenida.itinerary[idx].time" placeholder="Time" class="w-1/4 border rounded p-1 text-xs" />
               <input v-model="newNusaPenida.itinerary[idx].activity" placeholder="Activity" class="w-3/4 border rounded p-1 text-xs" />
               <button @click="removeItineraryItem(idx)" class="text-red-500 text-xs">x</button>
             </div>
             <button @click="addItineraryItem" class="text-xs text-green-500">+ Item</button>
          </div>
          
          <div class="mb-2">
             <label class="text-xs font-bold">Facilities</label>
             <div v-for="(_, idx) in newNusaPenida.facilities" :key="idx" class="flex gap-1 mb-1">
               <input v-model="newNusaPenida.facilities[idx]" placeholder="Facility" class="w-full border rounded p-1 text-xs" />
               <button @click="removeFacility(idx)" class="text-red-500 text-xs">x</button>
             </div>
             <button @click="addFacility" class="text-xs text-green-500">+ Facility</button>
          </div>

          <button @click="addNusaPenida" class="w-full bg-blue-500 text-white py-2 rounded">{{ editingId ? 'Update' : 'Save' }}</button>
        </div>
        <div class="space-y-3">
          <div v-for="p in nusaPenida" :key="p.id" class="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500 flex justify-between">
             <div><p class="font-bold text-sm">{{ p.name }}</p><p class="text-xs">{{ p.price }}</p></div>
             <div class="gap-2 flex"><button @click="editNusaPenida(p)" class="bg-blue-500 text-white px-3 py-1 rounded text-xs">Edit</button><button @click="deleteNusaPenida(p.id)" class="bg-red-500 text-white px-3 py-1 rounded text-xs">Del</button></div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'notes'" class="space-y-4 pb-8">
        <h3 class="text-lg font-semibold mb-4">Edit Halaman Notes</h3>
        <div v-for="note in pageNotes" :key="note.id" class="bg-white rounded-lg p-4 shadow-md border-l-4 border-yellow-500">
          <div class="flex justify-between items-center mb-2">
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase">Halaman: {{ note.page_name.replace('_', ' ') }}</span>
            <label class="flex items-center cursor-pointer">
              <span class="mr-2 text-xs font-semibold text-gray-500">{{ note.is_active ? 'Tampil' : 'Sembunyi' }}</span>
              <input type="checkbox" v-model="note.is_active" class="accent-blue-500" @change="updateNote(note)">
            </label>
          </div>
          <textarea v-model="note.content" rows="3" class="w-full border rounded-lg p-2 text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="Tulis pesan note disini..."></textarea>
          <div class="mt-2 text-right">
            <button @click="updateNote(note)" class="bg-green-500 text-white px-4 py-1 rounded text-xs font-bold hover:bg-green-600">Simpan</button>
          </div>
        </div>
      </div>
      
      <div class="mt-8">
        <SocialFooter />
      </div>

    </div>
  </div>
</template>