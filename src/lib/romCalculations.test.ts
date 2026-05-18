import { describe, it, expect } from 'vitest';
import { calculateSeverity } from './romCalculations';

// 임계값 (romCalculations.ts 내 상수와 일치):
// 정상 ≥ 85%, 경도 ≥ 65%, 중등도 ≥ 45%, 심각 < 45%
// normal === 0 인 동작 (예: 무릎 완전 신전): measured ≥ -5° 면 정상, 아니면 심각한제한
describe('calculateSeverity', () => {
  describe('일반 케이스 (normal > 0)', () => {
    it('측정값이 정상값과 같으면 정상', () => {
      expect(calculateSeverity(180, 180)).toBe('정상');
    });

    it('측정값이 85% 면 정상 경계', () => {
      expect(calculateSeverity(153, 180)).toBe('정상'); // 153/180 = 0.85
    });

    it('정상 임계값 직전(84.9%)은 경도제한', () => {
      expect(calculateSeverity(152, 180)).toBe('경도제한'); // 152/180 ≈ 0.844
    });

    it('65% 면 경도제한 경계', () => {
      expect(calculateSeverity(117, 180)).toBe('경도제한'); // 117/180 = 0.65
    });

    it('45% 면 중등도제한 경계', () => {
      expect(calculateSeverity(81, 180)).toBe('중등도제한'); // 81/180 = 0.45
    });

    it('45% 미만이면 심각한제한', () => {
      expect(calculateSeverity(50, 180)).toBe('심각한제한');
    });

    it('측정값 0 이면 심각한제한', () => {
      expect(calculateSeverity(0, 180)).toBe('심각한제한');
    });
  });

  describe('normal === 0 특수 케이스 (예: 무릎 완전 신전)', () => {
    it('측정값 0 면 정상 (정확히 폄)', () => {
      expect(calculateSeverity(0, 0)).toBe('정상');
    });

    it('측정값이 양수면 정상 (과신전이라도 측정 자체는 정상 범위)', () => {
      expect(calculateSeverity(5, 0)).toBe('정상');
    });

    it('-5 까지는 정상 허용 오차', () => {
      expect(calculateSeverity(-5, 0)).toBe('정상');
    });

    it('-5 미만(굽힘 잔여 큼) 이면 심각한제한', () => {
      expect(calculateSeverity(-6, 0)).toBe('심각한제한');
    });
  });
});
