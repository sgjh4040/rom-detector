// PlayerActions.tsx — CesPlayer B영역 하단의 컨트롤 버튼 그룹
// (재시작 / 건너뛰기(break) / 일시정지·재생 / 종료)
import React from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import type { BREAK_META } from "../../../lib/ces/CesPlayerTypes";

type BreakMetaValue = (typeof BREAK_META)[keyof typeof BREAK_META];

interface PlayerActionsProps {
  isFinished: boolean;
  isBreak: boolean;
  breakMeta: BreakMetaValue | null;
  isPaused: boolean;
  onTogglePause: () => void;
  onExit: () => void;
  onRestart: () => void;
  onSkipBreak: () => void;
}

/** 메인 액션 버튼들 공통 스타일 — flex 정렬 통일로 모바일 줄바꿈 방지 */
const primaryButtonBase: React.CSSProperties = {
  flex: 1,
  padding: "0.9rem",
  borderRadius: "var(--radius-xs)",
  border: "none",
  color: "#fff",
  fontWeight: 800,
  fontSize: "var(--text-sm)",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  transition: "background 0.2s",
};

export const PlayerActions: React.FC<PlayerActionsProps> = ({
  isFinished,
  isBreak,
  breakMeta,
  isPaused,
  onTogglePause,
  onExit,
  onRestart,
  onSkipBreak,
}) => {
  return (
    <div style={{ display: "flex", gap: "0.75rem" }}>
      {isFinished ? (
        <button
          onClick={onRestart}
          style={{ ...primaryButtonBase, background: "var(--ink-strong)" }}
        >
          <RotateCcw size={16} /> 다시 시작
        </button>
      ) : isBreak && breakMeta ? (
        <button
          onClick={onSkipBreak}
          style={{ ...primaryButtonBase, background: breakMeta.color }}
        >
          <SkipForward size={16} /> 건너뛰기
        </button>
      ) : (
        <button
          onClick={onTogglePause}
          style={{
            ...primaryButtonBase,
            background: isPaused ? "#4ade80" : "var(--warning)",
          }}
        >
          {isPaused ? (
            <>
              <Play size={16} /> 재생
            </>
          ) : (
            <>
              <Pause size={16} /> 일시정지
            </>
          )}
        </button>
      )}
      <button
        onClick={onExit}
        aria-label="운동 종료"
        title="운동 종료"
        style={{
          padding: "0.9rem 1.25rem",
          borderRadius: "var(--radius-xs)",
          border: "1.5px solid #e5e7eb",
          background: "#fff",
          color: "#6b7280",
          fontWeight: 800,
          fontSize: "var(--text-sm)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </button>
    </div>
  );
};
