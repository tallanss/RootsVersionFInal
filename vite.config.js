import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://photoroot-le-havre.netlify.app/',
      dynamicRoutes: [
        '/',
        '/photobooth',
        '/tarifs',
        '/galerie',
        '/contact',
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
