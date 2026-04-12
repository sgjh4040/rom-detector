import { test, expect } from '@playwright/test';
import { navigateTo, seedDefault } from '../helpers/setup';

test.describe('CES 프로토콜 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await seedDefault(page);
    await navigateTo(page, '/ces');
  });

  test('4단계 탭 표시 (억제, 신장, 활성, 통합)', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /억제/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /신장/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /활성/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /통합/ })).toBeVisible();
  });

  test('자동 재생 시작 버튼 표시', async ({ page }) => {
    await expect(page.getByText(/자동 재생 시작/)).toBeVisible();
  });

  test('Muscle Balance 섹션 표시', async ({ page }) => {
    await expect(page.getByText('Muscle Balance Status')).toBeVisible();
  });

  test('Overactive / Underactive 섹션 표시', async ({ page }) => {
    await expect(page.getByText(/Overactive/)).toBeVisible();
    await expect(page.getByText(/Underactive/)).toBeVisible();
  });
});
