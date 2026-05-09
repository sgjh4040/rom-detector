// SeverityBadge.tsx — Severity 4단계 표준 배지 컴포넌트 (audit #37)
//
// 두 가지 variant 지원:
// - fill: 배경=색 / 텍스트=흰색 — 강조용 (결과 페이지 동작별 배지)
// - tint: 배경=색×12% / 텍스트=색 / 보더 색 — 부드러운 표시 (홈 칩 등)
import React from "react";
import type { Severity } from "../../lib/romTypes";
import { SEVERITY_COLORS, SEVERITY_SHORT_LABELS } from "../../lib/severityMeta";

interface SeverityBadgeProps {
  severity: Severity;
  /** fill: 채움 / tint: 부드러운 톤 (기본 tint) */
  variant?: "fill" | "tint";
  /** 짧은 라벨("심각") vs 풀 라벨("심각한제한") 노출. 기본 short. */
  label?: "short" | "full";
  /** 작은 사이즈(2xs) vs 기본(xs). 기본 sm. */
  size?: "sm" | "md";
  /** 추가 인라인 스타일 — 마이그레이션 호환성 (기존 미세 조정 필요한 곳) */
  style?: React.CSSProperties;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  variant = "tint",
  label = "short",
  size = "sm",
  style,
}) => {
  const color = SEVERITY_COLORS[severity];
  const text = label === "short" ? SEVERITY_SHORT_LABELS[severity] : severity;

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    borderRadius: "var(--radius-pill)",
    padding: size === "md" ? "0.3rem 0.7rem" : "0.2rem 0.55rem",
    fontSize: size === "md" ? "var(--text-xs)" : "var(--text-2xs)",
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
  };

  const variantStyle: React.CSSProperties =
    variant === "fill"
      ? {
          background: color,
          color: "#fff",
          border: "1px solid transparent",
        }
      : {
          // tint: 12% 배경 + 텍스트=color + 옅은 같은 색 보더
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          color,
          border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        };

  return (
    <span style={{ ...base, ...variantStyle, ...style }} aria-label={`심각도: ${severity}`}>
      {text}
    </span>
  );
};
