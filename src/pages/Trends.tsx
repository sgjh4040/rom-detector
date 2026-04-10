import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import { getPatientHistory, JOINTS } from "../lib/romData";
import { TrendGraph } from "../features/trends/presentation/TrendGraph";
import { NeumoDashboard } from "../features/trends/presentation/NeumoDashboard";
import { JointTrendCard } from "../features/trends/presentation/JointTrendCard";
import { HistoryItem } from "../features/trends/presentation/HistoryItem";
import { AppLayout } from "../components/AppLayout";
import "../styles/Trends.css";

/** 상단 뷰 모드 세그먼트 컨트롤 (대시보드 / 상세 차트) */
interface ViewSegmentProps {
  value: "dashboard" | "charts";
  onChange: (value: "dashboard" | "charts") => void;
}

const ViewSegment: React.FC<ViewSegmentProps> = ({ value, onChange }) => {
  const items: Array<{
    key: "dashboard" | "charts";
    label: string;
    icon: React.ReactNode;
  }> = [
    { key: "dashboard", label: "대시보드", icon: <LayoutDashboard size={15} /> },
    { key: "charts", label: "상세 차트", icon: <BarChart3 size={15} /> },
  ];
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        padding: "4px",
        background: "rgba(0, 0, 0, 0.05)",
        borderRadius: "999px",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        gap: "2px",
      }}
    >
      {items.map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 800,
              color: active ? "#ffffff" : "var(--text-secondary)",
              background: active
                ? "linear-gradient(135deg, #5C6BC0, #7986CB)"
                : "transparent",
              boxShadow: active ? "0 4px 14px rgba(92, 107, 192, 0.3)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const Trends: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");
  const [viewMode, setViewMode] = useState<"dashboard" | "charts">("dashboard");
  const showCharts = viewMode === "charts";

  const history = patientId ? getPatientHistory(patientId) : [];
  const reversedHistory = [...history].reverse(); // 오래된 순

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    history.length > 0 ? history[0].createdAt : null,
  );

  if (!patientId || history.length === 0) {
    return (
      <AppLayout patientId={patientId ?? undefined}>
        <div className="container p-8 text-center neumo-inset">
          <h2>환자 데이터를 찾을 수 없습니다.</h2>
          <button className="btn btn-primary mt-4" onClick={() => navigate("/")}>
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
              className="btn btn-outline btn-small mb-3"
              onClick={() => navigate(-1)}
              style={{
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.8rem",
              }}
            >
              ← 뒤로가기
            </button>
            <h1
              className="text-3xl font-black tracking-tighter opacity-90"
              style={{ fontSize: "1.75rem", marginBottom: "4px" }}
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
            style={{ borderRadius: "24px", padding: "16px" }}
          >
            <NeumoDashboard
              sessions={history}
              selectedSessionId={selectedSessionId}
              onSelectSession={(id) => setSelectedSessionId(id || null)}
            />
          </div>
        ) : (
          <div
            className="space-y-12 mb-16"
            style={{ display: "flex", flexDirection: "column", gap: "40px" }}
          >
            <div
              className="card neumo-card"
              style={{ padding: "40px", borderRadius: "40px" }}
            >
              <h3 className="mb-8 text-2xl font-black">통증 지수 (VAS) 변화</h3>
              <TrendGraph
                data={reversedHistory.map((s) => ({
                  label: `${reversedHistory.indexOf(s) + 1}회`,
                  value: s.vasScore || 0,
                }))}
                normalRange={10}
                unit=""
              />
            </div>

            {JOINTS.map((joint) => (
              <JointTrendCard
                key={joint.id}
                joint={joint}
                history={reversedHistory}
              />
            ))}
          </div>
        )}

        <div
          className="panel neumo-inset"
          style={{
            borderRadius: "24px",
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
