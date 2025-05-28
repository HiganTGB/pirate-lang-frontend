import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router";
import { createPinia } from 'pinia';
import {useAuthStore} from "./stores/auth.ts";
import { useThemeStore } from './stores/theme';
const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
const authStore = useAuthStore();
authStore.initializeTokens();
app.use(router);
const themeStore = useThemeStore();
themeStore.initializeTheme();
app.mount('#app');
