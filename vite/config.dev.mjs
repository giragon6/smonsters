import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        react(),
    ],
    server: {
        port: 8080
    },
    esbuild: {
        supported: {
        'top-level-await': true
        },
    },  
    build: {
        target: 'es2022',
    }
})
