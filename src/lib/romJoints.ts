// romJoints.ts — 관절 정적 데이터 (audit #13: romData.ts 분리).
// 6개 관절 + 허리. 정상 ROM 기준은 AAOS 가이드 따름.
//
// 한국어 표시명은 `name`, 영문 의학 용어는 `englishName` 에 보관한다.
// UI 는 기본적으로 `name` 만 사용하고, 접근성/내보내기 등 필요할 때 `englishName` 을 참조.
import type { Joint } from "./romTypes";

export const JOINTS: Joint[] = [
  {
    id: "shoulder",
    name: "어깨",
    englishName: "Shoulder",
    movements: [
      { id: "flexion", name: "굴곡", englishName: "Flexion", normalRange: 180 },
      { id: "extension", name: "신전", englishName: "Extension", normalRange: 60 },
      { id: "abduction", name: "외전", englishName: "Abduction", normalRange: 180 },
      { id: "adduction", name: "내전", englishName: "Adduction", normalRange: 50 },
      { id: "internal_rotation", name: "내회전", englishName: "Internal Rotation", normalRange: 70 },
      { id: "external_rotation", name: "외회전", englishName: "External Rotation", normalRange: 90 },
    ],
  },
  {
    id: "elbow",
    name: "팔꿈치",
    englishName: "Elbow",
    movements: [
      { id: "flexion", name: "굴곡", englishName: "Flexion", normalRange: 150 },
      { id: "extension", name: "신전", englishName: "Extension", normalRange: 0 },
      { id: "supination", name: "회외", englishName: "Supination", normalRange: 80 },
      { id: "pronation", name: "회내", englishName: "Pronation", normalRange: 80 },
    ],
  },
  {
    id: "wrist",
    name: "손목",
    englishName: "Wrist",
    movements: [
      { id: "flexion", name: "굴곡", englishName: "Flexion", normalRange: 80 },
      { id: "extension", name: "신전", englishName: "Extension", normalRange: 70 },
      { id: "radial_deviation", name: "요측편위", englishName: "Radial Deviation", normalRange: 20 },
      { id: "ulnar_deviation", name: "척측편위", englishName: "Ulnar Deviation", normalRange: 30 },
    ],
  },
  {
    id: "hip",
    name: "고관절",
    englishName: "Hip",
    movements: [
      { id: "flexion", name: "굴곡", englishName: "Flexion", normalRange: 120 },
      { id: "extension", name: "신전", englishName: "Extension", normalRange: 30 },
      { id: "abduction", name: "외전", englishName: "Abduction", normalRange: 45 },
      { id: "adduction", name: "내전", englishName: "Adduction", normalRange: 30 },
      { id: "internal_rotation", name: "내회전", englishName: "Internal Rotation", normalRange: 45 },
      { id: "external_rotation", name: "외회전", englishName: "External Rotation", normalRange: 45 },
    ],
  },
  {
    id: "knee",
    name: "무릎",
    englishName: "Knee",
    movements: [
      { id: "flexion", name: "굴곡", englishName: "Flexion", normalRange: 135 },
      { id: "extension", name: "신전", englishName: "Extension", normalRange: 0 },
    ],
  },
  {
    id: "ankle",
    name: "발목",
    englishName: "Ankle",
    movements: [
      { id: "plantar_flexion", name: "저측굴곡", englishName: "Plantar Flexion", normalRange: 50 },
      { id: "dorsi_flexion", name: "배측굴곡", englishName: "Dorsiflexion", normalRange: 20 },
      { id: "inversion", name: "내번", englishName: "Inversion", normalRange: 35 },
      { id: "eversion", name: "외번", englishName: "Eversion", normalRange: 15 },
    ],
  },
  {
    id: "waist",
    name: "허리",
    englishName: "Waist",
    isSymmetric: true,
    movements: [
      { id: "lumbar_lordosis", name: "허리 전만", englishName: "Lumbar Lordosis", normalRange: 1, isQualitative: true },
      { id: "pelvic_tilt", name: "골반 경사", englishName: "Pelvic Tilt", normalRange: 1, isQualitative: true },
    ],
  },
];
