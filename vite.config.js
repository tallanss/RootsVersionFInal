import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://photoroots.fr',
      outDir: 'dist',
      exclude: ['/admin', '/mentions-legales'],
      dynamicRoutes: [
        '/',
        '/photobooth',
        '/tarifs',
        '/galerie',
        '/contact',
        '/le-havre',
        '/rouen',
        '/dieppe',
        '/save-the-date'
      ]
    }),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 75 },
      webp: { lossy: true, quality: 75 },
      avif: { lossy: true, quality: 65 },
      svg: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'sortAttrs' }
        ]
      }
    })
  ],
})
