// ProtocolColumn.tsx — CesInfo info-grid 우측 컬럼.
// 같은 동작에 대한 inhibit/lengthen/activate 3 stage 운동 리스트를 세로로 쌓음.
// (integrate 는 풀폭 별도 섹션이라 IntegrationSection 에서 처리)
import React from "react";
import { Wrench, Timer, Repeat, Hash, PlayCircle } from "lucide-react";
import type { CesExercise, MovementProtocol } from "../../lib/ces/cesTypes";
import { STAGE_LABELS } from "./helpers";

const PROTOCOL_STAGES = ["inhibit", "lengthen", "activate"] as const;

interface ProtocolColumnProps {
  /** 현재 활성 동작의 protocol — { inhibit, lengthen, activate, integrate }[CesExercise[]] */
  protocol: MovementProtocol;
}

const ExerciseStageItem: React.FC<{ ex: CesExercise; idx: number }> = ({ ex, idx }) => (
  <div className="exercise-info-item flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
    <div className="ex-num font-mono text-2xl opacity-20">{idx + 1}</div>
    <div className="flex-1">
      <h4 className="text-lg font-bold text-white mb-1">{ex.name}</h4>
      <p className="text-sm opacity-70 mb-3">{ex.description}</p>
      <div className="ex-meta flex flex-wrap gap-3">
        {ex.tools && (
          <span className="meta-tag flex items-center gap-1">
            <Wrench size={12} /> {ex.tools}
          </span>
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
);

export const ProtocolColumn: React.FC<ProtocolColumnProps> = ({ protocol }) => {
  return (
    <div className="lg:col-span-8 space-y-6">
      {PROTOCOL_STAGES.map((stage) => (
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
            {protocol[stage].map((ex, idx) => (
              <ExerciseStageItem key={ex.id} ex={ex} idx={idx} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
