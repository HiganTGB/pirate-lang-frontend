<template>
  <div
      v-if="isVisible"
      :class="[
      'fixed top-4 right-4 z-50 p-4 rounded-xl shadow-xl flex items-start space-x-4 transform transition-all duration-300 ease-out',
      typeClasses,
      animationClasses
    ]"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
  >
    <div :class="['flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full', iconBgClasses]">
      <i :class="[icon, 'text-white text-lg']"></i>
    </div>

    <div class="flex-1 min-w-0">
      <p class="font-semibold text-lg leading-snug text-white">{{ title }}</p>
      <p class="text-sm mt-1 opacity-90 text-white" v-if="message">{{ message }}</p>
    </div>

    <button
        @click="close"
        class="flex-shrink-0 ml-4 p-1 rounded-full text-white hover:bg-opacity-20 transition-colors duration-200"
        :class="closeButtonHoverClasses"
        aria-label="Close notification"
    >
      <i class="fas fa-times text-base"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

// --- Types ---
type ToastType = 'success' | 'error' | 'warning' | 'info';

// --- Props ---
const props = defineProps<{
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}>();


const emit = defineEmits(['close']);


const isVisible = ref(false);
const animationClasses = ref('opacity-0 translate-x-full');
let timeoutId: ReturnType<typeof setTimeout> | null = null;


const typeClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-600';
    case 'error':
      return 'bg-red-600';
    case 'warning':
      return 'bg-yellow-600';
    case 'info':
      return 'bg-blue-600';
    default:
      return 'bg-gray-700';
  }
});

const iconBgClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-700';
    case 'error':
      return 'bg-red-700';
    case 'warning':
      return 'bg-yellow-700';
    case 'info':
      return 'bg-blue-700';
    default:
      return 'bg-gray-800';
  }
});

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'fas fa-check-circle';
    case 'error':
      return 'fas fa-times-circle';
    case 'warning':
      return 'fas fa-exclamation-triangle';
    case 'info':
      return 'fas fa-info-circle';
    default:
      return 'fas fa-bell';
  }
});

const closeButtonHoverClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'hover:bg-green-700';
    case 'error':
      return 'hover:bg-red-700';
    case 'warning':
      return 'hover:bg-yellow-700';
    case 'info':
      return 'hover:bg-blue-700';
    default:
      return 'hover:bg-gray-800';
  }
});


const startTimer = () => {
  if (props.duration !== 0) {
    timeoutId = setTimeout(() => {
      triggerCloseAnimation();
    }, props.duration || 3000);
  }
};

const triggerCloseAnimation = () => {

  animationClasses.value = 'opacity-0 translate-x-full';

  setTimeout(() => {
    isVisible.value = false;
    emit('close', props.id);
  }, 300);
};

const close = () => {

  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  triggerCloseAnimation();
};


onMounted(() => {

  isVisible.value = true;

  setTimeout(() => {
    animationClasses.value = 'opacity-100 translate-x-0';
  }, 50);
  startTimer();
});

onUnmounted(() => {

  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});


watch(() => props.duration, (newDuration) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  startTimer();
});
</script>

<style scoped>

</style>