<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PageHeader from './PageHeader.vue';
import SocialFooter from './SocialFooter.vue';
import { supabase } from './supabase';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  
  if (!email.value || !password.value) {
    errorMessage.value = 'Email dan password harus diisi';
    return;
  }

  isLoading.value = true;
  
  try {
    // Login via Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });

    if (error) {
      errorMessage.value = error.message || 'Email atau password salah';
      isLoading.value = false;
      return;
    }

    if (data.user) {
      // Save auth token to localStorage
      localStorage.setItem('adminAuth', JSON.stringify({
        authenticated: true,
        email: email.value,
        userId: data.user.id,
        timestamp: new Date().toISOString()
      }));
      
      // Redirect to admin panel
      router.push({ name: 'Admin' });
    }
  } catch (err: any) {
    errorMessage.value = 'Terjadi kesalahan saat login';
    console.error('Login error:', err);
  }
  
  isLoading.value = false;
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleLogin();
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <PageHeader title="Admin Login" />
    
    <div class="max-w-[390px] mx-auto px-4 py-12 flex flex-col justify-center min-h-[calc(100vh-200px)]">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-bold text-center mb-2" style="font-family: 'Poppins', sans-serif">
          Admin Panel
        </h2>
        <p class="text-center text-gray-600 text-sm mb-6">
          Silakan login untuk mengakses panel admin
        </p>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {{ errorMessage }}
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="Masukkan email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              @keypress="handleKeyPress"
              :disabled="isLoading"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="Masukkan password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              @keypress="handleKeyPress"
              :disabled="isLoading"
            />
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition duration-200 mt-6"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>

      <div class="mt-12">
        <SocialFooter />
      </div>
    </div>
  </div>
</template>
