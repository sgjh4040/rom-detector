// Index.tsx — 홈 페이지 (redesign-spike, 2026-05-17)
// 도메인 로직·핸들러는 기존 useIndexPageHandlers 그대로 유지.
// 시각 레이어만 AppShell + redesign 컴포넌트로 교체.
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { getMeasurementQueue } from "../lib/romData";
import type { Side, RomSession } from "../lib/romData";
import { loadRomSession } from "../lib/romTypes";
import {
  NewMeasurementForm,
  type SideMode,
} from "../features/measurement/presentation/NewMeasurementForm";
import { ConfirmDialog } from "../core/components/ConfirmDialog";
import { useIndexPageHandlers } from "./index/useIndexPageHandlers";
import { EmptyPatientsState } from "./index/EmptyPatientsState";
import { IndexHeader } from "./index/IndexHeader";
import { getPatientHistory } from "../lib/patientHistory";
import { AppShell } from "../components/redesign/AppShell";
import { PatientCard } from "../components/redesign/PatientCard";
import { PatientSummary } from "../components/redesign/PatientSummary";
import { Input } from "../components/redesign/ui/Input";
import { Card } from "../components/redesign/ui/Card";

const SIDE_MODE_MAP: Record<SideMode, Side[]> = {
  좌측만: ["좌측"],
  우측만: ["우측"],
  양쪽: ["좌측", "우측"],
};

export const Index: React.FC = () => {
  const navigate = useNavigate();
  const initialSession = loadRomSession();

  // 폼 state
  const [name, setName] = useState(initialSession?.patientName ?? "");
  const [age, setAge] = useState(initialSession?.patientAge ? String(initialSession.patientAge) : "");
  const [painArea, setPainArea] = useState(initialSession?.painArea ?? "");
  const [vasScore, setVasScore] = useState<number>(initialSession?.vasScore ?? 0);
  const [patientId, setPatientId] = useState<string | undefined>(initialSession?.patientId);
  const [sideMode, setSideMode] = useState<SideMode>("좌측만");
  const [selectedJointIds, setSelectedJointIds] = useState<string[]>([]);

  // UI mode
  const [isManaging, setIsManaging] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isStartingNewMeasurement, setIsStartingNewMeasurement] = useState(false);
  const [search, setSearch] = useState("");

  const sides = SIDE_MODE_MAP[sideMode];
  const totalSteps = getMeasurementQueue({
    selectedJointIds,
    selectedSides: sides,
  } as RomSession).length;

  const {
    patients, pendingDelete, setPendingDelete,
    handleSelectPatient, handleNewPatient, handleDeletePatient,
    handleConfirmDeletePatient, handleSubmit,
  } = useIndexPageHandlers({
    name, age, painArea, vasScore, patientId,
    selectedJointIds, sides,
    setName, setAge, setPainArea, setVasScore, setPatientId,
    setIsAddingNew, setIsStartingNewMeasurement, setIsManaging,
  });

  const filtered = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.trim().toLowerCase();
    return patients.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.painArea ?? "").toLowerCase().includes(q),
    );
  }, [patients, search]);

  const showSummary = patientId !== undefined && !isAddingNew && !isStartingNewMeasurement;
  const showForm = isAddingNew || isStartingNewMeasurement;
  const historyCount = patientId ? getPatientHistory(patientId).length : 0;
  const lastMeasuredAt = patients.find((p) => p.id === patientId)?.lastMeasuredAt;

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        <IndexHeader
          patientCount={patients.length}
          isManaging={isManaging}
          onToggleManaging={() => setIsManaging(!isManaging)}
          onNewPatient={handleNewPatient}
        />

        {/* 검색 입력 — 환자 3명 이상일 때만 노출 */}
        {patients.length >= 3 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--color-muted-foreground)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름·통증 부위로 검색"
              className="pl-9 pr-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {/* 환자 카드 리스트 */}
        {patients.length === 0 && !isAddingNew && (
          <EmptyPatientsState onAddFirstPatient={() => setIsAddingNew(true)} />
        )}

        {patients.length > 0 && (
          <div className="flex flex-col gap-2">
            {filtered.map((p) => (
              <PatientCard
                key={p.id}
                patient={p}
                selected={p.id === patientId && !isManaging}
                managing={isManaging}
                onSelect={() => handleSelectPatient(p)}
                onDelete={() => handleDeletePatient(p.id)}
              />
            ))}
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-[var(--color-muted-foreground)]">
                "{search}" 와 일치하는 환자가 없습니다
              </p>
            )}
          </div>
        )}

        {/* 환자 선택 안내 — 환자는 있는데 아직 선택 안 됨 */}
        {patients.length > 0 && !showSummary && !showForm && !isManaging && (
          <p className="text-center text-xs text-[var(--color-muted-foreground)]">
            카드를 탭하면 측정·기록을 시작할 수 있어요
          </p>
        )}

        {/* 선택된 환자 요약 */}
        {showSummary && patientId && (
          <PatientSummary
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

        {/* 측정/등록 폼 — 기존 컴포넌트 그대로 (Phase 1 에서 교체 예정) */}
        {showForm && (
          <Card className="p-5">
            <NewMeasurementForm
              name={name} setName={setName}
              age={age} setAge={setAge}
              painArea={painArea} setPainArea={setPainArea}
              vasScore={vasScore} setVasScore={setVasScore}
              sideMode={sideMode} setSideMode={setSideMode}
              selectedJointIds={selectedJointIds}
              toggleJoint={(id: string) =>
                setSelectedJointIds((prev) =>
                  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
                )
              }
              totalSteps={totalSteps}
              showBackButton={isStartingNewMeasurement && !isAddingNew}
              onBack={() => setIsStartingNewMeasurement(false)}
              onSubmit={handleSubmit}
            />
          </Card>
        )}
      </div>

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
    </AppShell>
  );
};
