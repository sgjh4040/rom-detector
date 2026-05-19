// Trends.tsx — 측정 기록 페이지 (redesign-spike, Athletic Garmin 톤).
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getPatientHistory, saveRomSession } from "../lib/romData";
import { NeumoDashboard } from "../features/trends/presentation/NeumoDashboard";
import { HistoryItem } from "../features/trends/presentation/HistoryItem";
import { AppShell } from "../components/redesign/AppShell";
import { Button } from "../components/redesign/ui/Button";
import { Card } from "../components/redesign/ui/Card";
import { ViewSegment, type TrendsViewMode } from "./trends/ViewSegment";
import { ChartsView } from "./trends/ChartsView";

export const Trends: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const [viewMode, setViewMode] = useState<TrendsViewMode>("charts");
  const showCharts = viewMode === "charts";

  const history = useMemo(
    () => (patientId ? getPatientHistory(patientId) : []),
    [patientId],
  );
  const reversedHistory = useMemo(() => [...history].reverse(), [history]);

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    history.length > 0 ? history[0].createdAt : null,
  );

  // 트렌드 페이지에서 고른 회차를 active rom_session 으로 동기화
  useEffect(() => {
    if (!selectedSessionId) return;
    const picked = history.find((s) => s.createdAt === selectedSessionId);
    if (picked) saveRomSession(picked);
  }, [selectedSessionId, history]);

  if (!patientId || history.length === 0) {
    return (
      <AppShell>
        <Card className="p-10 text-center">
          <h2 className="text-base font-bold text-[var(--color-foreground)]">
            환자 데이터를 찾을 수 없습니다
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            먼저 측정을 완료하면 경과 관찰이 표시됩니다
          </p>
          <Button
            onClick={() => navigate("/")}
            className="mt-4 mx-auto"
          >
            홈으로
          </Button>
        </Card>
      </AppShell>
    );
  }

  const patient = history[0];

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        {/* 헤더 */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="-ml-2 mb-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
          >
            <ArrowLeft className="size-4" />
            뒤로가기
          </Button>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
                경과 관찰
              </h1>
              <p className="mt-1 text-sm font-medium text-[var(--color-muted-foreground)]">
                {patient.patientName}
                {patient.patientAge ? ` · ${patient.patientAge}세` : ""}
                <span className="ml-1.5 text-[var(--color-border)]">·</span>
                <span className="ml-1.5">{history.length}회 측정</span>
              </p>
            </div>
            <ViewSegment value={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {/* 본문 — 차트 또는 대시보드 */}
        {showCharts ? (
          <ChartsView reversedHistory={reversedHistory} />
        ) : (
          <Card className="p-4">
            <NeumoDashboard
              sessions={history}
              selectedSessionId={selectedSessionId}
              onSelectSession={(id) => setSelectedSessionId(id || null)}
            />
          </Card>
        )}

        {/* 평가 히스토리 */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-[var(--color-foreground)]">
            평가 히스토리{" "}
            <span className="font-medium text-[var(--color-muted-foreground)]">
              ({history.length}건)
            </span>
          </h3>
          <div className="flex flex-col gap-2">
            {history.map((s, i) => (
              <HistoryItem
                key={s.createdAt}
                session={s}
                index={i}
                total={history.length}
              />
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};
