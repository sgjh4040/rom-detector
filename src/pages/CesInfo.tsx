import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ALL_CES_DATA } from "../lib/ces";
import { JOINTS } from "../lib/romData";
import { Activity, Brain, Wrench, Timer, Repeat, Hash, PlayCircle } from "lucide-react";
import { STAGE_LABELS } from "./cesInfo/helpers";
import { JointSidebar } from "./cesInfo/JointSidebar";
import { MovementTabs } from "./cesInfo/MovementTabs";

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
    return <div className="p-8">{selectedJointId} 데이터를 찾을 수 없어요</div>;

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
          <h1 className="main-title text-4xl">{currentJoint?.name}</h1>
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
              <section className="card muscle-map-card p-6 h-full">
                <h3 className="section-title mb-4 flex items-center gap-2">
                  <span className="icon text-primary"><Brain size={24} /></span> 근육 분석
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-red-400 font-bold mb-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      과활성 (짧아짐)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cesData.muscleMap[activeMovement]?.overactive.map(
                        (m) => (
                          <span key={m} className="muscle-tag overactive">
                            {m}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-green-400 font-bold mb-2">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      저활성 (약해짐)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cesData.muscleMap[activeMovement]?.underactive.map(
                        (m) => (
                          <span key={m} className="muscle-tag underactive">
                            {m}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* --- Right Column: Protocols --- */}
            <div className="lg:col-span-8 space-y-6">
              {(["inhibit", "lengthen", "activate"] as const).map((stage) => (
                <section key={stage} className="card protocol-section p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="section-title flex items-center gap-2">
                      <span className="icon">{STAGE_LABELS[stage].icon}</span>
                      {STAGE_LABELS[stage].label}
                    </h3>
                    <span className="text-xs font-mono opacity-50">
                      {STAGE_LABELS[stage].short} 단계
                    </span>
                  </div>

                  <div className="exercise-list space-y-4">
                    {cesData.protocol[activeMovement][stage].map((ex, idx) => (
                      <div
                        key={ex.id}
                        className="exercise-info-item flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="ex-num font-mono text-2xl opacity-20">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1">
                            {ex.name}
                          </h4>
                          <p className="text-sm opacity-70 mb-3">
                            {ex.description}
                          </p>
                          <div className="ex-meta flex flex-wrap gap-3">
                            {ex.tools && (
                              <span className="meta-tag flex items-center gap-1"><Wrench size={12} /> {ex.tools}</span>
                            )}
                            {ex.holdSeconds && (
                              <span className="meta-tag flex items-center gap-1">
                                <Timer size={12} /> {ex.holdSeconds}초
                              </span>
                            )}
                            {ex.sets && (
                              <span className="meta-tag flex items-center gap-1">
                                <Repeat size={12} /> {ex.sets}세트
                              </span>
                            )}
                            {ex.reps && (
                              <span className="meta-tag flex items-center gap-1">
                                <Hash size={12} /> {ex.reps}회
                              </span>
                            )}
                          </div>
                        </div>
                        {ex.youtubeId && (
                          <div className="yt-indicator text-red-500 animate-pulse">
                            <PlayCircle size={24} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {/* --- Integration Section (Full Width) --- */}
        <section className="card integrate-section p-6 mt-8">
          <h3 className="section-title mb-6 flex items-center gap-2">
            <span className="icon text-primary"><Activity size={24} /></span> 통합 운동 (Integration)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cesData.integrate.map((ex) => (
              <div
                key={ex.id}
                className="exercise-info-item p-4 rounded-xl bg-white/5 border border-primary/20"
              >
                <h4 className="text-lg font-bold text-primary-light mb-1">
                  {ex.name}
                </h4>
                <p className="text-sm opacity-70 mb-3">{ex.description}</p>
                <div className="ex-meta flex gap-3">
                  {ex.sets && (
                    <span className="meta-tag flex items-center gap-1"><Repeat size={12} /> {ex.sets}세트</span>
                  )}
                  {ex.reps && (
                    <span className="meta-tag flex items-center gap-1"><Hash size={12} /> {ex.reps}회</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  );
};
