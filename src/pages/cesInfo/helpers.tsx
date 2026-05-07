// helpers.tsx — CesInfo 분리 시 공유 상수/JSX 아이콘 (PRD 4-0 200줄 이하 보조)
import React from "react";
import {
  CircleSlash,
  Accessibility,
  Activity,
  CheckCircle2,
  User,
  Crosshair,
  Watch,
  Footprints,
  MoveVertical,
} from "lucide-react";
import type { CesStage } from "../../lib/ces/cesTypes";

interface StageLabelMeta {
  label: string;
  short: string;
  icon: React.ReactNode;
  color: string;
}

export const STAGE_LABELS: Record<CesStage, StageLabelMeta> = {
  inhibit: { label: "억제 (Inhibit)", short: "억제", icon: <CircleSlash size={18} color="currentColor" />, color: "var(--danger)" },
  lengthen: { label: "신장 (Lengthen)", short: "신장", icon: <Accessibility size={18} color="currentColor" />, color: "var(--warning)" },
  activate: { label: "활성 (Activate)", short: "활성", icon: <CheckCircle2 size={18} color="currentColor" />, color: "var(--success)" },
  integrate: { label: "통합 (Integrate)", short: "통합", icon: <Activity size={18} color="currentColor" />, color: "var(--primary)" },
};

export const JOINT_ICONS: Record<string, React.ReactNode> = {
  shoulder: <User size={18} />,
  elbow: <Crosshair size={18} />,
  wrist: <Watch size={18} />,
  hip: <Activity size={18} />,
  knee: <Footprints size={18} />,
  ankle: <Footprints size={18} />,
  waist: <MoveVertical size={18} />,
};

export const UPPER_BODY = ["shoulder", "elbow", "wrist", "waist"];
export const LOWER_BODY = ["hip", "knee", "ankle"];
