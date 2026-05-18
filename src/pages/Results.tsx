// Results.tsx — 측정 결과 평가 리포트 (redesign-spike, Athletic + Garmin tone)
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, CheckCircle, Dumbbell, FileSearch, Printer, TrendingUp } from "lucide-react";
import {
  loadRomSession,
  addSessionToHistory,
  getPatientHistory,
  getPatients,
  savePatient,
} from "../lib/romData";
import { EmptyState } from "../core/components/EmptyState";
import { computeResultsSummary } from "./results/resultsSummary";
import { AppShell } from "../components/redesign/AppShell";
import { Card } from "../components/redesign/ui/Card";
import { Button } from "../components/redesign/ui/Button";
import { JointResultCard } from "../components/redesign/results/JointResultCard";

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const session = useMemo(() => loadRomSession(), []);

  // 환자 정보 upsert + 히스토리 추가 (기존 로직 그대로)
  useEffect(() => {
    if (!session?.patientId) return;
    const existing = getPatients().find((p) => p.id === session.patientId);
    savePatient({
      id: session.patientId,
      name: session.patientName,
      age: session.patientAge,
      painArea: session.painArea || existing?.painArea || "",
      vasScore: session.vasScore,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      lastMeasuredAt: existing?.lastMeasuredAt,
    });
    addSessionToHistory(session.patientId, session);
  }, [session]);

  if (!session) {
    return (
      <EmptyState
        size="md"
        fullScreen
        icon={<FileSearch size={48} strokeWidth={1.8} />}
        title="측정 세션이 없어요"
        description="새 측정을 시작하면 결과 리포트가 여기에 표시됩니다."
        cta={{
          label: "홈으로 돌아가기",
          variant: "pill",
          onClick: () => navigate("/"),
        }}
      />
    );
  }

  const { selectedJointIds, patientName, patientAge, patientId } = session;

  const history = patientId ? getPatientHistory(patientId) : [];
  const isFirstTime = history.length <= 1;

  const { sortedJointSideStats, totalLimited, totalNormal, summarySentence } =
    computeResultsSummary(session);

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
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
                평가 리포트
              </h1>
              <p className="mt-1 text-sm font-medium text-[var(--color-muted-foreground)]">
                {patientName}
                {patientAge ? ` · ${patientAge}세` : ""}
                {session.painArea ? ` · ${session.painArea}` : ""}
                {session.vasScore !== undefined ? ` · VAS ${session.vasScore}` : ""}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="shrink-0"
            >
              <Printer className="size-4" />
              인쇄
            </Button>
          </div>
        </div>

        {/* 3-Stat 그리드 */}
        <Card className="grid grid-cols-3 divide-x divide-[var(--color-border)]">
          <Stat label="측정 관절" value={selectedJointIds.length} sub="개" />
          <Stat
            label="제한 동작"
            value={totalLimited}
            sub="개"
            valueColor={
              totalLimited > 0 ? "var(--color-destructive)" : undefined
            }
          />
          <Stat
            label="정상 동작"
            value={totalNormal}
            sub="개"
            valueColor={totalNormal > 0 ? "oklch(0.55 0.15 150)" : undefined}
          />
        </Card>

        {/* 요약 배너 — 아이콘 + 굵은 헤더 + 본문 */}
        <SummaryBanner totalLimited={totalLimited} summarySentence={summarySentence} />

        {/* 경과 관찰 링크 카드 */}
        {!isFirstTime && (
          <button
            type="button"
            onClick={() => navigate(`/trends?patientId=${patientId}`)}
            className="group flex w-full items-center justify-between rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-4 text-left transition-colors hover:bg-[var(--color-accent)]/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-md bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--color-foreground)]">
                  경과 관찰
                </div>
                <div className="text-xs text-[var(--color-muted-foreground)]">
                  첫 측정 대비 변화량 · 총 {history.length}회
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-[var(--color-accent)]">
              보기 →
            </span>
          </button>
        )}

        {/* 관절별 결과 카드들 */}
        <div className="flex flex-col gap-3">
          {sortedJointSideStats.map((stat, idx) => {
            const isWorst = idx === 0 && stat.limitedCount > 0;
            const emphasis = isWorst
              ? stat.hasSevere
                ? "danger"
                : "warning"
              : null;
            return (
              <JointResultCard
                key={`${stat.jointId}-${stat.side}`}
                session={session}
                jointId={stat.jointId}
                side={stat.side}
                emphasis={emphasis as "danger" | "warning" | null}
              />
            );
          })}
        </div>

        {/* CTA — CES 재활 시작 (가민 블루 강조) */}
        <Button
          onClick={() => navigate("/ces")}
          size="lg"
          className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-accent-foreground)]"
        >
          <Dumbbell className="size-4" />
          CES 재활 시작
        </Button>
      </div>
    </AppShell>
  );
};

// ─────────────────────────────────────────
const Stat: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  valueColor?: string;
}> = ({ label, value, sub, valueColor }) => (
  <div className="flex flex-col gap-1.5 p-4">
    <div className="text-xs font-semibold text-[var(--color-muted-foreground)]">
      {label}
    </div>
    <div className="flex items-baseline gap-1">
      <span
        className="font-mono text-4xl font-bold tabular-nums leading-none"
        style={{ color: valueColor ?? "var(--color-foreground)" }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-sm font-mono font-semibold text-[var(--color-muted-foreground)]">
          {sub}
        </span>
      )}
    </div>
  </div>
);

const SummaryBanner: React.FC<{
  totalLimited: number;
  summarySentence: string;
}> = ({ totalLimited, summarySentence }) => {
  const isLimited = totalLimited > 0;
  const accent = isLimited ? "var(--color-destructive)" : "oklch(0.55 0.15 150)";

  return (
    <div
      className="rounded-xl border-l-4 p-4"
      style={{
        background: `color-mix(in oklch, ${accent} 8%, var(--color-card))`,
        borderLeftColor: accent,
        borderTop: `1px solid color-mix(in oklch, ${accent} 20%, transparent)`,
        borderRight: `1px solid color-mix(in oklch, ${accent} 20%, transparent)`,
        borderBottom: `1px solid color-mix(in oklch, ${accent} 20%, transparent)`,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `color-mix(in oklch, ${accent} 18%, transparent)`, color: accent }}
        >
          {isLimited ? <AlertTriangle className="size-5" /> : <CheckCircle className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="text-sm font-bold leading-tight"
            style={{ color: accent }}
          >
            {isLimited
              ? `제한 동작 ${totalLimited}개 발견`
              : "전 동작 정상 범위 도달"}
          </div>
          <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--color-foreground)]">
            {summarySentence}
          </p>
        </div>
      </div>
    </div>
  );
};
