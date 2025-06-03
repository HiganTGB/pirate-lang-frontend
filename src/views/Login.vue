<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-center text-3xl font-bold text-gray-800 mb-6">
        <img src="../assets/logo.svg" alt="luyen-thi-logo" class="inline-block w-8 h-8 mr-2 -mt-1">
        Đăng nhập hệ thống
      </h1>
      <form @submit.prevent="handleLogin" autocomplete="off" novalidate>
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
        </div>
        <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Đăng nhập
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
import {useAuthStore} from "../stores/auth.ts";


const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:9000/v1/accounts/login', {
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
      throw new Error(errorData.message || 'Đăng nhập thất bại');
    }
    const data = await response.json();

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    if (accessToken && refreshToken) {
      authStore.setTokens(accessToken, refreshToken);
      alert('Đăng nhập thành công!');
      router.push('/');
    } else {
      throw new Error('API không trả về token hợp lệ.');
    }

  } catch (error) {
    console.error('Đăng nhập thất bại:', error.message);
    alert('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
  }
};
</script>

<style scoped>

</style>