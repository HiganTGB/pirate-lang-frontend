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

        <div v-if="currentError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong class="font-bold">Lỗi:</strong>
          <span class="block sm:inline ml-2">{{ currentError.message }}</span>
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
import { useLogin } from '../hooks/useLogin';

const { email, password, isLoading, login, currentError } = useLogin();
</script>

<style scoped>

</style>