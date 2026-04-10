// Settings.tsx — 앱 설정 및 오픈소스 라이선스 화면 (PRD 4-0: 200줄 이하)
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { loadRomSession } from "../lib/romTypes";

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const session = loadRomSession();

  return (
    <AppLayout patientId={session?.patientId}>
      <div className="bg-full-viewport page-bg-settings">
        <div className="container">
          {/* 상단 헤더 */}
          <div className="settings-header">
            <button onClick={() => navigate("/")} className="btn-back">
              ←
            </button>
            <h1>설정 (Settings)</h1>
          </div>

        {/* 오픈소스 라이선스 섹션 */}
        <div className="card settings-card">
          <h2>오픈소스 라이선스</h2>
          <div className="license-info">
            <h3>Human Body Atlas SVGs</h3>
            <p>
              This app uses anatomical SVG graphics provided by
              flutter_body_atlas.
            </p>
            <p>
              <strong>License:</strong> CC BY 4.0
            </p>
            <p>
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                License Link
              </a>
            </p>
            <div className="license-note">
              원본 그래픽은 본 웹 앱의 동적 색상 하이라이트 기능에 맞게
              재조정되었습니다.
            </div>
          </div>
        </div>

          {/* 앱 정보 섹션 */}
          <div
            style={{
              textAlign: "center",
              marginTop: "3rem",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
            }}
          >
            <p>ROM 측정기 및 CES 재활 루틴 앱</p>
            <p>버전 1.0.0</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
