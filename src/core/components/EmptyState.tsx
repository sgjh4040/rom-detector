// EmptyState.tsx — 앱 전반의 "데이터/기록 없음" 빈 상태 통합 컴포넌트.
// 기존 4곳(EmptyPatientState / NeumoDashboard / CesInfo / Results)에서 제각각 구현되던
// 빈 상태를 단일 컴포넌트로 통일. 시각은 Tailwind utility 로 인라인 (Phase 3 Tier 2a 마이그레이션).
import React from "react";
import { cn } from "../../lib/cn";

interface EmptyStateCta {
  label: string;
  onClick: () => void;
  /** 라벨 앞에 붙는 아이콘 (선택) */
  icon?: React.ReactNode;
  /** block: 카드 폭만큼 큰 버튼 (홈 환자 없음 톤) / pill: 둥근 알약 버튼 (NeumoDashboard 톤) */
  variant?: "block" | "pill";
}

interface EmptyStateProps {
  /** 큰 아이콘 슬롯 (Lucide 아이콘 / 이모지 / 임의 JSX). lg 사이즈일 땐 원형 그라디언트 박스 안에 배치 */
  icon: React.ReactNode;
  /** 굵은 제목 */
  title: string;
  /** 보조 설명 (줄바꿈 가능, ReactNode 허용) */
  description?: React.ReactNode;
  /** 주요 액션 버튼 (선택) */
  cta?: EmptyStateCta;
  /** 추가 슬롯 — 4 기능 카드 그리드 같은 부가 영역 */
  extra?: React.ReactNode;
  /** 시각 톤. sm: 카드 안 안내 / md: 중간 톤 / lg: 큰 첫 진입용 */
  size?: "sm" | "md" | "lg";
  /** 풀스크린 래퍼로 감쌀지 (홈 첫 진입 케이스에서 true). 부모가 이미 카드면 false */
  fullScreen?: boolean;
}

const INNER_SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "max-w-[360px] px-5 py-6 gap-3",
  md: "max-w-[520px] px-6 py-9 gap-4",
  lg: "max-w-[560px] px-8 py-10 gap-5 bg-[var(--glass-bg-strong)] border border-white/45 rounded-lg shadow-[0_12px_32px_rgba(0,0,0,0.06)]",
};

const ICON_SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "text-2xl opacity-55",
  md: "text-3xl opacity-50 w-16 h-16",
  lg: "w-[88px] h-[88px] rounded-full bg-gradient-to-br from-indigo-500/15 to-indigo-500/5 mb-1",
};

const TITLE_SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

const DESC_SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "text-xs opacity-85",
  md: "text-sm opacity-80",
  lg: "text-base",
};

const CTA_VARIANT_CLASSES: Record<"block" | "pill", string> = {
  block: "w-full px-5 py-[0.85rem] rounded-md text-base",
  pill: "px-7 py-3 rounded-full text-base",
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  cta,
  extra,
  size = "md",
  fullScreen,
}) => {
  const inner = (
    <div
      className={cn(
        "w-full flex flex-col items-center text-center gap-4",
        INNER_SIZE_CLASSES[size],
      )}
    >
      <div
        className={cn(
          "inline-flex items-center justify-center text-[var(--primary)]",
          ICON_SIZE_CLASSES[size],
        )}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h2
        className={cn(
          "font-black text-[var(--text-primary)] tracking-[-0.02em] m-0",
          TITLE_SIZE_CLASSES[size],
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-[var(--text-secondary)] font-semibold leading-relaxed m-0",
            DESC_SIZE_CLASSES[size],
          )}
        >
          {description}
        </p>
      )}
      {cta && (
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center gap-2 bg-[var(--primary)] text-white border-0 font-extrabold cursor-pointer transition-all mt-2 hover:bg-[#4a5cb0] hover:-translate-y-px hover:shadow-[0_6px_16px_rgba(92,107,192,0.25)]",
            CTA_VARIANT_CLASSES[cta.variant ?? "block"],
          )}
          onClick={cta.onClick}
        >
          {cta.icon}
          {cta.label}
        </button>
      )}
      {extra && <div className="w-full">{extra}</div>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen px-5 py-8">
        {inner}
      </div>
    );
  }
  return <div className="flex items-center justify-center">{inner}</div>;
};
