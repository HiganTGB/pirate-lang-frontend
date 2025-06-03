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
            <router-link to="/products" class="block py-2 px-4 hover:bg-gray-700 transition-colors duration-200">
              <i class="fas fa-box-open mr-2"></i> Role
            </router-link>
          </li>
          <li>
            <router-link to="/products" class="block py-2 px-4 hover:bg-gray-700 transition-colors duration-200">
              <i class="fas fa-box-open mr-2"></i> RBAC
            </router-link>
          </li>
          <li>
            <router-link to="/products" class="block py-2 px-4 hover:bg-gray-700 transition-colors duration-200">
              <i class="fas fa-box-open mr-2"></i> Question
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="flex flex-col flex-grow">
      <header class="bg-white shadow-md p-4 flex justify-between items-center z-10">
        <h1 class="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div class="flex items-center space-x-4">
          <span class="text-gray-700">Welcome, Admin!</span>
          <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200">
            Logout
          </button>
        </div>
      </header>

      <main class="flex-grow p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';


const router = useRouter();


const logout = () => {

  router.push('/login');
};
</script>