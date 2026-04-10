import React from "react";
import { UserPlus } from "lucide-react";

interface EmptyPatientStateProps {
  onAddPatient: () => void;
}

/**
 * 등록된 환자가 한 명도 없을 때 표시되는 빈 상태 컴포넌트.
 * 큰 아이콘 + 안내 문구 + 명확한 CTA 버튼으로 첫 사용자를 안내한다.
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
        padding: "2rem",
      }}
    >
      <div
        className="card neumo-card"
        style={{
          maxWidth: "420px",
          width: "100%",
          padding: "3rem 2rem",
          textAlign: "center",
          borderRadius: "24px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.05))",
            color: "#6366f1",
            marginBottom: "1.5rem",
          }}
        >
          <UserPlus size={48} strokeWidth={1.8} />
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
            marginBottom: "2rem",
            lineHeight: 1.5,
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
    </div>
  );
};
