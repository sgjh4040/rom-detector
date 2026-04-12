import { test, expect } from '@playwright/test';
import { navigateTo } from '../helpers/setup';

test.describe('CES 정보 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await navigateTo(page, '/cesinfo');
  });

  test('레퍼런스 가이드 제목 표시', async ({ page }) => {
    await expect(page.getByText('Corrective Exercise Strategy Reference Guide')).toBeVisible();
  });

  test('어깨 관절 버튼 표시', async ({ page }) => {
    // Sidebar has joint buttons — 어깨 (shoulder) should be visible
    await expect(page.locator('.sidebar-item', { hasText: /어깨/ })).toBeVisible();
  });

  test('무릎 관절 버튼 표시', async ({ page }) => {
    await expect(page.locator('.sidebar-item', { hasText: /무릎/ })).toBeVisible();
  });

  test('프로토콜 섹션 표시 (Inhibit)', async ({ page }) => {
    await expect(page.getByText(/Inhibit/)).toBeVisible();
  });

  test('프로토콜 섹션 표시 (Lengthen)', async ({ page }) => {
    await expect(page.getByText(/Lengthen/)).toBeVisible();
  });

  test('Go to Protocol 버튼 표시', async ({ page }) => {
    await expect(page.getByText(/Go to Protocol/)).toBeVisible();
  });

  test('Go to Protocol 버튼 클릭 시 /ces로 이동', async ({ page }) => {
    await page.getByText(/Go to Protocol/).click();
    await expect(page).toHaveURL(/#\/ces/);
  });
});
