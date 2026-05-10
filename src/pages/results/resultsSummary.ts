// resultsSummary.ts — Results 페이지의 (관절 × 방향) 집계 + 요약 문장 (audit #13).
import { JOINTS, calculateSeverity } from "../../lib/romData";
import type { RomSession, Side } from "../../lib/romData";

export interface JointSideStat {
  jointId: string;
  side: Side;
  jointName: string;
  limitedCount: number;
  totalCount: number;
  hasSevere: boolean;
}

export interface ResultsSummary {
  jointSideStats: JointSideStat[];
  sortedJointSideStats: JointSideStat[];
  totalLimited: number;
  totalNormal: number;
  summarySentence: string;
}

/** session 의 measurements 를 (jointId × side) 단위로 집계하고 정렬/요약까지 한 번에 처리. */
export const computeResultsSummary = (session: RomSession): ResultsSummary => {
  const jointSideStats: JointSideStat[] = [];
  session.selectedJointIds.forEach((jid) => {
    const joint = JOINTS.find((j) => j.id === jid);
    if (!joint) return;
    const sidesForThisJoint: Side[] = joint.isSymmetric
      ? ["좌측"]
      : session.selectedSides;
    sidesForThisJoint.forEach((side) => {
      let limited = 0;
      let severe = 0;
      joint.movements.forEach((m) => {
        const measured = session.measurements?.[jid]?.[side]?.[m.id] ?? 0;
        const severity = m.isQualitative
          ? measured === 1
            ? "심각한제한"
            : "정상"
          : calculateSeverity(measured, m.normalRange);
        if (severity !== "정상") limited += 1;
        if (severity === "심각한제한") severe += 1;
      });
      jointSideStats.push({
        jointId: jid,
        side,
        jointName: joint.name,
        limitedCount: limited,
        totalCount: joint.movements.length,
        hasSevere: severe > 0,
      });
    });
  });

  // 제한 개수 내림차순, 동수면 심각한제한 우선
  const sortedJointSideStats = [...jointSideStats].sort((a, b) => {
    if (b.limitedCount !== a.limitedCount)
      return b.limitedCount - a.limitedCount;
    if (a.hasSevere !== b.hasSevere) return a.hasSevere ? -1 : 1;
    return 0;
  });

  const totalLimited = jointSideStats.reduce(
    (sum, s) => sum + s.limitedCount,
    0,
  );
  const totalNormal = jointSideStats.reduce(
    (sum, s) => sum + (s.totalCount - s.limitedCount),
    0,
  );

  // 상단 요약 문장 — 가장 제한이 큰 관절을 우선 강조
  const worst = sortedJointSideStats[0];
  const summarySentence = (() => {
    if (!worst || totalLimited === 0) {
      return "측정 결과 특이 소견이 없어요. 꾸준히 관리해 주세요.";
    }
    const sideLabel = JOINTS.find((j) => j.id === worst.jointId)?.isSymmetric
      ? ""
      : ` ${worst.side}`;
    return `${worst.jointName}${sideLabel}에서 ${worst.limitedCount}개 동작이 제한돼 있어요${
      worst.hasSevere ? " (심각 포함)" : ""
    }.`;
  })();

  return {
    jointSideStats,
    sortedJointSideStats,
    totalLimited,
    totalNormal,
    summarySentence,
  };
};
