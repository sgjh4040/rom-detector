// useIndexPageHandlers.ts — 홈 페이지 (Index.tsx) 핸들러 + 환자 목록/삭제 다이얼로그 state.
// audit #13 Phase 3 — Index.tsx 200줄 이하 달성을 위한 분리.
//
// 폼 state (name/age/painArea/vasScore/...) 는 Index.tsx 가 그대로 유지하고,
// 이 훅은 그것들을 args 로 받아 핸들러에서 setter 를 호출한다 (controlled).
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveRomSession,
  getPatients,
  deletePatient,
  getPatientHistory,
  getMeasurementQueue,
} from "../../lib/romData";
import { clearRomSession } from "../../lib/romTypes";
import type { Patient, RomSession, Side } from "../../lib/romData";

interface FormSetters {
  setName: (v: string) => void;
  setAge: (v: string) => void;
  setPainArea: (v: string) => void;
  setVasScore: (v: number) => void;
  setPatientId: (v: string | undefined) => void;
  setIsAddingNew: (v: boolean) => void;
  setIsStartingNewMeasurement: (v: boolean) => void;
  setIsManaging: (v: boolean) => void;
}

interface UseIndexPageHandlersArgs extends FormSetters {
  // submit 시 필요한 현재 폼 값
  name: string;
  age: string;
  painArea: string;
  vasScore: number;
  patientId?: string;
  selectedJointIds: string[];
  sides: Side[];
}

export const useIndexPageHandlers = (args: UseIndexPageHandlersArgs) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(getPatients());
  // [audit #24] 환자 개별 삭제 확인 — id + 이름을 다이얼로그가 표시하도록 보관
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const handleSelectPatient = (p: Patient) => {
    // 다른 페이지(Settings, Trends 등)에서도 해당 환자 맥락을 유지하기 위해
    // localStorage 세션을 최근 측정 기록 또는 최소 정보로 갱신
    // (history 는 newest-first 정렬 보장 — patientHistory 의 방어적 정렬)
    const history = getPatientHistory(p.id);
    const latest = history[0];

    args.setPatientId(p.id);
    args.setName(p.name);
    // 과거 잘못된 import 등으로 age 가 비어 있어도 크래시 대신 빈 값으로 동작
    args.setAge(Number.isFinite(p.age) ? p.age.toString() : "");
    args.setPainArea(p.painArea || "");
    // [audit #1] 환자 카드 메타에 표시되는 VAS 는 최신 측정값을 우선.
    // 등록 시점 VAS 는 fallback (측정 기록이 0건일 때만 사용).
    args.setVasScore(latest?.vasScore ?? p.vasScore ?? 0);
    args.setIsAddingNew(false);
    // 환자를 새로 선택하면 요약 카드부터 보여준다
    args.setIsStartingNewMeasurement(false);

    if (latest) {
      // 최근 측정 기록이 있으면 그대로 세션으로 복원 (Results, CES 등에서 활용)
      saveRomSession(latest);
    } else {
      // 측정 기록이 없으면 환자 정보만 담은 최소 세션
      saveRomSession({
        patientId: p.id,
        patientName: p.name,
        patientAge: Number.isFinite(p.age) ? p.age : 0,
        painArea: p.painArea || "",
        vasScore: p.vasScore || 0,
        selectedJointIds: [],
        selectedSides: [],
        measurements: {},
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleNewPatient = () => {
    // Index state 해제 + 현재 세션도 함께 제거
    // (다른 페이지에서 이전 환자가 따라다니는 일관성 깨짐 방지)
    // 환자 목록/히스토리 데이터는 유지됨 — 언제든 다시 선택 가능
    clearRomSession();
    args.setPatientId(undefined);
    args.setName("");
    args.setAge("");
    args.setPainArea("");
    args.setVasScore(0);
    args.setIsManaging(false);
    args.setIsAddingNew(true);
    args.setIsStartingNewMeasurement(false);
  };

  const handleDeletePatient = (id: string) => {
    const target = patients.find((p) => p.id === id);
    if (!target) return;
    setPendingDelete({ id, name: target.name });
  };

  const handleConfirmDeletePatient = () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    deletePatient(id);
    setPatients(getPatients()); // 화면 새로고침
    if (args.patientId === id) handleNewPatient();
    setPendingDelete(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    // '측정 시작하기' 버튼을 눌렀을 때 실행되는 부분
    e.preventDefault();
    if (!args.name || !args.age) return alert("정보를 입력해주세요.");
    if (args.selectedJointIds.length === 0) return alert("관절을 선택해 주세요.");

    // 1. 현재 정보를 세션으로 저장
    saveRomSession({
      patientId: args.patientId || `p_${Date.now()}`,
      patientName: args.name,
      patientAge: parseInt(args.age, 10),
      painArea: args.painArea,
      vasScore: args.vasScore,
      selectedJointIds: args.selectedJointIds,
      selectedSides: args.sides,
      measurements: {},
      createdAt: new Date().toISOString(),
    });

    // 2. 측정 순서를 정해서 첫 번째 측정 화면으로 이동
    const queue = getMeasurementQueue({
      selectedJointIds: args.selectedJointIds,
      selectedSides: args.sides,
    } as RomSession);
    navigate(`/measure?joint=${queue[0].jointId}&side=${queue[0].side}`);
  };

  return {
    patients,
    pendingDelete,
    setPendingDelete,
    handleSelectPatient,
    handleNewPatient,
    handleDeletePatient,
    handleConfirmDeletePatient,
    handleSubmit,
  };
};
