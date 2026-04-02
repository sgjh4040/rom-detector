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

export const RomMeasurement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jointId = searchParams.get("joint") ?? "";
  const side = (searchParams.get("side") ?? "좌측") as Side;

  const joint = JOINTS.find((j) => j.id === jointId);
  const [session, setSession] = useState<RomSession | null>(() =>
    loadRomSession(),
  );
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

  return (
    <div className="rom-page">
      {/* Header */}
      <header className="rom-header">
        <div>
          <div className="rom-header__label">
            {side} {joint.name}
          </div>
          <div className="rom-header__sub">
            {currentMovIdx + 1} / {totalMovSteps} 동작 측정 중
          </div>
        </div>
        <div className="rom-header__pct">
          {Math.floor(overallPct)}
          <span style={{ fontSize: "0.75rem" }}>%</span>
        </div>
      </header>

      {/* Progress */}
      <div className="rom-progress">
        <div
          className="rom-progress__fill"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      {/* Main */}
      <main className="rom-main">
        <div className="rom-main__glow" />
        <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
          {activeMov && activeMov.isQualitative ? (
            <QualitativeInput
              value={activeVal}
              onChange={handleChange}
              label={activeMov.name}
            />
          ) : activeMov ? (
            <>
              <AngleDisplayPanel
                activeMov={activeMov}
                activeVal={activeVal}
                handleChange={handleChange}
              />
              <div style={{ marginTop: "2rem" }}>
                <FastInputControls
                  activeMov={activeMov}
                  activeVal={activeVal}
                  handleFast={handleFast}
                  handlePhoto={handlePhoto}
                />
              </div>
            </>
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="rom-footer">
        <div className="rom-footer__inner">
          <button onClick={handlePrevMovement} className="rom-footer__prev">
            이전
          </button>
          <button onClick={handleNextMovement} className="rom-footer__next">
            {currentMovIdx < totalMovSteps - 1 ? (
              <span>다음 측정 이동</span>
            ) : nextStep ? (
              <span>
                <span style={{ opacity: 0.5, marginRight: 4 }}>
                  {nextStep.side}
                </span>
                {JOINTS.find((j) => j.id === nextStep.jointId)?.name} 계속하기
              </span>
            ) : (
              "모든 측정 완료"
            )}
            <span className="rom-footer__arrow">→</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
