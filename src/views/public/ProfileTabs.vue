<template>
  <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
        <router-link
            v-for="tab in tabs"
            :key="tab.id"
            :to="tab.path"
            :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            isActiveTab(tab.path)
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
            :aria-current="isActiveTab(tab.path) ? 'page' : undefined"
        >
          {{ tab.name }}
        </router-link>
      </nav>
    </div>

    <div class="p-6">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

interface Tab {
  id: string;
  name: string;
  path: string;
}

const tabs: Tab[] = [
  { id: 'profile', name: 'Profile', path: '/user/profile' },
  { id: 'password', name: 'Đổi mật khẩu', path: '/user/password' },
  { id: 'activity', name: 'Lịch sử đăng kí', path: '/user/history' },

];

const route = useRoute();


const isActiveTab = (tabPath: string) => {
  return route.path === tabPath;
};
</script>

<style scoped>

</style>