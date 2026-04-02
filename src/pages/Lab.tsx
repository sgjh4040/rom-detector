import React from "react";
import { useNavigate } from "react-router-dom";
import { RomGauge } from "../components/RomGauge";
import { JointSideResult } from "../components/JointSideResult";
import type { RomSession } from "../lib/romTypes";

const mockShoulderSession: RomSession = {
  patientId: "p_test",
  patientName: "테스트 환자",
  patientAge: 35,
  selectedJointIds: ["shoulder"],
  selectedSides: ["좌측"],
  measurements: {
    shoulder: {
      좌측: {
        flexion: 155, // 정상(85% 이상)
        extension: 40, // 경도제한(66%)
        abduction: 100, // 중등도제한(55%)
        internal_rotation: 30, // 심각한제한(42%)
      },
    },
  },
  createdAt: "",
};

export const Lab: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-full-viewport page-bg-home" style={{ padding: "2rem" }}>
      <div className="container">
        <div className="page-header flex justify-between items-center mb-8">
          <div>
            <h1>Component Lab</h1>
            <p>개별 컴포넌트 디자인 확인 페이지</p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate("/")}>
            메인으로
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* CASE 1: 정상 (85% 이상) */}
          <div className="card">
            <h3 className="mb-4">Case 1: 정상 범위</h3>
            <RomGauge
              label="어깨 굴곡 (정상)"
              measured={160}
              normal={180}
              severity="정상"
            />
          </div>

          {/* CASE 2: 경도 제한 (65% ~ 84%) */}
          <div className="card">
            <h3 className="mb-4">Case 2: 경도 제한</h3>
            <RomGauge
              label="어깨 신전 (경도)"
              measured={40}
              normal={60}
              severity="경도제한"
            />
          </div>

          {/* CASE 3: 중등도 제한 (45% ~ 64%) */}
          <div className="card">
            <h3 className="mb-4">Case 3: 중등도 제한</h3>
            <RomGauge
              label="무릎 굴곡 (중등도)"
              measured={70}
              normal={135}
              severity="중등도제한"
            />
          </div>

          {/* CASE 4: 심각한 제한 (45% 미만) */}
          <div className="card">
            <h3 className="mb-4">Case 4: 심각한 제한</h3>
            <RomGauge
              label="고관절 외전 (심각)"
              measured={15}
              normal={45}
              severity="심각한제한"
            />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-6">🛠 JointSideResult 컴포넌트 테스트</h2>
          <p className="mb-4 text-secondary">
            이 컴포넌트는 특정 관절(예: 어깨)의 모든 동작 결과와 게이지를
            리스트로 보여줍니다.
          </p>
          <div style={{ maxWidth: "600px" }}>
            <JointSideResult
              jointId="shoulder"
              side="좌측"
              session={mockShoulderSession}
            />
          </div>
        </div>

        <div className="mt-10 p-6 bg-white/50 rounded-xl border border-dashed border-primary/30">
          <p className="text-center text-sm text-secondary">
            💡 이 페이지는 개발/검토용 임시 페이지입니다. 실구동 시에는 보이지
            않게 처리될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
