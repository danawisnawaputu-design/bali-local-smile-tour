# Architecture & Data Flow

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│                      (Vue 3 + Vite)                             │
├──────────────────────────────┬──────────────────────────────────┤
│                              │                                  │
│  Public Pages                │  Admin Panel                     │
│  ✓ HomePage                  │  ✓ LoginPage                    │
│  ✓ ActivitiesPage            │  ✓ AdminPage (CRUD operations)  │
│  ✓ TourPage                  │  ├─ Tours Editor                │
│  ✓ FastBoatPage              │  ├─ Activities Editor           │
│  ✓ NusaPenidaPage            │  ├─ DropPickup Editor           │
│  ✓ DropPickupPage            │  ├─ FastBoat Editor             │
│  ✓ TourDetailPage            │  └─ NusaPenida Editor           │
│                              │                                  │
│  All use: useDataSync        │  All use: saveFunctions +        │
│  composable for real-time    │  Supabase upsert operations     │
└──────────────────────────────┴──────────────────────────────────┘
           ▲                              ▲
           │                              │
           │ useDataSync.ts               │ useDataMutation.ts
           │ (read operations)            │ (write operations)
           │                              │
┌──────────┴──────────────────────────────┴─────────────────────┐
│                   Supabase Client                             │
│           (src/supabase.ts)                                   │
│                                                               │
│  • Manages API connections                                   │
│  • Realtime subscriptions                                    │
│  • CRUD operations                                           │
└──────────┬────────────────────────────────────────────────────┘
           │
           │ HTTP + WebSocket
           │
┌──────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│                  (PostgreSQL + Realtime)                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Tables:                                                    │
│  ✓ activities                                              │
│  ✓ tours                                                   │
│  ✓ fast_boat                                               │
│  ✓ nusa_penida                                             │
│  ✓ drop_pickup                                             │
│                                                              │
│  Features:                                                  │
│  ✓ Row Level Security (RLS) enabled                        │
│  ✓ Realtime PostgreSQL Changes enabled                     │
│  ✓ Public read access (for public pages)                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagram

### 1. Read Flow (Public Pages)
```
User opens ActivitiesPage
         │
         ▼
onMounted() event fires
         │
         ▼
useDataSync.initialize() called
         │
         ├──→ fetchData() 
         │    └─→ Supabase query
         │        └─→ Load activities
         │
         └──→ setupRealtimeSubscription()
              └─→ Subscribe to PostgreSQL changes
                  └─→ Listen for INSERT/UPDATE/DELETE
                      └─→ Auto-update UI when data changes
         │
         ▼
data.value = activities (displayed in template)
```

### 2. Write Flow (Admin Panel)
```
Admin clicks "Add/Edit/Delete" in AdminPage
         │
         ▼
User fills form and clicks Save
         │
         ▼
saveTours()/saveActivities()/etc called
         │
         ├──→ localStorage.setItem() (backup)
         │
         └──→ supabase.from().upsert() 
              └─→ INSERT/UPDATE to database
                  └─→ PostgreSQL triggers event
                      └─→ Supabase emits to all subscribed clients
                          │
                          ▼
              Other connected users receive update
              via real-time WebSocket connection
              │
              ▼
              Payload handled by postgres_changes listener
              │
              ├─ INSERT → push new item to array
              ├─ UPDATE → find & replace item
              └─ DELETE → filter out item
              │
              ▼
              data.value updated reactively
              │
              ▼
              Vue re-renders UI
              │
              ▼
              User sees changes without refresh!
```

### 3. Real-time Sync Example
```
Timeline with 2 users opening same page:

Time  User A (Device 1)           User B (Device 2)
────  ────────────────────        ──────────────────
T0    Opens ActivitiesPage        Opens ActivitiesPage
      ✓ Fetch data from DB         ✓ Fetch data from DB
      ✓ Subscribe to changes       ✓ Subscribe to changes

T1    Navigates to Admin           (idle)
      Panel

T2    Edits Activity #1            Activity list shows
      and clicks Save              Activity #1 as before

T3    saveTours() called           
      └─→ Supabase update
          └─→ Event emitted

T4    Realtime notification        Realtime notification
      received (from their         received (from Supabase)
      own update)                  │
      ✓ UI updates                 ✓ Activity #1 updates
                                    ✓ User B sees change!
                                    (NO REFRESH NEEDED)

T5    Admin panel shows            Main app shows
      updated data                 updated data
```

## 🗂️ Composables Structure

### useDataSync.ts
```typescript
useDataSync<T>({
  table: string,           // Supabase table name
  defaultData: T[],        // Default/fallback data
  onDataChange?: callback  // Optional callback
})

Returns:
{
  data: Ref<T[]>,         // Reactive data array
  loading: Ref<boolean>,  // Loading state
  error: Ref<string|null>,// Error message
  initialize(),           // Setup data & subscription
  cleanup(),              // Cleanup subscription
  fetchData(),            // Refetch from DB
  refetch() alias         // Refetch (alias)
}

Usage:
const { data, loading, error, initialize } = useDataSync({
  table: 'activities',
  defaultData: defaultActivities
})

onMounted(() => initialize())
```

### useDataMutation.ts
```typescript
useDataMutation()

Returns:
{
  isLoading: Ref<boolean>,
  error: Ref<string|null>,
  insertData(table, data, callback),
  updateData(table, id, data, callback),
  deleteData(table, id, callback),
  upsertData(table, data, callback)  // Insert or update
}

Usage:
const { updateData } = useDataMutation()
await updateData('tours', tourId, tourData, () => {
  console.log('Tour updated!')
})
```

## 🔐 Security Considerations

### Public Tables (Read-Only)
```sql
-- Activities can be read publicly
CREATE POLICY "Allow public read" ON activities
  FOR SELECT USING (true);

-- Similar for other public tables
```

### Admin Operations
```
Note: Current implementation uses Supabase anon key
This is suitable for read-only data. For admin write access:

Option 1: Use auth users + RLS policies
Option 2: Use service role key on secure backend
Option 3: Setup specific policies for admin operations

Current production setup:
- Public read via anon key ✓
- Public write disabled by default (needs RLS policy)
- Recommend: Move admin ops to secure backend API
```

## 🚀 Deployment Architecture

### Local Development
```
localhost:5173 → src code (hot reload)
                 └─→ Supabase (cloud)
```

### Production on Netlify
```
                  ┌─ GitHub (source)
                  │
                  ▼
            Netlify (CI/CD)
            │
            ├─ npm run build
            │ └─ Vue + Vite compile
            │    └─ Optimized dist/
            │
            ├─ Deploy to CDN
            │
            └─ Your domain
              (e.g., example.netlify.app)
              │
              └─→ Supabase (cloud)
```

### Environment-Specific Configuration
```
.env.local (Development)
├─ VITE_SUPABASE_URL = local/dev project
└─ VITE_SUPABASE_ANON_KEY = dev key

Netlify Environment Variables (Production)
├─ VITE_SUPABASE_URL = production project
└─ VITE_SUPABASE_ANON_KEY = production key
```

## 📈 Performance Optimization

### Build Optimization (vite.config.ts)
```typescript
{
  build: {
    minify: 'terser',      // Terser compression
    rollupOptions: {
      output: {
        manualChunks: {    // Separate vendor bundle
          vendor: ['vue', 'vue-router', '@supabase/supabase-js']
        }
      }
    }
  }
}
```

### Data Fetching Optimization
```
✓ Only fetch on component mount
✓ Reuse data with ref() (cached)
✓ Don't refetch if already loaded
✓ Fallback to default data if error
✓ Real-time updates via WebSocket (efficient)
```

### Bundle Size Impact
```
Vue 3: ~34KB
Vue Router: ~16KB
Supabase JS: ~60KB
App code: ~100-150KB

Total gzipped: ~50-80KB (typical SPA)
```

## 🔄 State Management Pattern

```
No external state manager needed because:

✓ Simple data hierarchy
  └─ Each page manages its own data

✓ Real-time subscriptions handle sync
  └─ No need for Redux/Vuex complexity

✓ Component-level reactivity sufficient
  └─ useDataSync provides everything needed

Pattern:
Pages
 ├─ ActivitiesPage (uses useDataSync)
 ├─ TourPage (uses useDataSync)
 ├─ AdminPage (uses saveFunctions + local state)
 └─ ... (each manages its data independently)

All stay in sync via Supabase Realtime ✨
```

## 📝 Type Safety

### TypeScript Generics
```typescript
// useDataSync is generic
function useDataSync<T extends { id: number }>(options)

// Usage with specific types
interface Activity {
  id: number
  title: string
  images: string[]
  description: string
}

const { data } = useDataSync<Activity>({
  table: 'activities',
  defaultData: defaultActivities
})

// data.value is now Ref<Activity[]>
// Full type safety! ✓
```

### Vue 3 Composition API
```
✓ Type-safe ref operations
✓ Type-safe composable returns
✓ Better tree-shaking than Options API
✓ Easier to test (pure functions)
```

---

**Last Updated**: January 25, 2026
**Version**: 1.0.0
