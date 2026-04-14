import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMeasurementQueue,
  saveRomSession,
  getPatients,
  deletePatient,
  getPatientHistory,
} from "../lib/romData";
import type { Side, Patient, RomSession } from "../lib/romData";
import { loadRomSession, clearRomSession } from "../lib/romTypes";
import { PatientSelector } from "../components/PatientSelector";
import { PainAssessment } from "../components/PainAssessment";
import { JointSelector } from "../components/JointSelector";
import { AppLayout } from "../components/AppLayout";
import { EmptyPatientState } from "../components/EmptyPatientState";
import { HomePatientSummary } from "../components/HomePatientSummary";
import { Settings, Play, LineChart } from "lucide-react";

type SideMode = "좌측만" | "우측만" | "양쪽";
const SIDE_MODE_MAP: Record<SideMode, Side[]> = {
  좌측만: ["좌측"],
  우측만: ["우측"],
  양쪽: ["좌측", "우측"],
};
//사용자 고른값 좌측만 -> 좌측으로 저장

export const Index: React.FC = () => {
  const navigate = useNavigate();

  // 마운트 시 기존 세션이 있으면 자동으로 환자 정보를 채운다.
  // (측정 → 결과 → 홈으로 돌아올 때 환자 맥락 유지)
  const initialSession = loadRomSession();

  const [name, setName] = useState(initialSession?.patientName ?? "");
  //상자 안 현재값 =name, 상자값 바꾸는 리모컨 = setName

  const [age, setAge] = useState(
    initialSession?.patientAge ? String(initialSession.patientAge) : "",
  );
  // 나이

  const [painArea, setPainArea] = useState(initialSession?.painArea ?? "");
  // 통증부위

  const [vasScore, setVasScore] = useState<number>(initialSession?.vasScore ?? 0);
  // 통증 점수 (0점~10점 사이 점수)

  const [patientId, setPatientId] = useState<string | undefined>(
    initialSession?.patientId,
  );
  // 환자마다 부여되는 고유 번호 (기존 환자일 때만 있음)

  const [sideMode, setSideMode] = useState<SideMode>("좌측만");
  // 어느 쪽을 잴 건지 고르는 스위치 (왼쪽/오른쪽/양쪽)

  const [selectedJointIds, setSelectedJointIds] = useState<string[]>([]);
  // 화면에서 체크(선택)한 관절들이 담기는 바구니

  const [isManaging, setIsManaging] = useState(false);
  // 현재 '관자 목록 관리(삭제 등)' 중인지 알려주는 상태

  const [patients, setPatients] = useState(getPatients());
  // 내 컴퓨터(local)에 저장되어있는 환자 목록들 싹 다 불러오기

  const [isAddingNew, setIsAddingNew] = useState(false);
  // 새 환자 등록 폼이 열려있는지 (환자 미선택 상태에서 폼을 표시할지 결정)

  const [isStartingNewMeasurement, setIsStartingNewMeasurement] =
    useState(false);
  // 기존 환자 선택 시 요약 카드 → 측정 설정 폼으로 전환 여부
  // 첫 진입은 요약 카드만 보이고, 버튼을 눌러야 폼이 펼쳐진다

  const sides = SIDE_MODE_MAP[sideMode];
  // 고른 방향(좌/우/양쪽)에 따라 실제로 측정할 쪽을 결정

  const queueInput: Pick<RomSession, "selectedJointIds" | "selectedSides"> = {
    selectedJointIds,
    selectedSides: sides,
  };
  const totalSteps = getMeasurementQueue(queueInput as RomSession).length;
  //totalSteps: 측정해야 할 총 단계 수

  const handleSelectPatient = (p: Patient) => {
    setPatientId(p.id);
    setName(p.name);
    setAge(p.age.toString());
    setPainArea(p.painArea || "");
    setVasScore(p.vasScore || 0);
    setIsAddingNew(false);
    // 환자를 새로 선택하면 요약 카드부터 보여준다
    setIsStartingNewMeasurement(false);

    // 다른 페이지(Settings, Trends 등)에서도 해당 환자 맥락을 유지하기 위해
    // localStorage 세션을 최근 측정 기록 또는 최소 정보로 갱신
    const history = getPatientHistory(p.id);
    if (history.length > 0) {
      // 최근 측정 기록이 있으면 그대로 세션으로 복원 (Results, CES 등에서 활용)
      saveRomSession(history[0]);
    } else {
      // 측정 기록이 없으면 환자 정보만 담은 최소 세션
      saveRomSession({
        patientId: p.id,
        patientName: p.name,
        patientAge: p.age,
        painArea: p.painArea || "",
        vasScore: p.vasScore || 0,
        selectedJointIds: [],
        selectedSides: [],
        measurements: {},
        createdAt: new Date().toISOString(),
      });
    }
  };
  //환자를 선택하면 → 그 환자의 정보를 state에 넣어서 화면에 자동으로 채움
  //  + localStorage 세션도 함께 갱신해서 다른 페이지 이동 시 일관성 유지

  const handleNewPatient = () => {
    // Index state 해제 + 현재 세션도 함께 제거
    // (다른 페이지에서 이전 환자가 따라다니는 일관성 깨짐 방지)
    // 환자 목록/히스토리 데이터는 유지됨 — 언제든 다시 선택 가능
    clearRomSession();
    setPatientId(undefined);
    setName("");
    setAge("");
    setPainArea("");
    setVasScore(0);
    setIsManaging(false);
    setIsAddingNew(true);
    setIsStartingNewMeasurement(false);
  };

  const handleDeletePatient = (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    deletePatient(id);
    setPatients(getPatients()); // 화면 새로고침
    if (patientId === id) handleNewPatient();
  };

  const handleSubmit = (e: React.FormEvent) => {
    // '측정 시작하기' 버튼을 눌렀을 때 실행되는 부분
    e.preventDefault();
    if (!name || !age) return alert("정보를 입력해주세요.");
    if (selectedJointIds.length === 0) return alert("관절을 선택해 주세요.");

    // 1. 현재 정보를 세션으로 저장
    saveRomSession({
      patientId: patientId || `p_${Date.now()}`,
      patientName: name,
      patientAge: parseInt(age, 10),
      painArea,
      vasScore,
      selectedJointIds,
      selectedSides: sides,
      measurements: {},
      createdAt: new Date().toISOString(),
    });

    // 2. 측정 순서를 정해서 첫 번째 측정 화면으로 이동
    const queue = getMeasurementQueue(queueInput as RomSession);
    navigate(`/measure?joint=${queue[0].jointId}&side=${queue[0].side}`);
  };
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
                <p style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                  환자를 선택하거나 새로 등록해 주세요
                </p>
              </div>
            )}

            {showSummary && (
              <div className="patient-summary">
                <div className="patient-summary__info">
                  <h2 className="patient-summary__name">
                    {name}
                    <span className="patient-summary__age"> ({age}세)</span>
                  </h2>
                  <div className="patient-summary__meta">
                    {painArea && <span>{painArea}</span>}
                    {painArea && <span className="dot">·</span>}
                    <span>VAS {vasScore}</span>
                    {historyCount > 0 && (
                      <>
                        <span className="dot">·</span>
                        <span>측정 {historyCount}회</span>
                      </>
                    )}
                  </div>
                  {lastMeasuredAt && (
                    <p className="patient-summary__last">
                      최근 측정:{" "}
                      {new Date(lastMeasuredAt).toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <div className="patient-summary__actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-large"
                    onClick={() => setIsStartingNewMeasurement(true)}
                  >
                    <Play size={18} /> 새 측정 시작
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-large"
                    onClick={() =>
                      navigate(`/trends?patientId=${patientId}`)
                    }
                    disabled={historyCount === 0}
                    style={
                      historyCount === 0
                        ? { opacity: 0.5, cursor: "not-allowed" }
                        : undefined
                    }
                  >
                    <LineChart size={18} />
                    {historyCount === 0 ? "측정 기록 없음" : "측정 기록 보기"}
                  </button>
                </div>
                {patientId && <HomePatientSummary patientId={patientId} />}
              </div>
            )}

            {showForm && (
            <form onSubmit={handleSubmit}>
              {/* 기존 환자에서 "새 측정 시작"을 눌러 들어온 경우, 돌아가기 링크 제공 */}
              {isStartingNewMeasurement && !isAddingNew && (
                <button
                  type="button"
                  className="patient-summary__back"
                  onClick={() => setIsStartingNewMeasurement(false)}
                >
                  ← 환자 정보로 돌아가기
                </button>
              )}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">이름</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="성함"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">나이</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="세"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
              </div>

              <PainAssessment
                painArea={painArea}
                setPainArea={setPainArea}
                vasScore={vasScore}
                setVasScore={setVasScore}
              />

              <div className="form-group mt-6">
                <label className="form-label mb-3 block">방향 선택</label>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(SIDE_MODE_MAP) as SideMode[]).map((mode) => {
                    const selected = sideMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        className={`btn ${selected ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setSideMode(mode)}
                      >
                        {selected ? "✓ " : ""}
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>

              <JointSelector
                selectedJointIds={selectedJointIds}
                toggleJoint={(id) =>
                  setSelectedJointIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((i) => i !== id)
                      : [...prev, id],
                  )
                }
              />

              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-large w-full"
                  disabled={totalSteps === 0}
                  style={
                    totalSteps === 0
                      ? { opacity: 0.5, cursor: "not-allowed" }
                      : undefined
                  }
                >
                  {totalSteps === 0
                    ? "관절을 먼저 선택해주세요"
                    : `측정 시작하기 (${totalSteps}단계)`}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
