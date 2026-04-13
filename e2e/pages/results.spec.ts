import { test, expect } from '@playwright/test';
import { navigateTo, seedDefault } from '../helpers/setup';

test.describe('결과 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await seedDefault(page);
    await navigateTo(page, '/results');
  });

  test('환자 이름 표시 (테스트환자)', async ({ page }) => {
    await expect(page.getByText('테스트환자')).toBeVisible();
  });

  test('환자 나이 표시 (45세)', async ({ page }) => {
    await expect(page.getByText(/45세/)).toBeVisible();
  });

  test('측정 관절 stat 카드 표시', async ({ page }) => {
    await expect(page.getByText('측정 관절')).toBeVisible();
  });

  test('제한 동작 stat 카드 표시', async ({ page }) => {
    await expect(page.getByText('제한 동작')).toBeVisible();
  });

  test('정상 동작 stat 카드 표시', async ({ page }) => {
    await expect(page.getByText('정상 동작')).toBeVisible();
  });

  test('CES 재활 시작 버튼 표시', async ({ page }) => {
    await expect(page.getByRole('button', { name: /CES 재활 시작/ })).toBeVisible();
  });

  test('CES 재활 시작 버튼 클릭 시 /ces로 이동', async ({ page }) => {
    await page.getByRole('button', { name: /CES 재활 시작/ }).click();
    await expect(page).toHaveURL(/\/ces/);
  });
});
