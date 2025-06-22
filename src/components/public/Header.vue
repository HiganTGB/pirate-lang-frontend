<template>
  <header class="bg-white shadow-md py-4">
    <div class="container mx-auto flex items-center justify-between px-4">
      <div class="flex-shrink-0 flex items-center space-x-2">
        <a href="/src/public" class="block flex items-center space-x-2">
          <img src="../../assets/logo.svg" alt="Logo" class="h-10">
          <span class="text-xl font-bold text-gray-800">Pirate Language</span>
        </a>
      </div>

      <nav class="hidden md:flex flex-grow justify-center">
        <ul class="flex space-x-8">
          <li class="relative group">
            <a href="#" class="text-gray-700 hover:text-blue-600 font-medium flex items-center">
              Luyện đề
              <i class="fas fa-chevron-down ml-2 text-xs"></i>
            </a>
            <ul class="absolute hidden group-hover:block bg-white shadow-lg rounded-md mt-2 py-2 w-40 z-10">
              <li>
                <a href="/practice/reading" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Reading
                </a>
              </li>
              <li>
                <a href="/practice/listening" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Listening
                </a>
              </li>
              <li>
                <a href="/practice/writing" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Writing
                </a>
              </li>
              <li>
                <a href="/practice/speaking" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Speaking
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/mock-test" class="text-gray-700 hover:text-blue-600 font-medium">
              Thi thử
            </a>
          </li>
          <li>
            <a href="/pricing" class="text-gray-700 hover:text-blue-600 font-medium"> Gói cước
            </a>
          </li>
          <li>
            <a href="/schedule" class="text-gray-700 hover:text-blue-600 font-medium"> Lịch thi
            </a>
          </li>
          <li>
            <a href="/blog" class="text-gray-700 hover:text-blue-600 font-medium"> Bài viết
            </a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center space-x-4 flex-shrink-0">
        <template v-if="authStore.isAuthenticated">
          <UserProfileDropdown class="hidden md:block" />
          <button @click="toggleMobileMenu" class="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none">
            <i class="fas fa-bars text-xl"></i>
          </button>
        </template>
        <template v-else>
          <a href="/login" class="hidden md:block px-4 py-2 text-blue-600 rounded-md hover:bg-gray-100 font-medium transition-colors duration-300">
            Đăng nhập
          </a>
          <a href="/register" class="hidden md:block px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white font-medium transition-colors duration-300">
            Đăng ký
          </a>
          <button @click="toggleMobileMenu" class="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none">
            <i class="fas fa-bars text-xl"></i>
          </button>
        </template>
      </div>
    </div>

    <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        @click="toggleMobileMenu"
    ></div>
    <div
        v-if="isMobileMenuOpen"
        class="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden"
        :class="{ 'translate-x-0': isMobileMenuOpen, 'translate-x-full': !isMobileMenuOpen }"
    >
      <div class="p-4">
        <button class="float-right text-gray-600 hover:text-gray-800" @click="toggleMobileMenu">
          <i class="fas fa-times text-xl"></i>
        </button>
        <div class="mt-8">
          <template v-if="authStore.isAuthenticated">
            <div class="mb-4">
              <UserProfileDropdown :userProfile="userStore.getUserProfile" />
            </div>
            <hr class="border-gray-200 mb-4" />
          </template>
          <template v-else>
            <a href="/login" class="block px-4 py-2 mb-2 text-blue-600 border border-blue-600 rounded-md text-center">
              Đăng nhập
            </a>
            <a href="/register" class="block px-4 py-2 text-blue-600 border border-blue-600 rounded-md text-center">
              Đăng ký
            </a>
            <hr class="border-gray-200 my-4" />
          </template>
        </div>

        <ul class="space-y-4">
          <li class="border-b border-gray-200 pb-2">
            <div @click="toggleSubMenu('practice')" class="flex items-center justify-between cursor-pointer">
              <span class="text-gray-800 font-semibold">Luyện đề</span>
              <i class="fas fa-chevron-down text-sm transition-transform" :class="{'rotate-180': openSubMenu === 'practice'}"></i>
            </div>
            <ul v-if="openSubMenu === 'practice'" class="ml-4 mt-2 space-y-2">
              <li>
                <a href="/practice/reading" class="block text-gray-700 hover:text-blue-600 text-sm">
                  Reading
                </a>
              </li>
              <li>
                <a href="/practice/listening" class="block text-gray-700 hover:text-blue-600 text-sm">
                  Listening
                </a>
              </li>
              <li>
                <a href="/practice/writing" class="block text-gray-700 hover:text-blue-600 text-sm">
                  Writing
                </a>
              </li>
              <li>
                <a href="/practice/speaking" class="block text-gray-700 hover:text-blue-600 text-sm">
                  Speaking
                </a>
              </li>
            </ul>
          </li>
          <li class="border-b border-gray-200 pb-2">
            <a href="/mock-test" class="text-gray-800 font-semibold">Thi thử</a>
          </li>
          <li class="border-b border-gray-200 pb-2">
            <a href="/pricing" class="text-gray-800 font-semibold">Gói cước</a>
          </li>
          <li class="border-b border-gray-200 pb-2">
            <a href="/schedule" class="text-gray-800 font-semibold">Lịch thi</a>
          </li>
          <li class="border-b border-gray-200 pb-2">
            <a href="/blog" class="text-gray-800 font-semibold">Bài viết</a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '../../stores/auth.ts';
import { useUserStore } from '../../stores/user.ts';
import UserProfileDropdown from './UserProfileDropdown.vue';

const authStore = useAuthStore();
const userStore = useUserStore();

const isMobileMenuOpen = ref(false);
const openSubMenu = ref<string | null>(null);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (!isMobileMenuOpen.value) {
    openSubMenu.value = null;
  }
};

const toggleSubMenu = (menuName: string) => {
  if (openSubMenu.value === menuName) {
    openSubMenu.value = null;
  } else {
    openSubMenu.value = menuName;
  }
};


watch(() => authStore.isAuthenticated, (newVal) => {
  if (newVal && !userStore.getUserProfile) {
    userStore.fetchUserProfile();
  }
}, { immediate: true });
</script>

<style scoped>

</style>