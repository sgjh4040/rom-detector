// ExerciseListItem.tsx — CesExercisePlayer 의 단일 운동 row (audit #13 분리).
// 좌측: 썸네일/카테고리 닷  /  중앙: 카테고리 코드 + 이름 + 도구  /  우측: 시간/세트.
import React from "react";
import type { CesExercise } from "../../../lib/ces/cesTypes";
import { PlayCircle } from "lucide-react";
import { formatExMeta } from "./helpers";

interface ExerciseListItemProps {
  exercise: CesExercise;
  isActive: boolean;
  /** 단계 한 글자 카테고리 코드 (H/L/A/I) — 부모가 STAGE_CODE_MAP 으로 계산 */
  categoryCode: string;
  onClick: () => void;
}

export const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  exercise,
  isActive,
  categoryCode,
  onClick,
}) => {
  const hasVideo = !!exercise.youtubeId;
  const thumbUrl = hasVideo
    ? `https://img.youtube.com/vi/${exercise.youtubeId}/mqdefault.jpg`
    : null;

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        width: "100%",
        padding: "12px 14px",
        borderRadius: "var(--radius-md)",
        border: isActive
          ? "2px solid var(--primary)"
          : "1px solid rgba(0, 0, 0, 0.06)",
        background: isActive
          ? "rgba(92, 107, 192, 0.08)"
          : "rgba(255, 255, 255, 0.65)",
        boxShadow: isActive
          ? "0 4px 14px rgba(92, 107, 192, 0.12)"
          : "0 1px 3px rgba(0, 0, 0, 0.03)",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        transition: "all 0.15s ease",
      }}
    >
      {/* 좌측: 썸네일 or 카테고리 닷 */}
      {thumbUrl ? (
        <div
          style={{
            width: "56px",
            height: "38px",
            borderRadius: "var(--radius-xs)",
            overflow: "hidden",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <img
            src={thumbUrl}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isActive ? 1 : 0.75,
            }}
          />
          {!isActive && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.3)",
              }}
            >
              <PlayCircle size={18} color="white" />
            </div>
          )}
        </div>
      ) : (
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "var(--radius-circle)",
            background: isActive ? "var(--primary)" : "rgba(0,0,0,0.15)",
            flexShrink: 0,
            marginLeft: "2px",
            transition: "background 0.15s",
          }}
        />
      )}

      {/* 중앙: 운동명 + 도구 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 800,
              color: "var(--primary)",
              opacity: 0.7,
            }}
          >
            {categoryCode}
          </span>
          <span
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: isActive ? 800 : 700,
              color: isActive
                ? "var(--text-primary)"
                : "var(--text-secondary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {exercise.name}
          </span>
        </div>
        {exercise.tools && (
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              color: "var(--text-secondary)",
              opacity: 0.65,
            }}
          >
            {exercise.tools}
          </span>
        )}
      </div>

      {/* 우측: 시간/세트 정보 */}
      <span
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          color: isActive ? "var(--primary)" : "var(--text-secondary)",
          whiteSpace: "nowrap",
          flexShrink: 0,
          opacity: isActive ? 1 : 0.7,
        }}
      >
        {formatExMeta(exercise)}
      </span>
    </button>
  );
};
