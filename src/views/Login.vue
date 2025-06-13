<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-center text-3xl font-bold text-gray-800 mb-6">
        <img src="../assets/logo.svg" alt="luyen-thi-logo" class="inline-block w-8 h-8 mr-2 -mt-1">
        Đăng nhập hệ thống
      </h1>
      <form @submit.prevent="login" autocomplete="off" novalidate>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="user_name">
            Email
          </label>
          <input
              type="email"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="user_name"
              v-model="email"
              autofocus
          >
          <p v-if="fieldErrors.email" class="text-red-500 text-xs italic mt-1">{{ fieldErrors.email }}</p>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Mật khẩu
          </label>
          <input
              type="password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="password"
              v-model="password"
          >
          <p v-if="fieldErrors.password" class="text-red-500 text-xs italic mt-1">{{ fieldErrors.password }}</p>
        </div>



        <div v-if="generalError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong class="font-bold">Lỗi:</strong>
          <span class="block sm:inline ml-2">{{ generalError }}</span>
        </div>

        <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            :disabled="isLoading"
        >
          <span v-if="isLoading">Đang đăng nhập...</span>
          <span v-else>Đăng nhập</span>
        </button>
        <div class="text-center mt-4 text-sm">
          <div class="text-gray-600">
            Nếu bạn chưa có tài khoản, vui lòng <a href="/register" class="text-blue-500 hover:text-blue-700 font-bold">đăng ký tại đây</a>,
          </div>
          <div class="text-gray-600">
            hoặc <a href="/" class="text-blue-500 hover:text-blue-700 font-bold">quay lại trang chủ tại đây</a>.
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "../stores/auth.ts";
import { useFormErrors } from '../hooks/useFormErrors';

const email = ref('');
const password = ref('');
const isLoading = ref(false);


const { generalError, fieldErrors, clearErrors, handleApiError } = useFormErrors();

const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  isLoading.value = true;
  clearErrors();

  try {
    const response = await fetch('http://localhost:9100/v1/accounts/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Truyền toàn bộ object lỗi từ API vào hàm xử lý lỗi
      handleApiError(errorData);
      // Đảm bảo khối catch được kích hoạt để log lỗi nếu cần
      throw new Error(errorData.message || 'Lỗi đăng nhập');
    }

    const data = await response.json();
    console.log('Login successful:', data);
    const accessToken = data.data.access_token;
    const refreshToken = data.data.refresh_token;
    authStore.setTokens(accessToken, refreshToken);
    router.push('/');

  } catch (error: any) {
    console.error('Login error:', error);

    if (!generalError.value && Object.keys(fieldErrors.value).length === 0) {
      handleApiError(error);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>

</style>