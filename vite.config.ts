import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  plugins: [vue(), tailwindcss()],
  resolve: {
  },
  server: {
    port: parseInt(env.APP_PORT || '5173'),
  },
  };
});