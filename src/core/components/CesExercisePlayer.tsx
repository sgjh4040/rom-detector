// CesExercisePlayer.tsx — CES 단계별 운동 표시 (헤더 + 영상 + 운동 리스트).
// audit #13: 헤더 / 운동 row / 유틸을 cesExercisePlayer/ 하위로 분리하여
// orchestrator 만 남김. CesProtocol.tsx 가 이 컴포넌트를 사용한다.
import React, { useEffect, useRef } from "react";
import type { CesExercise } from "../../lib/ces/cesTypes";
import { CesExerciseVideo } from "./CesExerciseVideo";
import { PlayerHeader } from "./cesExercisePlayer/PlayerHeader";
import { ExerciseListItem } from "./cesExercisePlayer/ExerciseListItem";
import { STAGE_CODE_MAP } from "./cesExercisePlayer/helpers";

interface CesExercisePlayerProps {
  exercises: CesExercise[];
  stageId: string;
  activeIndex: number;
  onIndexChange: (idx: number) => void;
}

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
      <PlayerHeader
        current={current}
        stageId={stageId}
        activeIndex={activeIndex}
        total={exercises.length}
      />

      <div
        className="overflow-hidden"
        style={{
          borderRadius: "var(--radius-sm)",
          background: current.youtubeId ? "#000" : "transparent",
          boxShadow: current.youtubeId ? "0 10px 30px rgba(0,0,0,0.1)" : "none",
        }}
      >
        <CesExerciseVideo source={current.youtubeId} title={current.name} />
      </div>

      {/* 운동 리스트 — 깔끔한 행 스타일. 유튜브 ID 있으면 미니 썸네일, 없으면 카테고리 닷 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          marginTop: "1.25rem",
        }}
      >
        {exercises.map((ex, idx) => (
          <ExerciseListItem
            key={ex.id}
            exercise={ex}
            isActive={idx === activeIndex}
            categoryCode={categoryCode}
            onClick={() => onIndexChange(idx)}
          />
        ))}
      </div>
    </div>
  );
};
