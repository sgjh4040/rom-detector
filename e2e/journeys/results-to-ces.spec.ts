import { test, expect } from '@playwright/test';
import { navigateTo, seedDefault } from '../helpers/setup';

/**
 * 골든패스 E2E: 결과 → CES → 플레이어
 *
 * 1. seedDefault 로 측정 데이터 사전 주입
 * 2. /#/results 이동 → 환자 정보 확인
 * 3. "CES 재활 시작" 클릭 → /#/ces 이동 확인
 * 4. 4단계 탭(억제, 신장, 활성, 통합) 확인
 * 5. "가이드 운동 시작" 클릭 → /#/ces-player 이동 확인
 * 6. 플레이어 UI (story-bar-wrap 또는 진행률) 렌더링 확인
 */
test('결과 → CES → 플레이어 골든패스', async ({ page }) => {
  // ─── 1. 측정 데이터 주입 ────────────────────────────────────────────
  await seedDefault(page);

  // ─── 2. results 페이지 이동 + 환자 정보 확인 ───────────────────────
  await navigateTo(page, '/results');
  await expect(page.getByText('테스트환자')).toBeVisible();
  await expect(page.getByText(/45세/)).toBeVisible();

  // ─── 3. "CES 재활 시작" 클릭 → /ces ────────────────────────────────
  await page.getByRole('button', { name: /CES 재활 시작/ }).click();
  await page.waitForURL(/\/ces/);
  await expect(page).toHaveURL(/\/ces/);

  // ─── 4. 4단계 탭 확인 ──────────────────────────────────────────────
  await expect(page.getByRole('tab', { name: /억제/ })).toBeVisible();
  await expect(page.getByRole('tab', { name: /신장/ })).toBeVisible();
  await expect(page.getByRole('tab', { name: /활성/ })).toBeVisible();
  await expect(page.getByRole('tab', { name: /통합/ })).toBeVisible();

  // ─── 5. "가이드 운동 시작" 클릭 → /ces-player ────────────────────────
  await page.getByText(/가이드 운동 시작/).click();
  await page.waitForURL(/\/ces-player/);
  await expect(page).toHaveURL(/\/ces-player/);

  // ─── 6. 플레이어 UI 렌더링 확인 ────────────────────────────────────
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.story-bar-wrap')).toBeVisible();
  await expect(page.getByText('전체 진행률')).toBeVisible();
});
