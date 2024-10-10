import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    root: './src/front',
    resolve: {
        alias: [
            { find: '@pages', replacement: path.resolve(__dirname, './src/front/pages') },
            { find: '@widgets', replacement: path.resolve(__dirname, './src/front/widgets') },
            { find: '@features', replacement: path.resolve(__dirname, './src/front/features') },
            { find: '@entities', replacement: path.resolve(__dirname, './src/front/entities') },
            { find: '@shared', replacement: path.resolve(__dirname, './src/front/shared') },
        ],
    },
    css: {
        postcss: path.resolve(__dirname, 'src/front/postcss.config.js'),  // New PostCSS config path
    },
    build: {
        outDir: path.resolve(__dirname, './dist'),  // Custom build output directory
    },
})