<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <main class="flex-grow">
      <router-view />
    </main>

  </div>
</template>

<script setup lang="ts">
import Header from "../components/public/Header.vue";

</script>

<style scoped>

</style>