import { Page } from '@playwright/test';
import { TEST_PATIENT, TEST_SESSION, TEST_HISTORY } from '../fixtures/test-data';

export async function navigateTo(page: Page, path: string) {
  await page.goto(`/#${path}`);
  await page.waitForLoadState('networkidle');
}

export async function seedDefault(page: Page) {
  await page.goto('/#/');
  await page.evaluate(({ patient, session }) => {
    localStorage.setItem('rom_session', JSON.stringify(session));
    localStorage.setItem('rom_patients', JSON.stringify([patient]));
  }, { patient: TEST_PATIENT, session: TEST_SESSION });
}

export async function seedWithHistory(page: Page) {
  await page.goto('/#/');
  await page.evaluate(({ patient, session, history, patientId }) => {
    localStorage.setItem('rom_session', JSON.stringify(session));
    localStorage.setItem('rom_patients', JSON.stringify([patient]));
    localStorage.setItem(`rom_history_${patientId}`, JSON.stringify(history));
  }, { patient: TEST_PATIENT, session: TEST_SESSION, history: TEST_HISTORY, patientId: TEST_PATIENT.id });
}

export async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}
