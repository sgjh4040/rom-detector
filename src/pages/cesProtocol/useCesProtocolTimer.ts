// useCesProtocolTimer.ts — CesProtocol 사이드바 타이머 (NTC 스타일 수동 누적).
// 1초 tick 마다 setSeconds + updatePhaseDuration(activeStage) 양쪽 누적.
import { useState, useEffect, useRef, useCallback } from "react";
import { updatePhaseDuration } from "../../features/session/data/cesTimeTracker";
import type { CesStage } from "../../lib/ces/cesTypes";

interface UseCesProtocolTimerArgs {
  activeStage: CesStage;
  /** localStorage 키 분리에 쓰이는 세션 생성 시각 */
  sessionCreatedAt?: string;
}

interface UseCesProtocolTimerResult {
  seconds: number;
  timerRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
}

export const useCesProtocolTimer = ({
  activeStage,
  sessionCreatedAt,
}: UseCesProtocolTimerArgs): UseCesProtocolTimerResult => {
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((p) => p + 1);
        // 1초마다 실시간(latest) 및 현재 1/2회차 세션(createdAt) 양쪽 모두에 시간 기록
        updatePhaseDuration(activeStage, 1, sessionCreatedAt);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, activeStage, sessionCreatedAt]);

  const toggleTimer = useCallback(() => setTimerRunning((r) => !r), []);
  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setSeconds(0);
  }, []);

  return { seconds, timerRunning, toggleTimer, resetTimer };
};
