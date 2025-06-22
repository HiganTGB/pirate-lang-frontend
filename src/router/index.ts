
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/public/Home.vue';
import Login from "../views/Login.vue";
import { useAuthStore } from '../stores/auth';
import Register from "../views/Register.vue";
import AdminLayout from "../layout/AdminLayout.vue";
import DashboardView from "../views/admin/DashboardView.vue";
import UserLayout from "../layout/UserLayout.vue";
import UserList from "../views/admin/UserList.vue";
import Profile from "../views/Profile.vue";
import ProfileTabs from "../views/public/ProfileTabs.vue";
import HistoryContent from "../views/public/HistoryContent.vue";
import ChangePassword from "../views/ChangePassword.vue";
import UserDetail from "../views/admin/UserDetail.vue";
import EmptyLayout from "../layout/EmptyLayout.vue";


const routes = [
    {
        path: '/',
        component: UserLayout,
        children: [
            {
                path: '',
                component: Home,
                meta: { requiresAuth: false },
            },
            {
                path:'user',
                component: ProfileTabs,
                meta: {requiresAuth: true},
                children:[
                    {
                        path : 'profile',
                        component : Profile,
                    },
                    {
                        path : 'history',
                        component: HistoryContent,
                    },
                    {
                        path : 'password',
                        component: ChangePassword,
                    }
                ]
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
        component: AdminLayout,
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
            {
                path: '',
                redirect: '/dashboard'
            },
            {
                path: '/users',
                name: 'users',
                component: UserList,
            },
            {
                path: '/users/:id',
                name: 'UserDetail',
                component: UserDetail,
                props: true,
            },
                path : 'profile',
                name :'My profile',
                component: Profile,
            },
            {
              path: 'change-password',
              name : 'Password',
              component:   ChangePassword,
            }
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