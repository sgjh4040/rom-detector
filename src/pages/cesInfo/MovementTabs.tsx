// MovementTabs.tsx — CesInfo 메인 패널 상단의 동작(Movement) 가로 탭 셀렉터.
import React from "react";

interface MovementOption {
  id: string;
  name: string;
}

interface MovementTabsProps {
  /** 표시할 동작 id 목록 (cesData.protocol 키) */
  movementIds: string[];
  /** id → 사람용 라벨 매핑 (currentJoint.movements) */
  movements: MovementOption[];
  activeMovement: string;
  onSelect: (id: string) => void;
}

export const MovementTabs: React.FC<MovementTabsProps> = ({
  movementIds,
  movements,
  activeMovement,
  onSelect,
}) => {
  return (
    <div className="movement-tabs mb-8 flex gap-2 flex-wrap">
      {movementIds.map((mId) => {
        const mName = movements.find((m) => m.id === mId)?.name || mId;
        return (
          <button
            key={mId}
            className={`ces-tab-btn flex-1 min-w-[120px] ${activeMovement === mId ? "is-active" : ""}`}
            onClick={() => onSelect(mId)}
          >
            {mName}
          </button>
        );
      })}
    </div>
  );
};
