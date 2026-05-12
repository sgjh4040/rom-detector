// CesProtocol.tsx — CES 재활 프로토콜 메인 페이지 (PRD 4-0: 200줄 이하)
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadRomSession, JOINTS } from "../lib/romData";
import { analyzeMuscles } from "../lib/muscleAnalysis";
import { CesExercisePlayer } from "../core/components/CesExercisePlayer";
import { BodyAnatomySvg } from "../core/components/BodyAnatomySvg";
import { buildRoutineFromAnalysis } from "../lib/ces/cesRoutineBuilder";
import type { CesStage } from "../lib/ces/cesTypes";
import { type CesPhase } from "../lib/ces/CesPlayerTypes";
import type { Side } from "../lib/romTypes";
import { getTargetMuscleIds } from "./cesProtocol/helpers";
import { useCesProtocolTimer } from "./cesProtocol/useCesProtocolTimer";
import { TimerCard } from "./cesProtocol/TimerCard";
import { StageTabs } from "./cesProtocol/StageTabs";
import { JointSideHeader } from "./cesProtocol/JointSideHeader";
import { MuscleBalanceCard } from "./cesProtocol/MuscleBalanceCard";
import { EmptyState } from "../core/components/EmptyState";
import { Dumbbell } from "lucide-react";

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

  // [PRD 4-2] Early return — 측정 세션이 없을 때.
  // 이전 구현은 렌더 중 navigate("/") 후 return null 이라 한 프레임 빈 화면이
  // 보이고 React 안티패턴 경고도 났음 (F1, 2026-05-09).
  // Results.tsx 와 동일하게 EmptyState 안내 후 사용자가 홈으로 이동 (audit #21).
  if (!session) {
    return (
      <EmptyState
        size="md"
        fullScreen
        icon={<Dumbbell size={48} strokeWidth={1.8} />}
        title="측정 세션이 없어요"
        description="ROM 측정을 먼저 완료하면 CES 재활 프로토콜이 표시됩니다."
        cta={{
          label: "홈으로 돌아가기",
          variant: "pill",
          onClick: () => navigate("/"),
        }}
      />
    );
  }
  if (jointSideList.length === 0)
    return <div className="container">Loading...</div>;

  const currentJS =
    jointSideList.find((js) => js.id === activeJointSide) ?? jointSideList[0];
  const analysis = analyzeMuscles(session, currentJS.jid, currentJS.side);
  const exercises = analysis[activeStage];
  const currentEx = exercises[activeIndex] || exercises[0];

  // v2: 운동 이름 매칭이 아닌 분석 결과 직접 변환 (muscleMapping.ts SSOT)
  const targetMuscles = useMemo(() => getTargetMuscleIds(analysis), [analysis]);

  // ── 데이터 연동: 빌더에 위임 ──
  //
  // `buildRoutineFromAnalysis` 가 세트 분할 + set-rest/transition 브레이크
  // 삽입을 담당한다. CesProtocol 은 분석 결과와 근육 타겟 매퍼만 넘기면 된다.
  // 스텝의 durationSeconds 합은 cesGoalCalculator.exerciseSeconds 와 일치해서
  // 대시보드 phase 목표와 1:1 로 매칭된다.
  const handleStartPlayer = () => {
    // routine builder 는 step 별 `targetSvgIds` 를 박는다.
    // v2: exerciseName 무시하고 analysis 전체 근육 ID 반환 (관절-방향 단위 동일 색칠).
    const svgIds = getTargetMuscleIds(analysis);
    const customRoutine = buildRoutineFromAnalysis(analysis, {
      getTargetMuscles: () => svgIds,
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

        <StageTabs
          activeStage={activeStage}
          stageCounts={{
            inhibit: analysis.inhibit?.length ?? 0,
            lengthen: analysis.lengthen?.length ?? 0,
            activate: analysis.activate?.length ?? 0,
            integrate: analysis.integrate?.length ?? 0,
          }}
          onSelect={(stage) => {
            setActiveStage(stage);
            setActiveIndex(0);
          }}
        />

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
        <JointSideHeader
          jointSideList={jointSideList}
          activeJointSide={activeJointSide}
          onChange={(id) => {
            setActiveJointSide(id);
            setActiveIndex(0);
          }}
          patientName={session?.patientName}
          patientAge={session?.patientAge}
        />

        <CesExercisePlayer
          exercises={exercises}
          stageId={activeStage}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
        />

        <MuscleBalanceCard
          overactiveMuscles={analysis.overactiveMuscles}
          underactiveMuscles={analysis.underactiveMuscles}
        />
      </div>
    </div>
  );
};
