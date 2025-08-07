<template>
  <div class="bg-white shadow-md rounded-lg p-6 mb-4 flex items-center justify-between">
    <div class="flex-grow">
      <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ part.part_title }}</h3>
      <p class="text-gray-600 mb-2 text-sm italic">
        Phần {{ part.part_order }}
        <span v-if="part.toeic_part_number" class="ml-2">(TOEIC Part {{ part.toeic_part_number }})</span>
      </p>
      <p v-if="part.description" class="text-gray-700 mb-3">{{ part.description }}</p>

      <div class="flex items-center text-sm text-gray-500 mt-2">
        <span
            v-if="part.is_practice_component"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2"
        >
          <svg class="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          Thực hành
        </span>
        <span
            v-if="part.plan_type"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
        >
          Kế hoạch: {{ part.plan_type }}
        </span>
        <span class="mr-2">Tạo lúc: {{ formatDate(part.created_at) }}</span>
        <span v-if="part.updated_at && part.created_at !== part.updated_at"
        >Cập nhật: {{ formatDate(part.updated_at) }}</span
        >
      </div>
    </div>
    <div class="flex-shrink-0 ml-4">
      <button
          class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out"
      >
        Xem chi tiết
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';


interface ExamPartResponse {
  part_title: string;
  part_order: number;
  description: string;
  is_practice_component: boolean;
  plan_type: string;
  created_at: string;
  updated_at: string;
  toeic_part_number: number;
}

const props = defineProps<{
  part: ExamPartResponse;
}>();

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};
</script>

<style scoped>

</style>