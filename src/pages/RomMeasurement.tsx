// RomMeasurement.tsx — ROM 측정 풀스크린 페이지 (redesign-spike).
// 사이드바·다크 글래스 제거, 화이트 BG + 가민 블루 톤.
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { MeasurementHeader } from "./romMeasurement/MeasurementHeader";
import { MeasurementFooter } from "./romMeasurement/MeasurementFooter";

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

  // URL(jointId/side) 변경 시 measurements/activeId 초기화.
  // React 19 권장 패턴: prev key 비교 + render 단계 setState (useEffect 안에서 setState 회피).
  const [prevKey, setPrevKey] = useState<string>("");
  const currentKey = `${jointId}-${side}`;
  if (joint && prevKey !== currentKey) {
    setPrevKey(currentKey);
    const initial: Record<string, number> = {};
    joint.movements.forEach((m) => {
      initial[m.id] = 0;
    });
    const saved = session?.measurements?.[jointId]?.[side];
    setMeasurements(saved ? { ...initial, ...saved } : initial);
    setActiveId(joint.movements[0].id);
  }

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
      if (nextStep) {
        navigate(`/measure?joint=${nextStep.jointId}&side=${nextStep.side}`);
      } else {
        navigate("/results");
      }
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
      <MeasurementHeader
        jointName={joint.name}
        side={side}
        currentMovIdx={currentMovIdx}
        totalMovSteps={totalMovSteps}
        overallPct={overallPct}
        onPrev={handlePrevMovement}
      />

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

      <MeasurementFooter
        nextLabel={nextLabel}
        isLast={isLast}
        hasNextStep={!!nextStep}
        onPrev={handlePrevMovement}
        onNext={handleNextMovement}
      />
    </div>
  );
};
