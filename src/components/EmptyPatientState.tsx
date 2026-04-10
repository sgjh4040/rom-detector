import React from "react";
import { UserPlus, Activity, Dumbbell, LineChart } from "lucide-react";

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
];

/**
 * 등록된 환자가 한 명도 없을 때 표시되는 빈 상태 컴포넌트.
 * 큰 아이콘 + 안내 문구 + CTA + 기능 소개 3장을 노출해 첫 인상을 보강한다.
 */
export const EmptyPatientState: React.FC<EmptyPatientStateProps> = ({
  onAddPatient,
}) => {
  return (
    <div
      className="bg-full-viewport page-bg-home"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem 1.25rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* 메인 CTA 카드 */}
        <div
          className="card neumo-card"
          style={{
            padding: "2.5rem 2rem",
            textAlign: "center",
            borderRadius: "24px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.14), rgba(99,102,241,0.05))",
              color: "#6366f1",
              marginBottom: "1.25rem",
            }}
          >
            <UserPlus size={44} strokeWidth={1.8} />
          </div>

          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            환자가 없습니다
          </h2>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              fontWeight: 600,
              marginBottom: "1.75rem",
              lineHeight: 1.55,
            }}
          >
            새 환자를 등록하고
            <br />
            ROM 측정을 시작해 보세요
          </p>

          <button
            className="btn btn-primary btn-large w-full"
            onClick={onAddPatient}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <UserPlus size={18} />새 환자 등록하기
          </button>
        </div>

        {/* 기능 소개 3장 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                padding: "1rem 0.9rem",
                background: "rgba(255, 255, 255, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.45)",
                borderRadius: "16px",
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
                  borderRadius: "10px",
                  background: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                  marginBottom: "0.25rem",
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
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
      </div>
    </div>
  );
};
