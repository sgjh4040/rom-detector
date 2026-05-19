// Steps.tsx — ImageAngleMeasurer 의 3단계 클릭 안내 (audit #13).
// 사진 위에 ① 팔 끝점 A → ② 관절 중심 → ③ 팔 끝점 B 클릭하도록 가이드.
import React from "react";
import { Pointer, CheckCircle } from "lucide-react";
import { Badge } from "../../../components/redesign/ui/Badge";

const STEP_GUIDE = [
  "① 팔 끝점 A 클릭",
  "② 관절 중심 클릭",
  "③ 팔 끝점 B 클릭",
] as const;

interface StepsProps {
  /** 현재까지 클릭된 점 개수 (0~3) */
  pointCount: number;
}

export const Steps: React.FC<StepsProps> = ({ pointCount }) => {
  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "1rem",
        backgroundColor: "var(--bg)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-pressed)",
      }}
    >
      <p
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 600,
          marginBottom: "0.5rem",
          color: "var(--primary)",
        }}
      >
        {pointCount < 3 ? (
          <>
            <Pointer size={16} className="inline mr-1" />{" "}
            {STEP_GUIDE[pointCount]}
          </>
        ) : (
          <>
            <CheckCircle size={16} className="inline mr-1" /> 측정 완료!
          </>
        )}
      </p>
      <div className="flex gap-2">
        {STEP_GUIDE.map((_, i) => (
          <Badge
            key={i}
            variant={i < pointCount ? "success" : "outline"}
            className="flex-1 justify-center"
          >
            {i < pointCount ? "✓" : `${i + 1}`}
          </Badge>
        ))}
      </div>
    </div>
  );
};
