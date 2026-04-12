import { test, expect } from '@playwright/test';
import { navigateTo, seedDefault } from '../helpers/setup';

test.describe('설정 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await seedDefault(page);
    await navigateTo(page, '/settings');
  });

  test('설정 타이틀 표시', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '설정' })).toBeVisible();
  });

  test('등록 환자 데이터 카드 표시', async ({ page }) => {
    await expect(page.getByText('등록 환자')).toBeVisible();
  });

  test('측정 기록 데이터 카드 표시', async ({ page }) => {
    await expect(page.getByText('측정 기록', { exact: true })).toBeVisible();
  });

  test('데이터 내보내기 버튼 표시', async ({ page }) => {
    await expect(page.getByRole('button', { name: /데이터 내보내기/ })).toBeVisible();
  });

  test('모든 환자 데이터 삭제 버튼 표시', async ({ page }) => {
    await expect(page.getByRole('button', { name: /모든 환자 데이터 삭제/ })).toBeVisible();
  });

  test('버전 정보 표시', async ({ page }) => {
    await expect(page.getByText(/버전/)).toBeVisible();
  });
});
