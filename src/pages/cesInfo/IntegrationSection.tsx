// IntegrationSection.tsx — CesInfo 풀폭 통합 운동(Integration) 섹션.
// stage 컬럼과 달리 동작 선택과 무관하게 cesData.integrate 전체를 2-column 그리드로 노출.
import React from "react";
import { Activity, Repeat, Hash } from "lucide-react";
import type { CesExercise } from "../../lib/ces/cesTypes";

interface IntegrationSectionProps {
  exercises: CesExercise[];
}

export const IntegrationSection: React.FC<IntegrationSectionProps> = ({
  exercises,
}) => {
  return (
    <section className="card integrate-section p-6 mt-8">
      <h3 className="section-title mb-6 flex items-center gap-2">
        <span className="icon text-primary">
          <Activity size={24} />
        </span>{" "}
        통합 운동 (Integration)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((ex) => (
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
        ))}
      </div>
    </section>
  );
};
