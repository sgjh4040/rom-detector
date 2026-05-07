import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'ROM Detector',
        short_name: 'ROM',
        description: 'ROM 측정 + CES 재활 처방',
        theme_color: '#5C6BC0',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'ko',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 새 SW 가 다운로드되면 즉시 활성화 (waiting 상태 건너뛰기)
        // + 모든 client 인스턴스를 새 SW 로 강제 인계.
        // → iOS PWA 에서 며칠간 옛 버전 보이던 문제 해소.
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}'],
        globIgnores: [
          '**/flutter_app_web/**',
          '**/flutter_atlas/**',
        ],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/flutter_/],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpe?g|svg|webp|gif|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/(www\.)?youtube\.com\//,
            handler: 'NetworkOnly',
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
})
