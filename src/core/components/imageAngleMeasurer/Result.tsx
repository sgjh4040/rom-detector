// Result.tsx — ImageAngleMeasurer 의 측정 각도 결과 + 호 반전/저장 버튼 (audit #13).
import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "../../../components/redesign/ui/Button";

interface ResultProps {
  angle: number;
  isInverted: boolean;
  onToggleInversion: () => void;
  onSave: () => void;
}

export const Result: React.FC<ResultProps> = ({
  angle,
  isInverted,
  onToggleInversion,
  onSave,
}) => {
  return (
    <div
      style={{
        marginTop: "1.25rem",
        padding: "1.25rem",
        backgroundColor: "var(--bg)",
        borderRadius: "var(--radius-md)",
        textAlign: "center",
        boxShadow: "var(--shadow-raised)",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}
        >
          측정된 각도
        </span>
        <Button
          type="button"
          variant={isInverted ? "default" : "outline"}
          size="sm"
          onClick={onToggleInversion}
        >
          <RotateCcw size={14} /> 호 반전 {isInverted ? "(외각)" : "(내각)"}
        </Button>
      </div>
      <p
        style={{
          fontSize: "var(--text-3xl)",
          fontWeight: 900,
          color: "var(--primary)",
          lineHeight: 1,
          marginBottom: "1rem",
        }}
      >
        {angle}°
      </p>
      <Button
        type="button"
        variant="default"
        size="lg"
        onClick={onSave}
        className="w-full"
      >
        이 측정값 저장하기
      </Button>
    </div>
  );
};
