<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h1 class="text-center text-3xl font-bold text-gray-800 mb-6">
        <img src="../assets/logo.svg" alt="luyen-thi-logo" class="inline-block w-8 h-8 mr-2 -mt-1">
        Đăng ký tài khoản mới
      </h1>
      <form @submit.prevent="handleRegister" autocomplete="off" novalidate>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="user_name">
            Tên đăng nhập
          </label>
          <input
              type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="user_name"
              v-model="username"
              autofocus
              required
          >
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
              type="email"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="email"
              v-model="email"
              required
          >
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Mật khẩu
          </label>
          <input
              type="password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="password"
              v-model="password"
              required
          >
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="confirm_password">
            Xác nhận mật khẩu
          </label>
          <input
              type="password"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="confirm_password"
              v-model="confirmPassword"
              required
          >
        </div>
        <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Đăng ký
        </button>
        <div class="text-center mt-4 text-sm">
          <div class="text-gray-600">
            Nếu bạn đã có tài khoản, vui lòng <a href="/login" class="text-blue-500 hover:text-blue-700 font-bold">đăng nhập tại đây</a>,
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
import { useAuthStore } from '../stores/auth';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const router = useRouter();
const authStore = useAuthStore();


interface CreateAccountResponse {
  username: string;
  email: string;
  access_token: string;
  refresh_token: string;
}

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Mật khẩu và xác nhận mật khẩu không khớp.');
    return;
  }

  try {
    const response = await fetch('http://localhost:9000/v1/accounts/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: username.value,
        email: email.value,
        password: password.value,
        confirm_password: confirmPassword.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    }


    const data: CreateAccountResponse = await response.json();


    if (data.access_token && data.refresh_token) {
      authStore.setTokens(data.access_token, data.refresh_token);
      alert('Đăng ký tài khoản thành công! Bạn đã được đăng nhập.');
      router.push('/');
    } else {

      alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      router.push('/login');
    }

  } catch (error: any) {
    console.error('Đăng ký thất bại:', error.message);
    alert(`Đăng ký thất bại: ${error.message}`);
  }
};
</script>

<style scoped>

</style>