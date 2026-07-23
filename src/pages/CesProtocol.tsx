// CesProtocol.tsx — CES 재활 프로토콜 메인 페이지 (redesign-spike).
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { loadRomSession, JOINTS } from "../lib/romData";
import { analyzeMuscles } from "../lib/muscleAnalysis";
import { CesExercisePlayer } from "../core/components/CesExercisePlayer";
import { buildRoutineFromAnalysis } from "../lib/ces/cesRoutineBuilder";
import type { CesStage } from "../lib/ces/cesTypes";
import type { Side } from "../lib/romTypes";
import { getTargetMuscleIds, resolveEffectiveStage, STAGES } from "./cesProtocol/helpers";
import { useCesProtocolTimer } from "./cesProtocol/useCesProtocolTimer";
import { StageTabs } from "./cesProtocol/StageTabs";
import { JointSideHeader } from "./cesProtocol/JointSideHeader";
import { MuscleBalanceCard } from "./cesProtocol/MuscleBalanceCard";
import { MobileTimerFooter } from "./cesProtocol/MobileTimerFooter";
import { CesProtocolHeader } from "./cesProtocol/CesProtocolHeader";
import { CesProtocolSidebar } from "./cesProtocol/CesProtocolSidebar";
import { CtaButtons } from "./cesProtocol/CtaButtons";
import { EmptyState } from "../core/components/EmptyState";

export const CesProtocol: React.FC = () => {
  const navigate = useNavigate();
  const session = loadRomSession();
  const [activeJointSide, setActiveJointSide] = useState("");
  const [activeStage, setActiveStage] = useState<CesStage>("inhibit");
  const [activeIndex, setActiveIndex] = useState(0);

  const jointSideList = useMemo(() => {
    if (!session) return [];
    const list: { id: string; label: string; jid: string; side: Side }[] = [];
    session.selectedJointIds.forEach((jid) => {
      const joint = JOINTS.find((j) => j.id === jid);
      if (joint?.isSymmetric) {
        list.push({ id: `${jid}-좌측`, label: joint.name, jid, side: "좌측" });
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

  // 빈 단계 폴백(effectiveStage)을 타이머 훅보다 먼저 계산 — 폴백된 단계로 시간 누적 (null 안전)
  const currentJS =
    jointSideList.find((js) => js.id === activeJointSide) ?? jointSideList[0];
  const analysis =
    session && currentJS ? analyzeMuscles(session, currentJS.jid, currentJS.side) : null;
  const effectiveStage = analysis ? resolveEffectiveStage(analysis, activeStage) : activeStage;

  const { seconds, timerRunning, toggleTimer, resetTimer } = useCesProtocolTimer({
    activeStage: effectiveStage,
    sessionCreatedAt: session?.createdAt,
  });

  if (!session) {
    return (
      <EmptyState
        size="lg"
        fullScreen
        icon={<Dumbbell size={44} strokeWidth={1.8} />}
        title="측정 세션이 없어요"
        description="ROM 측정을 먼저 완료하면 약점·과활성 분석에 맞춰 CES 4단계 재활 프로토콜이 자동 처방됩니다."
        extra={
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            {STAGES.map((s) => (
              <span
                key={s.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: s.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/85" />
                {s.label}
              </span>
            ))}
          </div>
        }
        cta={{
          label: "측정 시작하기",
          variant: "pill",
          onClick: () => navigate("/measure"),
        }}
      />
    );
  }
  if (jointSideList.length === 0 || !analysis)
    return <div className="p-6 text-sm text-[var(--color-muted-foreground)]">Loading…</div>;

  const exercises = analysis[effectiveStage];
  const currentEx = exercises[activeIndex] || exercises[0];

  const targetMuscles = currentEx
    ? getTargetMuscleIds(currentEx, analysis, effectiveStage)
    : [];

  const handleStartPlayer = () => {
    const customRoutine = buildRoutineFromAnalysis(analysis, {
      getTargetMuscles: (exercise, phase) =>
        getTargetMuscleIds(exercise, analysis, phase.toLowerCase() as CesStage),
    });
    navigate("/ces-player", { state: { customRoutine } });
  };

  // 데스크톱 사이드바·모바일 메인 양쪽에서 재사용되는 JSX 묶음
  const stageTabsNode = (
    <StageTabs
      activeStage={effectiveStage}
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
  );

  const ctaButtonsNode = (
    <CtaButtons
      onStartPlayer={handleStartPlayer}
      onComplete={() => navigate(`/trends?patientId=${session.patientId}`)}
    />
  );

  return (
    <div
      data-redesign="true"
      className="min-h-svh bg-[var(--color-background)] text-[var(--color-foreground)] font-sans"
    >
      <CesProtocolHeader
        patientName={session.patientName}
        patientAge={session.patientAge}
        onBack={() => navigate("/")}
      />

      {/* 2-column 레이아웃 — 모바일에선 stack(메인만 노출), 데스크톱(lg)에서 사이드바 */}
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 pb-24 lg:pb-6 lg:grid-cols-[320px_1fr] lg:items-start">
        <CesProtocolSidebar
          targetMuscles={targetMuscles}
          activeStage={effectiveStage}
          seconds={seconds}
          timerRunning={timerRunning}
          toggleTimer={toggleTimer}
          resetTimer={resetTimer}
          stageTabsNode={stageTabsNode}
          ctaButtonsNode={ctaButtonsNode}
        />

        {/* 메인 — 모바일은 영상 위 → 4단계 + CTA → 근육 밸런스 순 */}
        <main className="flex flex-col gap-5">
          <JointSideHeader
            jointSideList={jointSideList}
            activeJointSide={currentJS.id}
            onChange={(id) => {
              setActiveJointSide(id);
              setActiveIndex(0);
            }}
            patientName={session?.patientName}
            patientAge={session?.patientAge}
          />

          <CesExercisePlayer
            exercises={exercises}
            stageId={effectiveStage}
            activeIndex={activeIndex}
            onIndexChange={setActiveIndex}
          />

          {/* 모바일 전용 — 4단계 탭 + CTA 가 영상 바로 밑에 */}
          <div className="lg:hidden flex flex-col gap-3">
            {stageTabsNode}
            {ctaButtonsNode}
          </div>

          <MuscleBalanceCard
            overactiveMuscles={analysis.overactiveMuscles}
            underactiveMuscles={analysis.underactiveMuscles}
          />
        </main>
      </div>

      {/* 모바일 전용 footer — 타이머 시작/초기화 가 스크롤 따라옴 */}
      <MobileTimerFooter
        seconds={seconds}
        timerRunning={timerRunning}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
      />
    </div>
  );
};
