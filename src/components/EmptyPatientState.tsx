import React from "react";
import { UserPlus, Activity, Dumbbell, LineChart, Printer } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface EmptyPatientStateProps {
  onAddPatient: () => void;
}

interface FeatureHint {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FEATURES: FeatureHint[] = [
  {
    icon: <Activity size={18} />,
    title: "ROM 측정",
    desc: "7개 관절의 가동범위를 단계별로 기록",
  },
  {
    icon: <Dumbbell size={18} />,
    title: "CES 재활",
    desc: "억제·신장·활성·통합 4단계 맞춤 루틴",
  },
  {
    icon: <LineChart size={18} />,
    title: "추이 분석",
    desc: "회차별 변화와 VAS 통증 지수를 한 눈에",
  },
  {
    icon: <Printer size={18} />,
    title: "리포트 인쇄",
    desc: "측정 결과를 한 페이지로 깔끔하게 출력",
  },
];

/**
 * 등록된 환자가 한 명도 없을 때 표시되는 빈 상태 컴포넌트.
 * 공통 EmptyState (size="lg") 위에 4기능 카드 그리드를 extra 슬롯으로 얹는다.
 */
export const EmptyPatientState: React.FC<EmptyPatientStateProps> = ({
  onAddPatient,
}) => {
  return (
    <EmptyState
      size="lg"
      fullScreen
      fullScreenBgClass="bg-full-viewport page-bg-home"
      icon={<UserPlus size={44} strokeWidth={1.8} />}
      title="환자가 없습니다"
      description={
        <>
          새 환자를 등록하고
          <br />
          ROM 측정을 시작해 보세요
        </>
      }
      cta={{
        label: "새 환자 등록하기",
        onClick: onAddPatient,
        icon: <UserPlus size={18} />,
        variant: "block",
      }}
      extra={
        <div className="feature-hint-grid">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                padding: "1rem 0.9rem",
                background: "rgba(255, 255, 255, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.45)",
                borderRadius: "var(--radius-md)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-xs)",
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                  marginBottom: "0.25rem",
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  lineHeight: 1.45,
                }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
};
