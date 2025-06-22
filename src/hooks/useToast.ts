// src/composables/useToast.ts
import { ref, readonly } from 'vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
    id: number;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

const toasts = ref<ToastNotification[]>([]);
let nextId = 0;

export function useToast() {
    const addToast = (
        type: ToastType,
        title: string,
        message?: string,
        duration?: number
    ) => {
        const newToast: ToastNotification = {
            id: nextId++,
            type,
            title,
            message,
            duration,
        };
        toasts.value.push(newToast);
        console.log('Toast added:', newToast);
    };

    const removeToast = (id: number) => {
        toasts.value = toasts.value.filter(toast => toast.id !== id);
        console.log('Toast removed:', id);
    };

    return {
        toasts: readonly(toasts),
        addToast,
        removeToast,
        showSuccess: (title: string, message?: string, duration?: number) => addToast('success', title, message, duration),
        showError: (title: string, message?: string, duration?: number) => addToast('error', title, message, duration),
        showWarning: (title: string, message?: string, duration?: number) => addToast('warning', title, message, duration),
        showInfo: (title: string, message?: string, duration?: number) => addToast('info', title, message, duration),
    };
}