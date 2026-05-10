// Trends.tsx — 측정 기록 페이지 (대시보드 / 상세 차트 / 평가 히스토리).
// audit #13: ViewSegment / ChartsView 분리. 본체는 라우팅+orchestrator.
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPatientHistory, saveRomSession } from "../lib/romData";
import { NeumoDashboard } from "../features/trends/presentation/NeumoDashboard";
import { HistoryItem } from "../features/trends/presentation/HistoryItem";
import { AppLayout } from "../core/components/AppLayout";
import { ViewSegment, type TrendsViewMode } from "./trends/ViewSegment";
import { ChartsView } from "./trends/ChartsView";
import "../styles/Trends.css";

export const Trends: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const [viewMode, setViewMode] = useState<TrendsViewMode>("charts");
  const showCharts = viewMode === "charts";

  const history = patientId ? getPatientHistory(patientId) : [];
  const reversedHistory = [...history].reverse(); // 오래된 순

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    history.length > 0 ? history[0].createdAt : null,
  );

  // 트렌드 페이지에서 고른 회차를 active `rom_session` 으로 동기화한다.
  // - 네비의 "CES" 탭이나 어디에서 CES 재활을 시작해도, 지금 보고 있는 회차에
  //   시간이 누적되도록 보장한다.
  // - 화면이 처음 열릴 때(= selectedSessionId 가 최신) 도 최신 세션으로 동기화되므로
  //   "최신 회차 = 기본 선택" 케이스도 일관되게 처리된다.
  useEffect(() => {
    if (!selectedSessionId) return;
    const picked = history.find((s) => s.createdAt === selectedSessionId);
    if (picked) {
      saveRomSession(picked);
    }
  }, [selectedSessionId, history]);

  if (!patientId || history.length === 0) {
    return (
      <AppLayout patientId={patientId ?? undefined}>
        <div className="container p-8 text-center neumo-inset">
          <h2>환자 데이터를 찾을 수 없습니다.</h2>
          <button
            className="btn btn-primary mt-4"
            onClick={() => navigate("/")}
          >
            메인으로
          </button>
        </div>
      </AppLayout>
    );
  }

  const patient = history[0];

  return (
    <AppLayout patientId={patientId}>
      <div
        className="bg-full-viewport page-bg-results pb-20 neumo-container"
        style={{
          minHeight: "100vh",
          padding: "0 20px 80px",
          overflow: "visible",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            overflow: "visible",
          }}
        >
          <div
            className="page-header"
            style={{
              paddingTop: "20px",
              marginBottom: "20px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <button
                className="btn btn-outline btn-small btn-back-text mb-3"
                onClick={() => navigate(-1)}
              >
                ← 뒤로가기
              </button>
              <h1
                className="text-3xl font-black tracking-tighter opacity-90"
                style={{ fontSize: "var(--text-2xl)", marginBottom: "4px" }}
              >
                측정 기록
              </h1>
              <p className="opacity-70 text-base font-bold">
                {patient.patientName} ({patient.patientAge}세)
              </p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <ViewSegment value={viewMode} onChange={setViewMode} />
            </div>
          </div>

          {!showCharts ? (
            <div
              className="neumo-card mb-6"
              style={{ borderRadius: "var(--radius-lg)", padding: "16px" }}
            >
              <NeumoDashboard
                sessions={history}
                selectedSessionId={selectedSessionId}
                onSelectSession={(id) => setSelectedSessionId(id || null)}
              />
            </div>
          ) : (
            <ChartsView reversedHistory={reversedHistory} />
          )}

          <div
            className="panel neumo-inset"
            style={{
              borderRadius: "var(--radius-lg)",
              marginTop: "24px",
              padding: "24px 16px",
              overflow: "visible",
            }}
          >
            <h3
              className="text-xl font-black opacity-85"
              style={{ marginBottom: "20px", paddingLeft: "8px" }}
            >
              평가 히스토리 ({history.length}건)
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {history.map((s, i) => (
                <HistoryItem
                  key={s.createdAt}
                  session={s}
                  index={i}
                  total={history.length}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
