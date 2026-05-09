// SessionChipRow.tsx — 회차 선택 가로 스크롤 칩 행 (audit #13).
// 회차 수가 많아도 안전하도록 가로 스크롤. 각 칩은 N회차 + 날짜 표기.
import React from "react";
import type { RomSession } from "../../../../lib/romTypes";

interface SessionChipRowProps {
  sessions: RomSession[];
  selectedSessionId: string | null;
  onSelectSession: (id: string) => void;
}

export const SessionChipRow: React.FC<SessionChipRowProps> = ({
  sessions,
  selectedSessionId,
  onSelectSession,
}) => {
  return (
    <div
      className="w-full no-scrollbar session-chip-row"
      style={{
        overflowX: "auto",
        paddingBottom: "8px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "flex-start",
          alignItems: "center",
          minWidth: "max-content",
          padding: "4px 0",
        }}
      >
        {sessions.map((s, i) => {
          const isActive = selectedSessionId === s.createdAt;
          return (
            <button
              key={s.createdAt}
              type="button"
              className="session-chip"
              onClick={() => onSelectSession(s.createdAt)}
              style={{
                padding: "8px 14px",
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                whiteSpace: "nowrap",
                flexShrink: 0,
                borderRadius: "var(--radius-pill)",
                border: isActive
                  ? "1px solid var(--primary)"
                  : "1px solid rgba(0, 0, 0, 0.08)",
                background: isActive
                  ? "var(--primary)"
                  : "rgba(255, 255, 255, 0.7)",
                color: isActive ? "#ffffff" : "var(--text-secondary)",
                boxShadow: isActive
                  ? "0 4px 12px rgba(92, 107, 192, 0.25)"
                  : "0 1px 2px rgba(0, 0, 0, 0.03)",
                cursor: "pointer",
                transition:
                  "background 0.18s, color 0.18s, box-shadow 0.18s, border-color 0.18s",
                fontFamily: "inherit",
              }}
            >
              {sessions.length - i}회차 (
              {new Date(s.createdAt).toLocaleDateString().slice(5).replace(/\.$/, "")}
              )
            </button>
          );
        })}
      </div>
    </div>
  );
};
