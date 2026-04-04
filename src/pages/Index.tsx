import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMeasurementQueue,
  saveRomSession,
  getPatients,
  deletePatient,
} from "../lib/romData";
import type { Side, Patient } from "../lib/romData";
import { PatientSelector } from "../components/PatientSelector";
import { PainAssessment } from "../components/PainAssessment";
import { JointSelector } from "../components/JointSelector";
import { AppLayout } from "../components/AppLayout";
import { Settings } from "lucide-react";

type SideMode = "좌측만" | "우측만" | "양쪽";
const SIDE_MODE_MAP: Record<SideMode, Side[]> = {
  좌측만: ["좌측"],
  우측만: ["우측"],
  양쪽: ["좌측", "우측"],
};
//사용자 고른값 좌측만 -> 좌측으로 저장

export const Index: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  //상자 안 현재값 =name, 상자값 바꾸는 리모컨 = setName, 처음엔 '' 들어있음

  const [age, setAge] = useState("");
  // 나이

  const [painArea, setPainArea] = useState("");
  // 통증부위

  const [vasScore, setVasScore] = useState<number>(0);
  // 통증 점수 (0점~10점 사이 점수)

  const [patientId, setPatientId] = useState<string | undefined>(undefined);
  // 환자마다 부여되는 고유 번호 (기존 환자일 때만 있음)

  const [sideMode, setSideMode] = useState<SideMode>("좌측만");
  // 어느 쪽을 잴 건지 고르는 스위치 (왼쪽/오른쪽/양쪽)

  const [selectedJointIds, setSelectedJointIds] = useState<string[]>([]);
  // 화면에서 체크(선택)한 관절들이 담기는 바구니

  const [isManaging, setIsManaging] = useState(false);
  // 현재 '관자 목록 관리(삭제 등)' 중인지 알려주는 상태

  const [patients, setPatients] = useState(getPatients());
  // 내 컴퓨터(local)에 저장되어있는 환자 목록들 싹 다 불러오기

  const sides = SIDE_MODE_MAP[sideMode];
  // 고른 방향(좌/우/양쪽)에 따라 실제로 측정할 쪽을 결정

  const totalSteps = getMeasurementQueue({
    patientId: "",
    patientName: "",
    patientAge: 0,
    selectedJointIds,
    selectedSides: sides,
    measurements: {},
    createdAt: "",
  } as any).length;
  //totalSteps: 측정해야 할 총 단계 수

  const handleSelectPatient = (p: Patient) => {
    setPatientId(p.id);
    setName(p.name);
    setAge(p.age.toString());
    setPainArea(p.painArea || "");
    setVasScore(p.vasScore || 0);
  };
  //환자를 선택하면 → 그 환자의 정보를 state에 넣어서 화면에 자동으로 채움

  const handleNewPatient = () => {
    setPatientId(undefined);
    setName("");
    setAge("");
    setPainArea("");
    setVasScore(0);
    setIsManaging(false);
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
    const queue = getMeasurementQueue({
      selectedJointIds,
      selectedSides: sides,
    } as any);
    navigate(`/measure?joint=${queue[0].jointId}&side=${queue[0].side}`);
  };
  ////////////////////////////////////////////////////////
  //밑으로는 보여주는 부분

  return (
    <AppLayout patientId={patientId}>
      <div className="bg-full-viewport page-bg-home">
        <div className="container pb-10">
          <div className="page-header">
            {/* 세팅 페이지로 가는 버튼 */}
            {/* <button
            onClick={() => navigate("/cesinfo")}
            className="btn-settings-top mr-12"
            style={{ marginRight: "40px" }}
          >
            📚
          </button> */}
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
            />

            <form onSubmit={handleSubmit}>
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
                >
                  측정 시작하기 ({totalSteps}단계)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
