<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 bg-gray-800 text-white flex-shrink-0">
      <div class="p-4 text-center text-xl font-bold border-b border-gray-700">Pirate Admin</div>
      <nav class="mt-4">
        <ul>
          <li>
            <router-link to="/dashboard" class="block py-2 px-4 hover:bg-gray-700 transition-colors duration-200">
              <i class="fas fa-home mr-2"></i> Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/users" class="block py-2 px-4 hover:bg-gray-700 transition-colors duration-200">
              <i class="fas fa-users mr-2"></i> Users
            </router-link>
          </li>
          <li>
            <div class="block py-2 px-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer" @click="toggleSubMenu('rbac')">
              <i class="fas fa-users mr-2"></i> RBAC <i :class="{'fas fa-chevron-down ml-2': !isSubMenuOpen('rbac'), 'fas fa-chevron-up ml-2': isSubMenuOpen('rbac')}"></i>
            </div>
            <ul v-if="isSubMenuOpen('rbac')" class="pl-8 bg-gray-700">
              <li>
                <router-link to="/rbac/roles" class="block py-2 px-4 hover:bg-gray-600 transition-colors duration-200">
                  <i class="fas fa-user-tie mr-2"></i> Role
                </router-link>
              </li>
              <li>
                <router-link to="/rbac/permissions" class="block py-2 px-4 hover:bg-gray-600 transition-colors duration-200">
                  <i class="fas fa-history mr-2"></i> Permission
                </router-link>
              </li>
            </ul>
          </li>
          <li>
            <div class="block py-2 px-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer" @click="toggleSubMenu('library')">
              <i class="fas fa-users mr-2"></i> Library <i :class="{'fas fa-chevron-down ml-2': !isSubMenuOpen('library'), 'fas fa-chevron-up ml-2': isSubMenuOpen('library')}"></i>
            </div>
            <ul v-if="isSubMenuOpen('library')" class="pl-8 bg-gray-700">
              <li>
                <router-link to="/users/manager" class="block py-2 px-4 hover:bg-gray-600 transition-colors duration-200">
                  <i class="fas fa-user-tie mr-2"></i> Part
                </router-link>
              </li>
              <li>
                <router-link to="/users/history" class="block py-2 px-4 hover:bg-gray-600 transition-colors duration-200">
                  <i class="fas fa-history mr-2"></i> Questions
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="flex flex-col flex-grow">
      <header class="bg-white shadow-md p-4 flex justify-between items-center z-10">
        <h1 class="text-2xl font-semibold text-gray-800"></h1>

        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <div class="mb-4">
              <AdminProfileDropdown :userProfile="userStore.getUserProfile" />
            </div>
            <hr class="border-gray-200 mb-4" />
          </template>
        </div>
      </header>

      <main class="flex-grow p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">


import {useDropDown} from '../hooks/useDropDown.ts'
import { useAuthStore } from '../stores/auth.ts';
import { useUserStore } from '../stores/user.ts';

import {watch} from "vue";
import AdminProfileDropdown from "../components/admin/AdminProfileDropdown.vue";


const authStore = useAuthStore();
const userStore = useUserStore();



const { toggleSubMenu, isSubMenuOpen } = useDropDown();
watch(() => authStore.isAuthenticated, (newVal) => {
  if (newVal && !userStore.getUserProfile) {
    userStore.fetchUserProfile();
  }
}, { immediate: true });
</script>