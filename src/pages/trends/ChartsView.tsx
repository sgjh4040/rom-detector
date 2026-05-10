// ChartsView.tsx — Trends 페이지의 "상세 차트" 모드 (audit #13).
// VAS 통증 지수 변화 + 관절별 트렌드 카드. 데이터는 oldest-first 가공이 필수.
import React from "react";
import type { RomSession } from "../../lib/romTypes";
import { JOINTS } from "../../lib/romData";
import { TrendGraph } from "../../features/trends/presentation/TrendGraph";
import {
  JointTrendCard,
  formatDate,
} from "../../features/trends/presentation/JointTrendCard";

interface ChartsViewProps {
  /** 오래된 순으로 정렬된 측정 히스토리 (차트가 시간순으로 그려지도록) */
  reversedHistory: RomSession[];
}

export const ChartsView: React.FC<ChartsViewProps> = ({ reversedHistory }) => {
  return (
    <div
      className="mb-16"
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {/* VAS 통증 지수 — targetValue=0 (무통)이 목표선 */}
      <div
        className="card neumo-card"
        style={{
          padding: "20px 16px 8px",
          borderRadius: "var(--radius-lg)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            padding: "4px 8px 12px",
          }}
        >
          <h3
            className="text-xl font-black"
            style={{ letterSpacing: "-0.01em" }}
          >
            통증 지수 변화
          </h3>
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--text-secondary)",
              opacity: 0.7,
            }}
          >
            낮을수록 좋음 · 목표 0
          </span>
        </div>
        <TrendGraph
          data={reversedHistory.map((s, idx) => ({
            // [audit #36] 회차 + 날짜 병기로 시간 간격 정보 보존. 다른 차트와 동일 포맷.
            label: `${idx + 1}회 (${formatDate(s.createdAt)})`,
            value: s.vasScore || 0,
          }))}
          normalRange={10}
          targetValue={0}
          unit=""
        />
      </div>

      {JOINTS.map((joint) => (
        <JointTrendCard
          key={joint.id}
          joint={joint}
          history={reversedHistory}
        />
      ))}
    </div>
  );
};
