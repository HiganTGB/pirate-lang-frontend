<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center p-10 bg-white rounded-lg shadow-xl">
      <div>
        <h1 class="text-6xl font-extrabold text-indigo-600">404</h1>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Oops! Trang này không tồn tại.
        </h2>
        <p class="mt-2 text-lg text-gray-600">
          Có vẻ như bạn đã đi lạc. Đừng lo lắng, hãy để chúng tôi đưa bạn trở lại đúng đường.
        </p>
      </div>
      <div class="mt-6">
        <router-link
            to="/"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
        >
          <i class="fas fa-arrow-left mr-2"></i> Quay lại trang chủ
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>