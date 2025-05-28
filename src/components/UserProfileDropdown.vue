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
          v-if="userProfile?.avatarUrl"
          class="h-8 w-8 rounded-full object-cover"
          :src="userProfile.avatarUrl"
          :alt="userProfile.fullName ? userProfile.fullName + ' avatar' : 'User avatar'"
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
        <h6 class="block px-4 py-2 text-xs text-gray-400" role="menuitem">Xin chào :></h6>
        <a href="/user/general" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
          Tên: {{ userProfile?.fullName || 'N/A' }}
        </a>
        <hr class="border-gray-200" role="none">
        <a href="/user/history" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Lịch sử thi</a>
        <a href="/practice/history" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"> Lịch sử luyện đề</a>
        <a href="/user/writing" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Bài thi viết</a>
        <a href="/user/speaking" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"> Bài thi nói</a>
        <hr class="border-gray-200" role="none">
        <hr class="border-gray-200" role="none">
        <a href="/user/logout" class="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100" role="menuitem">
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
import type { UserProfile } from '@/stores/user';


interface Props {
  userProfile: UserProfile | null;
}

const props = defineProps<Props>();

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};


onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});


onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event: MouseEvent) => {
  const dropdownElement = document.getElementById('user-menu-button')?.closest('.relative');
  if (isOpen.value && dropdownElement && !dropdownElement.contains(event.target as Node)) {
    closeDropdown();
  }
};


const initials = computed(() => {
  if (!props.userProfile?.fullName) return '';
  const parts = props.userProfile.fullName.split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return props.userProfile.fullName[0].toUpperCase();
});

</script>

<style scoped>

</style>