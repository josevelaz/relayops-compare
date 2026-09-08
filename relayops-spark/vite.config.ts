import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import stylex from '@stylexjs/unplugin'
import { nitro } from 'nitro/vite'

const pages = process.env.PAGES === '1'
const pagesRoot = (process.env.PAGES_BASE || '/').replace(/\/?$/, '/')
const base = pages ? `${pagesRoot}spark/` : '/'

export default defineConfig({
  base,
  server: {
    port: 3002,
    host: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      srcDirectory: 'src',
      ...(pages
        ? {
            spa: { enabled: true },
            router: { basepath: base.replace(/\/$/, '') || '/' },
          }
        : {}),
    }),
    stylex.vite({
      dev: true,
      unstable_moduleResolution: {
        type: 'commonJS',
        rootDir: './',
      },
    }),
    viteReact(),
    ...(pages ? [] : [nitro()]),
  ],
})
