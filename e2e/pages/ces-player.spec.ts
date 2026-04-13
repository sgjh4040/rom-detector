import { test, expect } from '@playwright/test';
import { navigateTo, seedDefault } from '../helpers/setup';

test.describe('CES 플레이어 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await seedDefault(page);
    // Navigate to /ces first, then click "가이드 운동 시작" to get proper state
    await navigateTo(page, '/ces');
    await page.getByText(/가이드 운동 시작/).click();
    await page.waitForURL(/#\/ces-player/);
    await page.waitForLoadState('networkidle');
  });

  test('스토리 진행률 바 표시', async ({ page }) => {
    await expect(page.locator('.story-bar-wrap')).toBeVisible();
  });

  test('전체 진행률 표시', async ({ page }) => {
    await expect(page.getByText('전체 진행률')).toBeVisible();
  });

  test('누적 운동 시간 표시', async ({ page }) => {
    await expect(page.getByText('누적 운동 시간')).toBeVisible();
  });

  test('카운트다운 타이머 표시', async ({ page }) => {
    // countdown shows MM:SS format e.g. "00:30"
    const controller = page.locator('.ces-player-ctrl');
    await expect(controller).toBeVisible();
    // Should contain a time pattern
    await expect(controller).toContainText(/\d{2}:\d{2}/);
  });

  test('운동 이름 표시', async ({ page }) => {
    // The exercise header shows "운동 N / N"
    await expect(page.getByText(/운동 \d+ \/ \d+/)).toBeVisible();
  });
});
