import { test, expect } from '@playwright/test';
import { navigateTo, seedDefault } from '../helpers/setup';

test.describe('측정 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await seedDefault(page);
    await navigateTo(page, '/measure?joint=shoulder&side=좌측');
  });

  test('관절 이름 표시 (어깨)', async ({ page }) => {
    // Header shows side + joint name
    await expect(page.getByText(/어깨/)).toBeVisible();
  });

  test('동작 진행 텍스트 표시', async ({ page }) => {
    // "1 / N 동작 측정 중"
    await expect(page.getByText(/동작 측정 중/)).toBeVisible();
  });

  test('이전/다음 버튼 표시', async ({ page }) => {
    await expect(page.getByRole('button', { name: '이전' })).toBeVisible();
    await expect(page.getByRole('button', { name: /다음|완료|계속/ })).toBeVisible();
  });

  test('진행률 퍼센트 표시', async ({ page }) => {
    // The header__pct shows a number with %
    const pctEl = page.locator('.rom-header__pct');
    await expect(pctEl).toBeVisible();
    await expect(pctEl).toContainText('%');
  });
});
