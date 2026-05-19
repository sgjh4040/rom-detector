// IndexHeader.tsx — Index 페이지 상단 타이틀 + 환자수 + 관리/새 환자 버튼.
import React from "react";
import { Plus, Settings as SettingsIcon } from "lucide-react";
import { Button } from "../../components/redesign/ui/Button";

interface IndexHeaderProps {
  patientCount: number;
  isManaging: boolean;
  onToggleManaging: () => void;
  onNewPatient: () => void;
}

export const IndexHeader: React.FC<IndexHeaderProps> = ({
  patientCount,
  isManaging,
  onToggleManaging,
  onNewPatient,
}) => (
  <div className="flex items-end justify-between">
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
        환자
      </h1>
      <p className="mt-1 text-sm font-medium text-[var(--color-muted-foreground)]">
        {patientCount === 0
          ? "첫 환자를 등록해 시작하세요"
          : `등록된 환자 ${patientCount}명`}
      </p>
    </div>
    <div className="flex items-center gap-1.5">
      {patientCount > 0 && (
        <Button
          variant={isManaging ? "default" : "outline"}
          size="sm"
          onClick={onToggleManaging}
        >
          <SettingsIcon className="size-4" />
          {isManaging ? "완료" : "관리"}
        </Button>
      )}
      <Button variant="default" size="sm" onClick={onNewPatient}>
        <Plus className="size-4" />새 환자
      </Button>
    </div>
  </div>
);
