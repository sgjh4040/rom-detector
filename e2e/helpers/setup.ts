import { Page } from '@playwright/test';
import { TEST_PATIENT, TEST_SESSION, TEST_HISTORY, SEED_KEYS } from '../fixtures/test-data';

export async function navigateTo(page: Page, path: string) {
  await page.goto(`/#${path}`);
  await page.waitForLoadState('networkidle');
}

export async function seedDefault(page: Page) {
  await page.goto('/#/');
  await page.evaluate(({ patient, session, keys }) => {
    localStorage.setItem(keys.session, JSON.stringify(session));
    localStorage.setItem(keys.patients, JSON.stringify([patient]));
  }, { patient: TEST_PATIENT, session: TEST_SESSION, keys: SEED_KEYS });
}

export async function seedWithHistory(page: Page) {
  await page.goto('/#/');
  await page.evaluate(({ patient, session, history, patientId, keys }) => {
    localStorage.setItem(keys.session, JSON.stringify(session));
    localStorage.setItem(keys.patients, JSON.stringify([patient]));
    localStorage.setItem(`rom_history_${patientId}`, JSON.stringify(history));
  }, { patient: TEST_PATIENT, session: TEST_SESSION, history: TEST_HISTORY, patientId: TEST_PATIENT.id, keys: SEED_KEYS });
}

export async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}
