import { test, expect } from '@playwright/test';
import { navigateTo, clearStorage } from '../helpers/setup';
import { TEST_PATIENT, TEST_SESSION } from '../fixtures/test-data';

// clearStorage 는 page.evaluate 를 사용하므로 페이지가 로드된 이후에 호출해야 한다.
// SEED_KEYS.history 가 함수라 page.evaluate 로 직렬화 불가 → 직접 localStorage 키를 지정한다.

async function seedPatient(page: import('@playwright/test').Page) {
  await page.goto('/#/');
  await page.evaluate(
    ({ patient, session }) => {
      localStorage.setItem('rom_session', JSON.stringify(session));
      localStorage.setItem('rom_patients', JSON.stringify([patient]));
    },
    { patient: TEST_PATIENT, session: TEST_SESSION },
  );
}

test.describe('홈 페이지', () => {
  // 페이지 타이틀·기본 UI는 환자가 있을 때만 렌더링되므로 환자 데이터를 먼저 심는다.
  test('페이지 타이틀과 기본 UI 렌더링', async ({ page }) => {
    await navigateTo(page, '/');
    await clearStorage(page);
    await seedPatient(page);
    await navigateTo(page, '/');

    await expect(page.getByText('ROM 측정 시스템')).toBeVisible();
    await expect(page.getByText('평가 및 재활 처방')).toBeVisible();
  });

  test.describe('새 환자 등록 폼', () => {
    test.beforeEach(async ({ page }) => {
      await navigateTo(page, '/');
      await clearStorage(page);
      await navigateTo(page, '/');
      // 빈 상태 → 새 환자 등록하기 클릭 → 폼 진입
      await page.getByRole('button', { name: '새 환자 등록하기' }).click();
    });

    test('환자 이름/나이 입력', async ({ page }) => {
      await page.getByPlaceholder('성함').fill('홍길동');
      await page.getByPlaceholder('세').fill('30');
      await expect(page.getByPlaceholder('성함')).toHaveValue('홍길동');
      await expect(page.getByPlaceholder('세')).toHaveValue('30');
    });

    test('사이드 모드 선택', async ({ page }) => {
      await page.getByRole('button', { name: /좌측만/ }).click();
      await page.getByRole('button', { name: /우측만/ }).click();
      await page.getByRole('button', { name: /양쪽/ }).click();
    });

    test('관절 선택 후 측정 시작 버튼 활성화', async ({ page }) => {
      await page.getByPlaceholder('성함').fill('홍길동');
      await page.getByPlaceholder('세').fill('30');
      // 관절 선택 전: 비활성 버튼 표시
      await expect(page.getByRole('button', { name: /관절을 먼저 선택해주세요/ })).toBeDisabled();
      // 어깨 관절 선택
      await page.getByRole('button', { name: /어깨/ }).click();
      // 관절 선택 후: 측정 시작하기 버튼 활성화
      await expect(page.getByRole('button', { name: /측정 시작하기/ })).toBeEnabled();
    });
  });

  test.describe('기존 환자 선택 후 폼', () => {
    test.beforeEach(async ({ page }) => {
      await navigateTo(page, '/');
      await clearStorage(page);
      await seedPatient(page);
      await navigateTo(page, '/');
      // 기존 환자 chip 클릭
      await page.getByRole('button', { name: /테스트환자/ }).click();
    });

    test('사이드 모드 버튼 렌더링', async ({ page }) => {
      await expect(page.getByRole('button', { name: /좌측만/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /우측만/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /양쪽/ })).toBeVisible();
    });

    test('관절 선택 후 측정 시작 버튼 활성화', async ({ page }) => {
      await page.getByRole('button', { name: /어깨/ }).click();
      await expect(page.getByRole('button', { name: /측정 시작하기/ })).toBeEnabled();
    });
  });
});
