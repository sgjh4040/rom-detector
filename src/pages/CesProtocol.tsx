// CesProtocol.tsx — CES 재활 프로토콜 메인 페이지 (PRD 4-0: 200줄 이하)
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadRomSession, JOINTS } from "../lib/romData";
import { analyzeMuscles } from "../lib/muscleAnalysis";
import { CesExercisePlayer } from "../core/components/CesExercisePlayer";
import { BodyAnatomySvg } from "../core/components/BodyAnatomySvg";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { buildRoutineFromAnalysis } from "../lib/ces/cesRoutineBuilder";
import type { CesStage } from "../lib/ces/cesTypes";
import { type CesPhase } from "../lib/ces/CesPlayerTypes";
import type { Side } from "../lib/romTypes";
import { STAGES, getTargetMuscles } from "./cesProtocol/helpers";
import { useCesProtocolTimer } from "./cesProtocol/useCesProtocolTimer";
import { TimerCard } from "./cesProtocol/TimerCard";

export const CesProtocol: React.FC = () => {
  const navigate = useNavigate();
  const session = loadRomSession();
  const [activeJointSide, setActiveJointSide] = useState("");
  const [activeStage, setActiveStage] = useState<CesStage>("inhibit");
  const [activeIndex, setActiveIndex] = useState(0);

  // ── 타이머 (▶ 시작 버튼을 눌러야 작동) ──────────────────────────
  const { seconds, timerRunning, toggleTimer, resetTimer } = useCesProtocolTimer({
    activeStage,
    sessionCreatedAt: session?.createdAt,
  });

  // ── 관절-방향 목록 ────────────────────────────────────────────────
  const jointSideList = useMemo(() => {
    if (!session) return [];
    const list: { id: string; label: string; jid: string; side: Side }[] = [];

    session.selectedJointIds.forEach((jid) => {
      const joint = JOINTS.find((j) => j.id === jid);
      if (joint?.isSymmetric) {
        list.push({
          id: `${jid}-좌측`,
          label: joint.name,
          jid,
          side: "좌측",
        });
      } else {
        session.selectedSides.forEach((side) => {
          list.push({
            id: `${jid}-${side}`,
            label: `${joint?.name} — ${side}`,
            jid,
            side,
          });
        });
      }
    });
    return list;
  }, [session]);

  useEffect(() => {
    if (jointSideList.length > 0 && !activeJointSide)
      setActiveJointSide(jointSideList[0].id);
  }, [jointSideList, activeJointSide]);

  // [PRD 4-2] Early return
  if (!session) {
    navigate("/");
    return null;
  }
  if (jointSideList.length === 0)
    return <div className="container">Loading...</div>;

  const currentJS =
    jointSideList.find((js) => js.id === activeJointSide) ?? jointSideList[0];
  const analysis = analyzeMuscles(session, currentJS.jid, currentJS.side);
  const exercises = analysis[activeStage];
  const currentEx = exercises[activeIndex] || exercises[0];

  const targetMuscles = useMemo(() => {
    if (!currentEx) return ["코어"];
    return getTargetMuscles(currentEx.name);
  }, [currentEx]);

  // ── 데이터 연동: 빌더에 위임 ──
  //
  // `buildRoutineFromAnalysis` 가 세트 분할 + set-rest/transition 브레이크
  // 삽입을 담당한다. CesProtocol 은 분석 결과와 근육 타겟 매퍼만 넘기면 된다.
  // 스텝의 durationSeconds 합은 cesGoalCalculator.exerciseSeconds 와 일치해서
  // 대시보드 phase 목표와 1:1 로 매칭된다.
  const handleStartPlayer = () => {
    const customRoutine = buildRoutineFromAnalysis(analysis, {
      getTargetMuscles,
    });
    navigate("/ces-player", { state: { customRoutine } });
  };

  return (
    <div className="ces-dashboard page-bg-ces">
      {/* ─── 사이드바 ──────────────────────────────────────── */}
      <div className="ces-sidebar">
        {/* 해부 SVG: 사이드바 상단 — 모바일에서는 CSS 로 display:none 처리.
             인라인 display 를 쓰면 CSS 미디어 쿼리를 이기므로 제거함. */}
        <div className="human-anatomy-box">

          <BodyAnatomySvg
            highlightIds={targetMuscles}
            cesPhase={
              (activeStage.charAt(0).toUpperCase() +
                activeStage.slice(1)) as CesPhase
            }
          />
        </div>

        <TimerCard
          seconds={seconds}
          timerRunning={timerRunning}
          toggleTimer={toggleTimer}
          resetTimer={resetTimer}
          currentEx={currentEx}
        />

        {/* 단계 세그먼트 컨트롤 */}
        <div
          role="tablist"
          style={{
            display: "flex",
            gap: "4px",
            padding: "4px",
            background: "rgba(255, 255, 255, 0.06)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            marginBottom: "1.25rem",
          }}
        >
          {STAGES.map((s) => {
            const isActive = activeStage === s.id;
            const count = analysis[s.id]?.length ?? 0;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveStage(s.id);
                  setActiveIndex(0);
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  padding: "0.55rem 0.25rem",
                  borderRadius: "var(--radius-xs)",
                  border: "none",
                  cursor: "pointer",
                  background: isActive
                    ? `${s.color}30`
                    : "transparent",
                  boxShadow: isActive
                    ? `0 2px 8px ${s.color}25`
                    : "none",
                  transition: "all 0.2s ease",
                  fontFamily: "inherit",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 800,
                    color: isActive ? s.color : "rgba(255,255,255,0.4)",
                    letterSpacing: "0.02em",
                    transition: "color 0.2s",
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    fontSize: "var(--text-2xs)",
                    fontWeight: 700,
                    color: isActive
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.25)",
                    transition: "color 0.2s",
                  }}
                >
                  {count}개
                </span>
              </button>
            );
          })}
        </div>

        {/* 하단 액션 */}
        <div className="sidebar-actions">
          <button
            className="btn-complete is-primary"
            onClick={handleStartPlayer}
          >
            가이드 운동 시작 <span>›</span>
          </button>
          <button
            className="btn-complete is-success"
            onClick={() => navigate(`/trends?patientId=${session.patientId}`)}
          >
            운동 완료 <span>›</span>
          </button>
        </div>
      </div>

      {/* ─── 메인 패널 ─────────────────────────────────────── */}
      <div className="ces-main">
        {/* 상단 헤더 — 관절/방향 + 환자 요약 (압축) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
            gap: "12px",
          }}
        >
          <select
            className="form-select"
            style={{
              width: "auto",
              boxShadow: "none",
              fontWeight: 800,
              fontSize: "var(--text-lg)",
              padding: "0.5rem 2rem 0.5rem 0.75rem",
              borderRadius: "var(--radius-xs)",
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.7)",
            }}
            value={activeJointSide}
            onChange={(e) => {
              setActiveJointSide(e.target.value);
              setActiveIndex(0);
            }}
          >
            {jointSideList.map((js) => (
              <option key={js.id} value={js.id}>
                {js.label}
              </option>
            ))}
          </select>
          <span
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--text-secondary)",
              opacity: 0.7,
              whiteSpace: "nowrap",
            }}
          >
            {session?.patientName ?? "환자"}
            {session?.patientAge ? ` · ${session.patientAge}세` : ""}
          </span>
        </div>

        <CesExercisePlayer
          exercises={exercises}
          stageId={activeStage}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
        />

        {/* 근육 밸런스 */}
        <div className="muscle-balance-box">
          <h3
            className="main-title"
            style={{ fontSize: "var(--text-lg)", marginBottom: "1.5rem" }}
          >
            Muscle Balance Status
          </h3>
          <div className="balance-grid">
            <div className="balance-card">
              <p
                className="balance-title flex items-center gap-1"
                style={{ color: "var(--danger)" }}
              >
                <AlertTriangle size={18} /> Overactive (뭉친 근육)
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.overactiveMuscles.map((m) => (
                  <span
                    key={m}
                    style={{
                      fontSize: "var(--text-sm)",
                      padding: "0.3rem 0.6rem",
                      background: "rgba(240,62,62,0.1)",
                      color: "var(--danger)",
                      borderRadius: "var(--radius-xs)",
                      fontWeight: 700,
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="balance-card">
              <p
                className="balance-title flex items-center gap-1"
                style={{ color: "var(--success)" }}
              >
                <CheckCircle size={18} /> Underactive (약한 근육)
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.underactiveMuscles.map((m) => (
                  <span
                    key={m}
                    style={{
                      fontSize: "var(--text-sm)",
                      padding: "0.3rem 0.6rem",
                      background: "rgba(46,204,136,0.1)",
                      color: "var(--success)",
                      borderRadius: "var(--radius-xs)",
                      fontWeight: 700,
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
