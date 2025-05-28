
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from "@/views/Login.vue";
import { useAuthStore } from '../stores/auth';
import Register from "../views/Register.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: false }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guestOnly: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { guestOnly: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {

        next({ name: 'Login' });
    } else if (to.meta.guestOnly && isAuthenticated) {

        next({ name: 'Home' });
    } else {

        next();
    }
});

export default router;