// helpers.tsx — CesInfo 분리 시 공유 상수/JSX 아이콘 (PRD 4-0 200줄 이하 보조)
import React from "react";
import {
  CircleSlash,
  Accessibility,
  Activity,
  CheckCircle2,
  User,
  BicepsFlexed,
  Hand,
  PersonStanding,
  Bone,
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

// STAGE_COLORS 와 동일한 hue 를 사용하되 CesInfo 전용 메타 (icon 포함)
import { STAGE_COLORS } from "../../lib/ces/CesPlayerTypes";

export const STAGE_LABELS: Record<CesStage, StageLabelMeta> = {
  inhibit: { label: "억제 (Inhibit)", short: "억제", icon: <CircleSlash size={18} color="currentColor" />, color: STAGE_COLORS.inhibit },
  lengthen: { label: "신장 (Lengthen)", short: "신장", icon: <Accessibility size={18} color="currentColor" />, color: STAGE_COLORS.lengthen },
  activate: { label: "활성 (Activate)", short: "활성", icon: <CheckCircle2 size={18} color="currentColor" />, color: STAGE_COLORS.activate },
  integrate: { label: "통합 (Integrate)", short: "통합", icon: <Activity size={18} color="currentColor" />, color: STAGE_COLORS.integrate },
};

export const JOINT_ICONS: Record<string, React.ReactNode> = {
  shoulder: <User size={18} />,
  elbow: <BicepsFlexed size={18} />,
  wrist: <Hand size={18} />,
  hip: <PersonStanding size={18} />,
  knee: <Bone size={18} />,
  ankle: <Footprints size={18} />,
  waist: <MoveVertical size={18} />,
};

export const UPPER_BODY = ["shoulder", "elbow", "wrist", "waist"];
export const LOWER_BODY = ["hip", "knee", "ankle"];
