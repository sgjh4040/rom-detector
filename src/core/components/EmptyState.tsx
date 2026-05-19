// EmptyState.tsx — 앱 전반의 "데이터/기록 없음" 빈 상태 통합 컴포넌트.
// 기존 4곳(EmptyPatientState / NeumoDashboard / CesInfo / Results)에서 제각각 구현되던
// 빈 상태를 단일 컴포넌트로 통일. 모든 시각/CSS 는 components.css 의 .empty-state 클래스로 격리.
import React from "react";

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
    <div className="empty-state__inner" data-size={size}>
      <div className="empty-state__icon" aria-hidden="true">
        {icon}
      </div>
      <h2 className="empty-state__title">{title}</h2>
      {description && <p className="empty-state__desc">{description}</p>}
      {cta && (
        <button
          type="button"
          className={`empty-state__cta empty-state__cta--${cta.variant ?? "block"}`}
          onClick={cta.onClick}
        >
          {cta.icon}
          {cta.label}
        </button>
      )}
      {extra && <div className="empty-state__extra">{extra}</div>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="empty-state empty-state--fullscreen">
        {inner}
      </div>
    );
  }
  return <div className="empty-state">{inner}</div>;
};
