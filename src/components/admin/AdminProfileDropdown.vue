<template>
  <div class="relative">
    <button
        type="button"
        class="relative flex items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        id="user-menu-button"
        aria-expanded="false"
        aria-haspopup="true"
        @click="toggleDropdown"
    >
      <span class="sr-only">Mở menu người dùng</span>
      <img
          v-if="profileStore.userProfile?.avatar_url"
          class="h-8 w-8 rounded-full object-cover"
          :src="profileStore.userProfile.avatar_url"
          :alt="profileStore.userProfile.full_name ? profileStore.userProfile.full_name + ' avatar' : 'User avatar'"
      />
      <span v-else class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-500">
        <span class="font-medium text-white">{{ initials }}</span>
      </span>
    </button>

    <div
        v-show="isOpen"
        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu-button"
        @click.stop
        @keydown.escape="closeDropdown"
    >

      <div class="py-1" role="none">
        <a href="/admin/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
          Tài khoản của tôi
        </a>
        <a href="/admin/change-password" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
          Đổi mật khẩu
        </a>
        <hr class="border-gray-200" role="none">
        <a href="#" @click.prevent="handleLogout" class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100" role="menuitem">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v-3a2 2 0 00-2-2H5a2 2 0 00-2 2v3m3-3V9a2 2 0 00-2-2H5a2 2 0 00-2 2v7m6-3h-3V9a2 2 0 00-2-2H5a2 2 0 00-2 2v7" />
          </svg>
          Đăng xuất
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../stores/user.ts';
// Import lib
const router = useRouter();

// Init store
const profileStore = useUserStore();

// Init value
const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

// Fetch user profile
onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event: MouseEvent) => {

  const button = document.getElementById('user-menu-button');
  const dropdown = document.querySelector('.relative > div[role="menu"]');

  if (isOpen.value && button && dropdown && !button.contains(event.target as Node) && !dropdown.contains(event.target as Node)) {
    closeDropdown();
  }
};


const initials = computed(() => {
  // Access profile from the store
  if (!profileStore.userProfile?.full_name) return '';
  const parts = profileStore.userProfile.full_name.split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return profileStore.userProfile.full_name[0].toUpperCase();
});
// handle Logout
const handleLogout = () => {
  profileStore.logout();
  closeDropdown();
  router.push('/');
};
</script>

<style scoped>

</style>