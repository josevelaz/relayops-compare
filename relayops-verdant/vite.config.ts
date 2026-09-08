import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';
export default defineConfig({ plugins: [tanstackStart(), stylex.vite({ useCSSLayers: true }), react()], server: { port: 3000, host: '0.0.0.0' } });
