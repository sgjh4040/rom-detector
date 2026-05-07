// TimerCard.tsx — CesProtocol 사이드바 상단의 누적 시간 카드 + 현재 운동 라벨.
// 시작/일시정지/초기화 버튼이 useCesProtocolTimer 훅 액션을 호출.
import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { getExMeta, formatTime } from "../../core/utils/cesProtocolHelpers";
import type { CesExercise } from "../../lib/ces/cesTypes";

interface TimerCardProps {
  seconds: number;
  timerRunning: boolean;
  toggleTimer: () => void;
  resetTimer: () => void;
  currentEx: CesExercise | undefined;
}

export const TimerCard: React.FC<TimerCardProps> = ({
  seconds,
  timerRunning,
  toggleTimer,
  resetTimer,
  currentEx,
}) => {
  return (
    <div className="sidebar-stats">
      <div className={`card stat-card-inner ${timerRunning ? "is-active" : ""}`}>
        <p className="sub-label">누적 운동 시간</p>
        <p className="stat-main-val">{formatTime(seconds)}</p>
        <div className="timer-actions">
          <button
            onClick={toggleTimer}
            className={`btn-timer flex justify-center items-center gap-1 ${timerRunning ? "is-running" : "primary"}`}
          >
            {timerRunning ? (
              <>
                <Pause size={14} /> 일시정지
              </>
            ) : (
              <>
                <Play size={14} /> 시작
              </>
            )}
          </button>
          <button
            onClick={resetTimer}
            className="btn-timer btn-reset flex justify-center items-center gap-1"
          >
            <RotateCcw size={14} /> 초기화
          </button>
        </div>
      </div>

      {currentEx && getExMeta(currentEx) && (
        <div>
          <p className="sub-label">현재 운동</p>
          <p className="stat-sub-val" style={{ color: "#63E6BE" }}>
            {getExMeta(currentEx)}
          </p>
        </div>
      )}
    </div>
  );
};
