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
      lastmod: new Date(),
      changefreq: 'weekly',
      priority: 0.7,
      exclude: ['/admin', '/mentions-legales'],
      // '/' est ajouté automatiquement depuis index.html — ne pas le répéter ici
      dynamicRoutes: [
        '/photobooth',
        '/tarifs',
        '/galerie',
        '/contact',
        '/save-the-date',
        '/location-photobooth-le-havre',
        '/location-photobooth-rouen',
        '/location-photobooth-dieppe',
        '/location-photobooth-montivilliers',
        '/location-photobooth-harfleur',
        '/location-photobooth-fecamp',
        '/location-photobooth-etretat',
        '/location-photobooth-bolbec',
        '/location-photobooth-lillebonne',
        '/location-photobooth-yvetot',
        '/location-photobooth-saint-romain-de-colbosc'
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
