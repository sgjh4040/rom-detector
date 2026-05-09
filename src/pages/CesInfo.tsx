import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
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

  // Derive the actual movement to display (robust for joint switches)
  const currentMovements = useMemo(
    () => (cesData ? Object.keys(cesData.protocol) : []),
    [cesData],
  );
  const activeMovement = currentMovements.includes(selectedMovement)
    ? selectedMovement
    : currentMovements[0] || "";

  // Sync state back for the selector
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
    <div className="ces-dashboard page-bg-ces info-mode">
      <JointSidebar
        selectedJointId={selectedJointId}
        onSelect={setSelectedJointId}
        onStartProtocol={() => navigate("/ces")}
        onClose={() => navigate("/")}
      />

      {/* --- Main Content Area --- */}
      <div className="ces-main scroll-y">
        <header className="info-header mb-8">
          <h1 className="main-title page-title">{currentJoint?.name}</h1>
          <p className="sub-label opacity-70">
            교정 운동 전략 (CES) 참고 가이드
          </p>
        </header>

        <MovementTabs
          movementIds={Object.keys(cesData.protocol)}
          movements={currentJoint?.movements ?? []}
          activeMovement={activeMovement}
          onSelect={setSelectedMovement}
        />

        {activeMovement && (
          <div className="info-grid grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* --- Left Column: Muscle Map --- */}
            <div className="lg:col-span-4 space-y-6">
              <MuscleAnalysisCard
                overactive={cesData.muscleMap[activeMovement]?.overactive ?? []}
                underactive={cesData.muscleMap[activeMovement]?.underactive ?? []}
              />
            </div>

            <ProtocolColumn protocol={cesData.protocol[activeMovement]} />
          </div>
        )}

        <IntegrationSection exercises={cesData.integrate} />
      </div>

    </div>
  );
};
