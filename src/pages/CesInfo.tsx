// CesInfo.tsx — CES 참고 페이지 (redesign-spike, Athletic Garmin).
import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { ALL_CES_DATA } from "../lib/ces";
import { JOINTS } from "../lib/romData";
import { EmptyState } from "../core/components/EmptyState";
import { JointSidebar } from "./cesInfo/JointSidebar";
import { MovementTabs } from "./cesInfo/MovementTabs";
import { MuscleAnalysisCard } from "./cesInfo/MuscleAnalysisCard";
import { ProtocolColumn } from "./cesInfo/ProtocolColumn";
import { IntegrationSection } from "./cesInfo/IntegrationSection";

export const CesInfo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedJointId, setSelectedJointId] = useState<string>("shoulder");
  const [selectedMovement, setSelectedMovement] = useState<string>("");

  const currentJoint = JOINTS.find((j) => j.id === selectedJointId);
  const cesData = ALL_CES_DATA[selectedJointId];

  const currentMovements = useMemo(
    () => (cesData ? Object.keys(cesData.protocol) : []),
    [cesData],
  );
  const activeMovement = currentMovements.includes(selectedMovement)
    ? selectedMovement
    : currentMovements[0] || "";

  useEffect(() => {
    if (activeMovement && activeMovement !== selectedMovement) {
      setSelectedMovement(activeMovement);
    }
  }, [activeMovement, selectedMovement]);

  if (!cesData)
    return (
      <EmptyState
        size="sm"
        fullScreen
        icon={<AlertCircle size={40} strokeWidth={1.8} />}
        title="CES 데이터를 찾을 수 없어요"
        description={`${selectedJointId} 관절의 참고 자료가 아직 준비되지 않았습니다.`}
        cta={{
          label: "홈으로 돌아가기",
          variant: "pill",
          onClick: () => navigate("/"),
        }}
      />
    );

  return (
    <div
      data-redesign="true"
      className="min-h-svh bg-[var(--color-background)] text-[var(--color-foreground)] font-sans"
    >
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="홈으로"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="text-base font-bold text-[var(--color-foreground)]">
            CES 참고 가이드
          </div>
        </div>
      </header>

      {/* 2-column 레이아웃 */}
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[240px_1fr]">
        <JointSidebar
          selectedJointId={selectedJointId}
          onSelect={setSelectedJointId}
          onStartProtocol={() => navigate("/ces")}
          onClose={() => navigate("/")}
        />

        {/* 메인 */}
        <main className="flex flex-col gap-5 min-w-0">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
              {currentJoint?.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-[var(--color-muted-foreground)]">
              교정 운동 전략 (CES) 참고 가이드
            </p>
          </div>

          <MovementTabs
            movementIds={Object.keys(cesData.protocol)}
            movements={currentJoint?.movements ?? []}
            activeMovement={activeMovement}
            onSelect={setSelectedMovement}
          />

          {activeMovement && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <MuscleAnalysisCard
                  overactive={cesData.muscleMap[activeMovement]?.overactive ?? []}
                  underactive={cesData.muscleMap[activeMovement]?.underactive ?? []}
                />
              </div>
              <ProtocolColumn protocol={cesData.protocol[activeMovement]} />
            </div>
          )}

          <IntegrationSection exercises={cesData.integrate} />
        </main>
      </div>
    </div>
  );
};
