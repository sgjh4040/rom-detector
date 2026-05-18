// JointSideHeader.tsx — CesProtocol 메인 상단 관절·방향 select + 환자 메타 (redesign-spike).
import React from "react";
import { ChevronDown } from "lucide-react";

interface JointSideOption {
  id: string;
  label: string;
}

interface JointSideHeaderProps {
  jointSideList: JointSideOption[];
  activeJointSide: string;
  onChange: (id: string) => void;
  patientName?: string;
  patientAge?: number;
}

export const JointSideHeader: React.FC<JointSideHeaderProps> = ({
  jointSideList,
  activeJointSide,
  onChange,
  patientName,
  patientAge,
}) => (
  <div className="flex items-center justify-between gap-3">
    <div className="relative">
      <select
        value={activeJointSide}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] py-2 pl-3.5 pr-9 text-lg font-extrabold text-[var(--color-foreground)] cursor-pointer hover:bg-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:ring-offset-2"
      >
        {jointSideList.map((js) => (
          <option key={js.id} value={js.id}>
            {js.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-[var(--color-muted-foreground)]" />
    </div>
    {(patientName || patientAge) && (
      <span className="text-xs font-medium text-[var(--color-muted-foreground)] whitespace-nowrap">
        {patientName ?? "환자"}
        {patientAge ? ` · ${patientAge}세` : ""}
      </span>
    )}
  </div>
);
