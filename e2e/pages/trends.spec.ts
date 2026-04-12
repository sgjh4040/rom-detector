import { test, expect } from '@playwright/test';
import { navigateTo, seedWithHistory } from '../helpers/setup';

test.describe('경과관찰 (트렌드) 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await seedWithHistory(page);
    await navigateTo(page, '/trends?patientId=e2e-patient-1');
  });

  test('환자 이름 표시 (테스트환자)', async ({ page }) => {
    await expect(page.getByText('테스트환자')).toBeVisible();
  });

  test('측정 기록 타이틀 표시', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '측정 기록' })).toBeVisible();
  });

  test('뷰 모드 토글 표시 (대시보드)', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /대시보드/ })).toBeVisible();
  });

  test('뷰 모드 토글 표시 (상세 차트)', async ({ page }) => {
    await expect(page.getByRole('tab', { name: /상세 차트/ })).toBeVisible();
  });

  test('평가 히스토리 섹션 표시', async ({ page }) => {
    await expect(page.getByText(/평가 히스토리/)).toBeVisible();
  });

  test('히스토리 건수 표시 (2건)', async ({ page }) => {
    await expect(page.getByText(/2건/)).toBeVisible();
  });
});
