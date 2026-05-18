// CesProtocol.tsx — CES 재활 프로토콜 메인 페이지 (redesign-spike).
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, CheckCircle2, Dumbbell, Play } from "lucide-react";
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
import { MobileTimerFooter } from "./cesProtocol/MobileTimerFooter";
import { EmptyState } from "../core/components/EmptyState";

export const CesProtocol: React.FC = () => {
  const navigate = useNavigate();
  const session = loadRomSession();
  const [activeJointSide, setActiveJointSide] = useState("");
  const [activeStage, setActiveStage] = useState<CesStage>("inhibit");
  const [activeIndex, setActiveIndex] = useState(0);

  const { seconds, timerRunning, toggleTimer, resetTimer } = useCesProtocolTimer({
    activeStage,
    sessionCreatedAt: session?.createdAt,
  });

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

  useEffect(() => {
    if (jointSideList.length > 0 && !activeJointSide)
      setActiveJointSide(jointSideList[0].id);
  }, [jointSideList, activeJointSide]);

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
    return <div className="p-6 text-sm text-[var(--color-muted-foreground)]">Loading…</div>;

  const currentJS =
    jointSideList.find((js) => js.id === activeJointSide) ?? jointSideList[0];
  const analysis = analyzeMuscles(session, currentJS.jid, currentJS.side);
  const exercises = analysis[activeStage];
  const currentEx = exercises[activeIndex] || exercises[0];

  const targetMuscles = currentEx
    ? getTargetMuscleIds(currentEx, analysis, activeStage)
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
  );

  const ctaButtonsNode = (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleStartPlayer}
        className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent)] text-sm font-bold text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent)]/90 transition-colors"
      >
        <Play className="size-4" />
        가이드 운동 시작
        <ChevronRight className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => navigate(`/trends?patientId=${session.patientId}`)}
        className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-sm font-bold text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
      >
        <CheckCircle2 className="size-4" />
        운동 완료
        <ChevronRight className="size-4" />
      </button>
    </div>
  );

  return (
    <div
      data-redesign="true"
      className="min-h-svh bg-[var(--color-background)] text-[var(--color-foreground)] font-sans"
    >
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="홈으로"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-base font-bold text-[var(--color-foreground)]">
              CES 재활 프로토콜
            </div>
            <div className="text-xs text-[var(--color-muted-foreground)]">
              {session.patientName ?? "환자"}
              {session.patientAge ? ` · ${session.patientAge}세` : ""}
            </div>
          </div>
        </div>
      </header>

      {/* 2-column 레이아웃 — 모바일에선 stack(메인만 노출), 데스크톱(lg)에서 사이드바 */}
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 pb-24 lg:pb-6 lg:grid-cols-[320px_1fr] lg:items-start">
        {/* 데스크톱 전용 사이드바 */}
        <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-[72px] lg:self-start lg:max-h-[calc(100vh-88px)] lg:overflow-y-auto lg:pr-1">
          {/* 인체 도해 */}
          <div className="flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-3 h-[300px]">
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
          />

          {stageTabsNode}
          {ctaButtonsNode}
        </aside>

        {/* 메인 — 모바일은 영상 위 → 4단계 + CTA → 근육 밸런스 순 */}
        <main className="flex flex-col gap-5">
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
