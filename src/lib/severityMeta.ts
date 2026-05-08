// severityMeta.ts — Severity 4단계 시각/라벨 단일 진실원 (audit #37)
//
// 이전엔 SEVERITY_COLORS 가 AngleDial / HomePatientSummary / JointSideResult
// 3곳에 각자 정의돼 있었고 중등도 색상이 어디는 #FB923C(오렌지) 어디는
// var(--warning)(앰버) 으로 어긋나 있었음. 라벨도 어디는 "심각한제한" 어디는
// "심각" 으로 길이가 달라 배지 면적/시각 부담이 일관성 없었음.
//
// 이 파일을 단일 진실원으로 사용하고 SeverityBadge 컴포넌트로 표준화.
import type { Severity } from "./romTypes";

/**
 * 4단계 차별화 색상 — 의료 데이터에서 단계 구분이 즉시 인지되도록
 * 중등도(오렌지)와 경도(앰버)가 다른 톤으로 분리됨.
 */
export const SEVERITY_COLORS: Record<Severity, string> = {
  정상: "var(--success)",
  경도제한: "var(--warning)",
  중등도제한: "#FB923C",
  심각한제한: "var(--danger)",
};

/**
 * 짧은 표시 라벨 — 배지/칩처럼 면적이 작은 곳 기본값.
 * "심각한제한" 같은 풀 네임이 필요한 곳은 그대로 Severity 값 사용.
 */
export const SEVERITY_SHORT_LABELS: Record<Severity, string> = {
  정상: "정상",
  경도제한: "경도",
  중등도제한: "중등도",
  심각한제한: "심각",
};
