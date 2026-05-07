// JointSidebar.tsx — CesInfo 좌측 관절 선택 사이드바 (모바일에선 가로 칩 셀렉터로 변환).
// 상체/하체 그룹별로 관절 칩을 렌더 + 하단에 프로토콜 시작/닫기 액션.
import React from "react";
import { JOINTS } from "../../lib/romData";
import { JOINT_ICONS, UPPER_BODY, LOWER_BODY } from "./helpers";

interface JointSidebarProps {
  selectedJointId: string;
  onSelect: (jointId: string) => void;
  onStartProtocol: () => void;
  onClose: () => void;
}

export const JointSidebar: React.FC<JointSidebarProps> = ({
  selectedJointId,
  onSelect,
  onStartProtocol,
  onClose,
}) => {
  return (
    <div className="ces-sidebar">
      <div className="sidebar-logo">
        <span>●</span> CES 참고
      </div>
      <div className="sidebar-menu mt-8">
        <div className="menu-group-label text-[10px] opacity-40 font-bold mb-2 ml-4 tracking-widest">
          상체
        </div>
        {JOINTS.filter((j) => UPPER_BODY.includes(j.id)).map((j) => (
          <button
            key={j.id}
            className={`sidebar-item ${selectedJointId === j.id ? "is-active" : ""}`}
            onClick={() => onSelect(j.id)}
          >
            <span className="item-icon">{JOINT_ICONS[j.id]}</span>
            <span className="item-label">{j.name.split(" (")[0]}</span>
          </button>
        ))}

        <div className="menu-group-label text-[10px] opacity-40 font-bold mb-2 ml-4 mt-6 tracking-widest">
          하체
        </div>
        {JOINTS.filter((j) => LOWER_BODY.includes(j.id)).map((j) => (
          <button
            key={j.id}
            className={`sidebar-item ${selectedJointId === j.id ? "is-active" : ""}`}
            onClick={() => onSelect(j.id)}
          >
            <span className="item-icon">{JOINT_ICONS[j.id]}</span>
            <span className="item-label">{j.name.split(" (")[0]}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-actions mt-auto">
        <button className="btn-complete" onClick={onStartProtocol}>
          프로토콜 시작 <span>›</span>
        </button>
        <button className="btn-close-circle" onClick={onClose} aria-label="닫기">
          ✕
        </button>
      </div>
    </div>
  );
};
