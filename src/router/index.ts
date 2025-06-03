
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from "../views/Login.vue";
import { useAuthStore } from '../stores/auth';
import Register from "../views/Register.vue";
import DefaultLayoutAdmin from "../components/DefaultLayoutAdmin.vue";
import DashboardView from "../views/admin/DashboardView.vue";
import DefaultLayout from "../components/DefaultLayout.vue";

const routes = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            {
                path: '',
                component: Home,
                meta: { requiresAuth: false },
            }
        ]
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
    {
        path: '/admin',
        component: DefaultLayoutAdmin,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/dashboard'
            },
            {
                path: '/dashboard',
                name: 'dashboard',
                component: DashboardView
            },
        ]
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: () => import('../views/NotFoundView.vue')
    }

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

        next("/");
    } else {

        next();
    }
});

export default router;