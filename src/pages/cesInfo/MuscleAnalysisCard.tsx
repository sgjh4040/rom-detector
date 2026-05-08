// MuscleAnalysisCard.tsx — CesInfo info-grid 좌측의 근육 분석 카드.
// 과활성(빨강) / 저활성(초록) 근육 태그 두 그룹.
import React from "react";
import { Brain } from "lucide-react";

interface MuscleAnalysisCardProps {
  /** 과활성(짧아짐) 근육 — 빨간 태그 */
  overactive: string[];
  /** 저활성(약해짐) 근육 — 초록 태그 */
  underactive: string[];
}

export const MuscleAnalysisCard: React.FC<MuscleAnalysisCardProps> = ({
  overactive,
  underactive,
}) => {
  return (
    <section className="card muscle-map-card p-6 h-full">
      <h3 className="section-title mb-4 icon-text">
        <span className="icon text-primary">
          <Brain size={24} />
        </span>{" "}
        근육 분석
      </h3>
      <div className="space-y-6">
        <div>
          <h4 className="icon-text text-red-400 font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            과활성 (짧아짐)
          </h4>
          <div className="flex flex-wrap gap-2">
            {overactive.map((m) => (
              <span key={m} className="muscle-tag overactive">
                {m}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="icon-text text-green-400 font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            저활성 (약해짐)
          </h4>
          <div className="flex flex-wrap gap-2">
            {underactive.map((m) => (
              <span key={m} className="muscle-tag underactive">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
