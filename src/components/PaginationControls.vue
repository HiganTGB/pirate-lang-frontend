<template>
  <div class="flex justify-center items-center gap-4 mt-8" v-if="totalPages > 0">
    <button
        @click="emitPrevPage"
        :disabled="currentPage === 1 || loading"
        class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Trước
    </button>
    <span class="text-lg font-semibold text-gray-700">Trang {{ currentPage }} / {{ totalPages }}</span>
    <button
        @click="emitNextPage"
        :disabled="currentPage === totalPages || loading"
        class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Sau
    </button>

    <input
        type="number"
        v-model.number="pageInput"
        @keyup.enter="emitGoToPage(pageInput)"
        min="1"
        :max="totalPages"
        class="w-20 p-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
        @click="emitGoToPage(pageInput)"
        class="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
    >
      Đi đến trang
    </button>

    <select
        v-model.number="selectedPageSize"
        class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option v-for="size in pageSizeOptions" :key="size" :value="size">
        {{ size }} / trang
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// Define Props component
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
  pageSizeOptions: {
    type: Array as () => number[],
    default: () => [5, 10, 20, 50],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Define Event
const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
  (e: 'update:pageSize', size: number): void;
  (e: 'prev-page'): void;
  (e: 'next-page'): void;
  (e: 'go-to-page', page: number): void;
}>();

//Init Value
const pageInput = ref(props.currentPage);
const selectedPageSize = ref(props.pageSize);

// Watch function
watch(() => props.currentPage, (newPage) => {
  pageInput.value = newPage;
});
watch(() => props.pageSize, (newSize) => {
  selectedPageSize.value = newSize;
});
watch(selectedPageSize, (newSize) => {
  emit('update:pageSize', newSize);
});


// Change page function
const emitPrevPage = () => {
  emit('prev-page');
};

const emitNextPage = () => {
  emit('next-page');
};

const emitGoToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('go-to-page', page);
  } else if (page < 1) {
    emit('go-to-page', 1);
  } else if (props.totalPages > 0) {
    emit('go-to-page', props.totalPages);
  } else {
    emit('go-to-page', 1);
  }
};
</script>