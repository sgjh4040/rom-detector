import { test, expect } from '@playwright/test';
import { navigateTo, clearStorage } from '../helpers/setup';

/**
 * 골든패스 E2E: 환자 등록 → 측정 → 결과
 *
 * 1. 빈 localStorage 에서 홈 화면 시작
 * 2. "새 환자 등록하기" 클릭 → 폼 진입
 * 3. 이름/나이 입력
 * 4. 어깨 관절 선택, 좌측만 모드
 * 5. "측정 시작하기" → /#/measure
 * 6. 모든 동작 스텝을 "다음 측정 이동" / "모든 측정 완료" 클릭으로 완료
 * 7. /#/results 도착 + 환자 이름 확인
 */
test('환자 등록 → 어깨 측정 → 결과 페이지 도달', async ({ page }) => {
  // ─── 1. 빈 상태로 홈 이동 ───────────────────────────────────────────
  await navigateTo(page, '/');
  await clearStorage(page);
  await navigateTo(page, '/');

  // ─── 2. 새 환자 등록하기 클릭 ──────────────────────────────────────
  await page.getByRole('button', { name: '새 환자 등록하기' }).click();

  // ─── 3. 이름/나이 입력 ─────────────────────────────────────────────
  await page.getByPlaceholder('성함').fill('테스트유저');
  await page.getByPlaceholder('세').fill('35');

  // ─── 4. 좌측만 모드 선택 + 어깨 관절 선택 ─────────────────────────
  await page.getByRole('button', { name: /좌측만/ }).click();
  await page.getByRole('button', { name: /어깨/ }).click();

  // ─── 5. 측정 시작하기 클릭 → /measure 이동 ─────────────────────────
  const startBtn = page.getByRole('button', { name: /측정 시작하기/ });
  await expect(startBtn).toBeEnabled();
  await startBtn.click();

  await page.waitForURL(/\/measure/);
  await expect(page).toHaveURL(/\/measure/);

  // ─── 6. 측정 스텝 반복: "다음 측정 이동" 또는 "모든 측정 완료" ────────
  // 어깨 좌측에는 5개 동작(flexion/extension/abduction/internal_rotation/external_rotation)
  // 버튼 텍스트: "다음 측정 이동 →" or "모든 측정 완료 →"
  const nextBtn = page.locator('.rom-footer__next');

  // 최대 10번 반복 (무한루프 방지)
  for (let i = 0; i < 10; i++) {
    await expect(nextBtn).toBeVisible();
    const btnText = await nextBtn.textContent();
    await nextBtn.click();

    // "모든 측정 완료" 클릭 후에는 /results 로 이동
    if (btnText && btnText.includes('완료')) {
      break;
    }

    // URL 이 /results 로 바뀌었으면 루프 종료
    const currentUrl = page.url();
    if (currentUrl.includes('/results')) break;
  }

  // ─── 7. /results 확인 + 환자 이름 확인 ────────────────────────────
  await page.waitForURL(/\/results/);
  await expect(page).toHaveURL(/\/results/);
  await expect(page.getByText('테스트유저')).toBeVisible();
});
