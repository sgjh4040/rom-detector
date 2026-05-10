// ViewSegment.tsx — 대시보드/상세 차트 뷰 모드 세그먼트 컨트롤 (audit #13).
import React from "react";
import { LayoutDashboard, BarChart3 } from "lucide-react";

export type TrendsViewMode = "dashboard" | "charts";

interface ViewSegmentProps {
  value: TrendsViewMode;
  onChange: (value: TrendsViewMode) => void;
}

export const ViewSegment: React.FC<ViewSegmentProps> = ({ value, onChange }) => {
  const items: Array<{
    key: TrendsViewMode;
    label: string;
    icon: React.ReactNode;
  }> = [
    { key: "charts", label: "상세 차트", icon: <BarChart3 size={15} /> },
    {
      key: "dashboard",
      label: "대시보드",
      icon: <LayoutDashboard size={15} />,
    },
  ];
  return (
    <div
      role="tablist"
      style={{
        display: "inline-flex",
        padding: "4px",
        background: "rgba(0, 0, 0, 0.05)",
        borderRadius: "var(--radius-pill)",
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
              borderRadius: "var(--radius-pill)",
              border: "none",
              cursor: "pointer",
              fontSize: "var(--text-sm)",
              fontWeight: 800,
              color: active ? "#ffffff" : "var(--text-secondary)",
              background: active ? "var(--primary-gradient)" : "transparent",
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
