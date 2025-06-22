<script setup lang="ts">
import ToastNotification from './components/ToastNotification.vue'; // Đảm bảo đường dẫn đúng
import { useToast } from './hooks/useToast'; // Đảm bảo đường dẫn đúng

const { toasts, removeToast } = useToast();

</script>

<template>
  <div id="app">
    <router-view></router-view>
    <div class="fixed top-4 right-4 z-[1000] space-y-3">
      <ToastNotification
          v-for="toast in toasts"
          :key="toast.id"
          :id="toast.id"
          :type="toast.type"
          :title="toast.title"
          :message="toast.message"
          :duration="toast.duration"
          @close="removeToast"
      />
    </div>
  </div>
</template>

<style scoped>

</style>