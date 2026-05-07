import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// ─── PWA 자동 갱신 (특히 iOS 홈 화면 PWA 대응) ──────────────────
// 배경: vite.config.ts 의 workbox.skipWaiting=true / clientsClaim=true 와 함께,
//       앱이 백그라운드에서 다시 포그라운드로 돌아올 때마다 SW 업데이트를
//       강제 체크하고, 새 SW 가 활성화되면 자동 reload 한다.
// 결과: gh-pages 배포 후 다음 앱 진입에서 즉시 새 화면.
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('새 버전이 있어요. 지금 적용할까요?')) {
            void updateSW(true)
        }
    },
})

// 백그라운드 → 포그라운드 복귀 시 SW 업데이트 강제 체크 (iOS PWA 의 24h 주기 무력화)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        void navigator.serviceWorker?.getRegistration().then(r => r?.update())
    }
})

// 새 SW 가 client 인계 받으면 한 번만 자동 reload (clientsClaim=true 와 함께 동작)
let reloadOnce = false
navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (reloadOnce) return
    reloadOnce = true
    window.location.reload()
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
