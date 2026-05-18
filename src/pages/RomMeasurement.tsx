// RomMeasurement.tsx — ROM 측정 풀스크린 페이지 (redesign-spike).
// 사이드바·다크 글래스 제거, 화이트 BG + 가민 블루 톤.
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  JOINTS,
  loadRomSession,
  saveRomSession,
  getMeasurementQueue,
  getNextMeasurement,
} from "../lib/romData";
import type { RomSession, Side } from "../lib/romData";

import { AngleDisplayPanel } from "../features/measurement/presentation/AngleDisplayPanel";
import { FastInputControls } from "../features/measurement/presentation/FastInputControls";
import { QualitativeInput } from "../features/measurement/presentation/QualitativeInput";

export const RomMeasurement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jointId = searchParams.get("joint") ?? "";
  const side = (searchParams.get("side") ?? "좌측") as Side;

  const joint = JOINTS.find((j) => j.id === jointId);
  const [session, setSession] = useState<RomSession | null>(() => loadRomSession());
  const [measurements, setMeasurements] = useState<Record<string, number>>({});
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!session || !joint) navigate("/");
  }, [session, joint, navigate]);

  useEffect(() => {
    if (!joint) return;
    const initial: Record<string, number> = {};
    joint.movements.forEach((m) => {
      initial[m.id] = 0;
    });
    const saved = session?.measurements?.[jointId]?.[side];
    setMeasurements(saved ? { ...initial, ...saved } : initial);
    setActiveId(joint.movements[0].id);
  }, [jointId, side, joint, session]);

  const handleChange = useCallback(
    (val: string | number) => {
      const numVal = typeof val === "string" ? parseInt(val, 10) : val;
      setMeasurements((p) => ({
        ...p,
        [activeId]: isNaN(numVal) ? 0 : numVal,
      }));
    },
    [activeId],
  );

  const handlePhoto = useCallback(
    (angle: number) => {
      const numVal = typeof angle === "number" ? angle : 0;
      setMeasurements((p) => ({ ...p, [activeId]: numVal }));
    },
    [activeId],
  );

  if (!joint || !session || !activeId) return null;

  const queue = getMeasurementQueue(session);
  const currentJointIdx = queue.findIndex(
    (q) => q.jointId === jointId && q.side === side,
  );
  const totalJointSteps = queue.length;
  const nextStep = getNextMeasurement(session, jointId, side);

  const activeMov = joint.movements.find((m) => m.id === activeId);
  const activeVal = measurements[activeId] ?? 0;

  const currentMovIdx = joint.movements.findIndex((m) => m.id === activeId);
  const totalMovSteps = joint.movements.length;

  const handleFast = (pct: number) => {
    if (!activeMov) return;
    handleChange(Math.round((activeMov.normalRange * pct) / 100));
  };

  const handleNextMovement = () => {
    if (currentMovIdx < totalMovSteps - 1) {
      setActiveId(joint.movements[currentMovIdx + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const updated: RomSession = {
        ...session,
        measurements: {
          ...session.measurements,
          [jointId]: {
            ...session.measurements?.[jointId],
            [side]: measurements,
          },
        },
      };
      saveRomSession(updated);
      setSession(updated);
      nextStep
        ? navigate(`/measure?joint=${nextStep.jointId}&side=${nextStep.side}`)
        : navigate("/results");
    }
  };

  const handlePrevMovement = () => {
    if (currentMovIdx > 0) {
      setActiveId(joint.movements[currentMovIdx - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(-1);
    }
  };

  const overallPct =
    ((currentJointIdx + currentMovIdx / totalMovSteps) / totalJointSteps) * 100;
  const isLast = currentMovIdx >= totalMovSteps - 1;
  const nextLabel = isLast
    ? nextStep
      ? `${nextStep.side} ${JOINTS.find((j) => j.id === nextStep.jointId)?.name} 계속`
      : "측정 완료"
    : "다음 동작";

  return (
    <div
      data-redesign="true"
      className="min-h-svh flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] font-sans"
    >
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={handlePrevMovement}
            aria-label="이전"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-bold text-[var(--color-foreground)]">
              {joint.name} <span className="text-[var(--color-muted-foreground)]">· {side}</span>
            </div>
            <div className="text-xs text-[var(--color-muted-foreground)]">
              동작 {currentMovIdx + 1} / {totalMovSteps}
            </div>
          </div>
          <div className="flex shrink-0 items-baseline gap-0.5 font-mono tabular-nums">
            <span className="text-xl font-bold text-[var(--color-foreground)]">
              {Math.floor(overallPct)}
            </span>
            <span className="text-xs text-[var(--color-muted-foreground)]">%</span>
          </div>
        </div>
        {/* 진행도 바 */}
        <div className="h-1 w-full bg-[var(--color-muted)]">
          <div
            className="h-full bg-[var(--color-accent)] transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
      </header>

      {/* 메인 */}
      <main className="flex-1 px-4 pb-24 pt-6">
        <div className="mx-auto w-full max-w-2xl">
          {activeMov && activeMov.isQualitative ? (
            <QualitativeInput
              value={activeVal}
              onChange={handleChange}
              label={activeMov.name}
            />
          ) : activeMov ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-6">
              <AngleDisplayPanel
                activeMov={activeMov}
                activeVal={activeVal}
                handleChange={handleChange}
              />
              <div className="mt-5">
                <FastInputControls
                  activeMov={activeMov}
                  activeVal={activeVal}
                  handleFast={handleFast}
                  handlePhoto={handlePhoto}
                />
              </div>
            </div>
          ) : null}
        </div>
      </main>

      {/* 하단 다음 버튼 (sticky) */}
      <footer className="fixed bottom-0 inset-x-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-2xl gap-2 px-4 py-3">
          <button
            type="button"
            onClick={handlePrevMovement}
            className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
          >
            <ArrowLeft className="size-4" />
            이전
          </button>
          <button
            type="button"
            onClick={handleNextMovement}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 text-sm font-bold text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent)]/90 transition-colors"
          >
            {isLast && !nextStep && <Check className="size-4" />}
            {nextLabel}
            {!isLast || nextStep ? <ArrowRight className="size-4" /> : null}
          </button>
        </div>
      </footer>
    </div>
  );
};
