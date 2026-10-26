import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '../HomePage.vue';
import TourPage from '../TourPage.vue';
import TourDetailPage from '../TourDetailPage.vue';
import FastBoatPage from '../FastBoatPage.vue';
import NusaPenidaPage from '../NusaPenidaPage.vue';
import ActivitiesPage from '../ActivitiesPage.vue';
import DropPickupPage from '../DropPickupPage.vue';
import LoginPage from '../LoginPage.vue';
import AdminPage from '../AdminPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/tours',
    name: 'Tours',
    component: TourPage,
  },
  {
    path: '/tour/:id',
    name: 'TourDetail',
    component: TourDetailPage,
  },
  {
    path: '/fastboat',
    name: 'FastBoat',
    component: FastBoatPage,
  },
  {
    path: '/nusa-penida',
    name: 'NusaPenida',
    component: NusaPenidaPage,
  },
  {
    path: '/activities',
    name: 'Activities',
    component: ActivitiesPage,
  },
  {
    path: '/drop-pickup',
    name: 'DropPickup',
    component: DropPickupPage,
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: LoginPage,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: { requiresAuth: true }
  },
];

// Check if user is authenticated
const isAdminAuthenticated = (): boolean => {
  const auth = localStorage.getItem('adminAuth');
  if (!auth) return false;
  
  try {
    const authData = JSON.parse(auth);
    
    // Check if authenticated flag is true
    if (authData.authenticated !== true) {
      return false;
    }
    
    // Check if token has expired
    if (authData.expiresAt) {
      const expirationTime = new Date(authData.expiresAt);
      if (new Date() > expirationTime) {
        // Token expired, remove it
        localStorage.removeItem('adminAuth');
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, _from, next) => {
  const requiresAuth = (to.meta && (to.meta as any).requiresAuth) || false;
  
  if (requiresAuth) {
    if (isAdminAuthenticated()) {
      next();
    } else {
      next({ name: 'AdminLogin' });
    }
  } else {
    next();
  }
});

export default router;
