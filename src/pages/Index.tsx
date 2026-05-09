import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMeasurementQueue } from "../lib/romData";
import type { Side, RomSession } from "../lib/romData";
import { loadRomSession } from "../lib/romTypes";
import { PatientSelector } from "../features/session/presentation/PatientSelector";
import {
  NewMeasurementForm,
  type SideMode,
} from "../features/measurement/presentation/NewMeasurementForm";
import { AppLayout } from "../core/components/AppLayout";
import { EmptyPatientState } from "../features/session/presentation/EmptyPatientState";
import { PatientSummaryCard } from "../features/session/presentation/PatientSummaryCard";
import { ConfirmDialog } from "../core/components/ConfirmDialog";
import { Settings } from "lucide-react";
import { useIndexPageHandlers } from "./index/useIndexPageHandlers";
import { getPatientHistory } from "../lib/patientHistory";

// 좌/우 측 선택 → 실제 측정 방향 배열로 변환
const SIDE_MODE_MAP: Record<SideMode, Side[]> = {
  좌측만: ["좌측"],
  우측만: ["우측"],
  양쪽: ["좌측", "우측"],
};

export const Index: React.FC = () => {
  const navigate = useNavigate();

  // 마운트 시 기존 세션이 있으면 환자 정보를 자동 복원 (측정 → 결과 → 홈 흐름에서 맥락 유지)
  const initialSession = loadRomSession();

  // 폼 state — 환자 선택 시 자동 채워지고 사용자가 수정 가능
  const [name, setName] = useState(initialSession?.patientName ?? "");
  const [age, setAge] = useState(
    initialSession?.patientAge ? String(initialSession.patientAge) : "",
  );
  const [painArea, setPainArea] = useState(initialSession?.painArea ?? "");
  const [vasScore, setVasScore] = useState<number>(initialSession?.vasScore ?? 0);
  const [patientId, setPatientId] = useState<string | undefined>(initialSession?.patientId);
  const [sideMode, setSideMode] = useState<SideMode>("좌측만");
  const [selectedJointIds, setSelectedJointIds] = useState<string[]>([]);

  // UI 모드 state
  const [isManaging, setIsManaging] = useState(false); // 환자 목록 관리(삭제) 모드
  const [isAddingNew, setIsAddingNew] = useState(false); // 새 환자 등록 폼 펼침
  const [isStartingNewMeasurement, setIsStartingNewMeasurement] = useState(false); // 기존 환자 → 측정 폼 펼침

  const sides = SIDE_MODE_MAP[sideMode];
  const totalSteps = getMeasurementQueue({
    selectedJointIds,
    selectedSides: sides,
  } as RomSession).length;

  // [audit #13 Phase 3] 핸들러 + 환자 목록/삭제 확인 state 는 훅으로 분리.
  // 폼 state(name/age/painArea/vasScore/...) 는 controlled 패턴 유지.
  const {
    patients,
    pendingDelete,
    setPendingDelete,
    handleSelectPatient,
    handleNewPatient,
    handleDeletePatient,
    handleConfirmDeletePatient,
    handleSubmit,
  } = useIndexPageHandlers({
    name, age, painArea, vasScore, patientId,
    selectedJointIds, sides,
    setName, setAge, setPainArea, setVasScore, setPatientId,
    setIsAddingNew, setIsStartingNewMeasurement, setIsManaging,
  });
  ////////////////////////////////////////////////////////
  //밑으로는 보여주는 부분

  // 상태 A: 등록된 환자가 없고, 새 환자 등록 폼도 아직 안 열림
  if (patients.length === 0 && !isAddingNew) {
    return (
      <AppLayout patientId={undefined}>
        <EmptyPatientState onAddPatient={() => setIsAddingNew(true)} />
      </AppLayout>
    );
  }

  // 상태 분기
  // - 환자 선택 없고 등록 중도 아님 → "환자를 선택하거나 새로 등록해 주세요"
  // - 기존 환자 선택 → 요약 카드 (측정 시작/기록 보기 CTA)
  // - 새 환자 등록 OR 기존 환자에서 "새 측정 시작" 클릭 → 폼 펼침
  const showSummary =
    patientId !== undefined && !isAddingNew && !isStartingNewMeasurement;
  const showForm = isAddingNew || isStartingNewMeasurement;

  // 요약 카드에서 사용 — 현재 선택된 환자의 측정 히스토리 건수
  const historyCount = patientId ? getPatientHistory(patientId).length : 0;
  const lastMeasuredAt = patients.find((p) => p.id === patientId)?.lastMeasuredAt;

  return (
    <AppLayout patientId={patientId}>
      <div className="bg-full-viewport page-bg-home">
        <div className="container pb-10">
          <div className="page-header">
            <button
              onClick={() => navigate("/settings")}
              className="btn-settings-top flex items-center justify-center"
            >
              <Settings size={22} className="text-gray-600" />
            </button>
            <h1>ROM 측정 시스템</h1>
            <p>평가 및 재활 처방</p>
          </div>

          <div className="card">
            {/* 기존 환자 선택 또는 새 환자 등록, componets 에 있음 */}
            <PatientSelector
              patients={patients}
              patientId={patientId}
              isManaging={isManaging}
              setIsManaging={setIsManaging}
              handleSelectPatient={handleSelectPatient}
              handleDeletePatient={handleDeletePatient}
              handleNewPatient={handleNewPatient}
              isAddingNew={isAddingNew}
            />

            {!showSummary && !showForm && (
              <div
                style={{
                  padding: "2rem 1rem",
                  textAlign: "center",
                  color: "var(--text-secondary)",
                }}
              >
                <p style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>
                  환자를 선택하거나 새로 등록해 주세요
                </p>
              </div>
            )}

            {showSummary && patientId && (
              <PatientSummaryCard
                patientId={patientId}
                name={name}
                age={age}
                painArea={painArea}
                vasScore={vasScore}
                historyCount={historyCount}
                lastMeasuredAt={lastMeasuredAt}
                onStartMeasurement={() => setIsStartingNewMeasurement(true)}
                onViewTrends={() => navigate(`/trends?patientId=${patientId}`)}
              />
            )}

            {showForm && (
              <NewMeasurementForm
                name={name}
                setName={setName}
                age={age}
                setAge={setAge}
                painArea={painArea}
                setPainArea={setPainArea}
                vasScore={vasScore}
                setVasScore={setVasScore}
                sideMode={sideMode}
                setSideMode={setSideMode}
                selectedJointIds={selectedJointIds}
                toggleJoint={(id: string) =>
                  setSelectedJointIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((i) => i !== id)
                      : [...prev, id],
                  )
                }
                totalSteps={totalSteps}
                showBackButton={isStartingNewMeasurement && !isAddingNew}
                onBack={() => setIsStartingNewMeasurement(false)}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>

      {/* [audit #24] 환자 개별 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={pendingDelete !== null}
        title="환자를 삭제할까요?"
        description={
          pendingDelete
            ? `${pendingDelete.name} 님과 모든 측정 기록이 사라집니다.\n이 작업은 되돌릴 수 없어요.`
            : undefined
        }
        confirmLabel="삭제"
        cancelLabel="취소"
        variant="danger"
        onConfirm={handleConfirmDeletePatient}
        onCancel={() => setPendingDelete(null)}
      />
    </AppLayout>
  );
};
