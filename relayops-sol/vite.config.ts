import stylex from '@stylexjs/unplugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3003,
  },
  plugins: [
    tanstackStart(),
    stylex.vite({
      dev: process.env.NODE_ENV === 'development',
      useCSSLayers: true,
    }),
    viteReact(),
  ],
})
