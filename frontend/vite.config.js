import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    root: './src',
    plugins: [react()],
    resolve: {
        alias: [
            { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
            { find: '@widgets', replacement: path.resolve(__dirname, './src/widgets') },
            { find: '@features', replacement: path.resolve(__dirname, './src/features') },
            { find: '@entities', replacement: path.resolve(__dirname, './src/entities') },
            { find: '@shared', replacement: path.resolve(__dirname, './src/shared') },
            { find: '@core', replacement: path.resolve(__dirname, '../core') },
            { find: '@contracts', replacement: path.resolve(__dirname, '../hardhat/artifacts') },
        ],
    },
    build: {
        outDir: path.resolve(__dirname, '../dist'),  // Custom build output directory
    },
})