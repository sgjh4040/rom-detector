import { describe, it, expect } from 'vitest';
import { formatTime } from './cesProtocolHelpers';

describe('formatTime', () => {
  it('0초 → 00:00:00', () => {
    expect(formatTime(0)).toBe('00:00:00');
  });

  it('59초 → 00:00:59', () => {
    expect(formatTime(59)).toBe('00:00:59');
  });

  it('60초 → 00:01:00 (분 단위 올림)', () => {
    expect(formatTime(60)).toBe('00:01:00');
  });

  it('3600초 → 01:00:00 (시 단위 올림)', () => {
    expect(formatTime(3600)).toBe('01:00:00');
  });

  it('3661초 → 01:01:01 (시+분+초 혼합)', () => {
    expect(formatTime(3661)).toBe('01:01:01');
  });

  it('숫자 두 자리 미만은 0 으로 패딩', () => {
    expect(formatTime(5)).toBe('00:00:05');
    expect(formatTime(125)).toBe('00:02:05');
  });

  it('하루 넘는 큰 값도 시 단위로 누적 표시', () => {
    // 25시간 = 90000 초
    expect(formatTime(90000)).toBe('25:00:00');
  });
});
