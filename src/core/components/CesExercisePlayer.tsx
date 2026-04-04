import React, { useEffect, useRef } from "react";
import type { CesExercise } from "../../lib/ces/cesTypes";
import { YoutubePlayer } from "./YoutubePlayer";
import { CountdownTimer } from "./CountdownTimer";
import { Wrench, PlayCircle } from "lucide-react";

interface CesExercisePlayerProps {
  exercises: CesExercise[];
  stageId: string;
  activeIndex: number;
  onIndexChange: (idx: number) => void;
}

const STAGE_CODE_MAP: Record<string, string> = {
  inhibit: "H",
  lengthen: "L",
  activate: "A",
  integrate: "I",
};

const formatExMeta = (ex: CesExercise): string => {
  const parts: string[] = [];
  if (ex.sets) parts.push(`${ex.sets}세트`);
  if (ex.reps) parts.push(`${ex.reps}회`);
  if (ex.holdSeconds) parts.push(`${ex.holdSeconds}초 유지`);
  return parts.length > 0 ? parts.join(" · ") : ex.tools || "";
};

export const CesExercisePlayer: React.FC<CesExercisePlayerProps> = ({
  exercises,
  stageId,
  activeIndex,
  onIndexChange,
}) => {
  // 스테이지가 바뀔 때만 인덱스 리셋 (exercises 배열 변경 시 무한 루프 방지)
  const prevStageRef = useRef(stageId);
  useEffect(() => {
    if (prevStageRef.current !== stageId) {
      prevStageRef.current = stageId;
      onIndexChange(0);
    }
  }, [stageId, onIndexChange]);

  if (exercises.length === 0) {
    return (
      <div
        className="flex items-center justify-center font-bold"
        style={{ height: "400px", color: "var(--text-muted)" }}
      >
        해당 단계의 운동이 준비되지 않았습니다.
      </div>
    );
  }

  const current = exercises[activeIndex] || exercises[0];
  const categoryCode = STAGE_CODE_MAP[stageId] || "R";

  return (
    <div className="flex flex-col h-full">
      <div className="main-header">
        <h2 className="main-title">{current.name}</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginTop: "0.35rem",
            flexWrap: "wrap",
          }}
        >
          {current.tools && <p className="main-subtitle flex items-center gap-1"><Wrench size={14} /> {current.tools}</p>}
          {/* 세트/횟수/초 뱃지 */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {current.sets && (
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "999px",
                  background: "rgba(28,63,111,0.1)",
                  color: "#1C3F6F",
                }}
              >
                {current.sets}세트
              </span>
            )}
            {current.reps && (
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "999px",
                  background: "rgba(28,63,111,0.1)",
                  color: "#1C3F6F",
                }}
              >
                {current.reps}회
              </span>
            )}
            {current.holdSeconds && (
              <div className="flex flex-col gap-2">
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    padding: "0.2rem 0.55rem",
                    borderRadius: "999px",
                    background: "rgba(99,230,190,0.15)",
                    color: "#099268",
                  }}
                >
                  {current.holdSeconds}초 유지
                </span>
                <CountdownTimer initialSeconds={current.holdSeconds} />
              </div>
            )}
          </div>
        </div>
        {current.description && (
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              marginTop: "0.5rem",
              lineHeight: 1.6,
            }}
          >
            {current.description}
          </p>
        )}
      </div>

      <div
        className="overflow-hidden"
        style={{
          borderRadius: "4px",
          background: "#000",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <YoutubePlayer youtubeId={current.youtubeId} />
      </div>

      <div className="ex-tray">
        {exercises.map((ex, idx) => (
          <div
            key={ex.id}
            className="ex-tray-item"
            onClick={() => onIndexChange(idx)}
          >
            <div
              className={`ex-tray-thumb ${idx === activeIndex ? "is-active" : ""}`}
            >
              <img
                src={`https://img.youtube.com/vi/${ex.youtubeId || "dQw4w9WgXcQ"}/mqdefault.jpg`}
                alt={ex.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {idx !== activeIndex && <div className="play-overlay"><PlayCircle size={32} color="white" /></div>}
            </div>

            <div className="flex flex-col">
              <div className="ex-meta-top">
                <span className="ex-category-code">{categoryCode} |</span>
                <span className="ex-tray-title">{ex.name}</span>
                <span className="ex-tray-time">{formatExMeta(ex)}</span>
              </div>
              <p className="ex-tray-info">{ex.tools || "No Material needed"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
