// EmptyPatientsState.tsx — Index 페이지 환자 0명 일 때 표시 (등록 CTA + 4기능 카드).
import React from "react";
import { Plus, Activity, Dumbbell, LineChart, Printer } from "lucide-react";
import { Card } from "../../components/redesign/ui/Card";
import { Button } from "../../components/redesign/ui/Button";

// 빈 상태에서 보여줄 앱의 4가지 핵심 기능 (옛 EmptyPatientState 에서 가져옴)
const EMPTY_FEATURES = [
  { icon: <Activity className="size-4" />, title: "ROM 측정", desc: "7개 관절의 가동범위를 단계별로 기록" },
  { icon: <Dumbbell className="size-4" />, title: "CES 재활", desc: "억제·신장·활성·통합 4단계 맞춤 루틴" },
  { icon: <LineChart className="size-4" />, title: "추이 분석", desc: "회차별 변화와 VAS 통증 지수를 한 눈에" },
  { icon: <Printer className="size-4" />, title: "리포트 인쇄", desc: "측정 결과를 한 페이지로 깔끔하게 출력" },
];

interface EmptyPatientsStateProps {
  onAddFirstPatient: () => void;
}

export const EmptyPatientsState: React.FC<EmptyPatientsStateProps> = ({
  onAddFirstPatient,
}) => (
  <>
    <Card className="flex flex-col items-center justify-center gap-3 p-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-[var(--color-muted)]">
        <Plus className="size-6 text-[var(--color-muted-foreground)]" />
      </div>
      <div>
        <p className="text-sm font-semibold">등록된 환자가 없어요</p>
        <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
          첫 환자를 등록하면 측정과 CES 처방을 시작할 수 있습니다
        </p>
      </div>
      <Button onClick={onAddFirstPatient} className="mt-1">
        <Plus className="size-4" />첫 환자 등록
      </Button>
    </Card>

    {/* 앱의 4가지 핵심 기능 안내 */}
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {EMPTY_FEATURES.map((f) => (
        <Card key={f.title} className="flex items-start gap-3 p-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
            {f.icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--color-foreground)]">{f.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-muted-foreground)]">
              {f.desc}
            </p>
          </div>
        </Card>
      ))}
    </div>
  </>
);
