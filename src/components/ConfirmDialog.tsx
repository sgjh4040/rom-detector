// ConfirmDialog.tsx — 디자인 시스템 톤의 확인 다이얼로그 (audit #24)
//
// native window.confirm() 대신 사용. Portal 로 body 직속에 렌더하여 z-index 충돌
// 회피하고, ESC 키 / backdrop 클릭으로 취소 가능. variant='danger' 일 때 확정
// 버튼이 빨간 톤으로 파괴적 액션임을 시각으로 명시.
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  /** 확정 버튼 라벨 (기본 "확인") */
  confirmLabel?: string;
  /** 취소 버튼 라벨 (기본 "취소") */
  cancelLabel?: string;
  /** danger: 빨간 확정 버튼 (전체 삭제 등 파괴적 액션) */
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  variant = "default",
  onConfirm,
  onCancel,
}) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // 열릴 때 확정 버튼에 포커스 (Enter 로 즉시 확정 가능 + 스크린리더 인지)
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => confirmBtnRef.current?.focus(), 50);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  // ESC 로 취소
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const isDanger = variant === "danger";
  const confirmBg = isDanger ? "var(--danger)" : "var(--primary)";
  const confirmHover = isDanger ? "#dc2626" : "#4a5cb0";

  return createPortal(
    <div
      role="presentation"
      onClick={(e) => {
        // backdrop 클릭 시 취소 (모달 카드 안 클릭은 그대로)
        if (e.target === e.currentTarget) onCancel();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.25rem",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          borderRadius: "var(--radius-lg)",
          padding: "1.5rem 1.25rem 1.25rem",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.18)",
        }}
      >
        <h2
          id="confirm-dialog-title"
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: 900,
            color: "var(--text-primary)",
            marginBottom: description ? "0.5rem" : "1.25rem",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
        {description && (
          <div
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              fontWeight: 500,
              lineHeight: 1.55,
              marginBottom: "1.25rem",
              whiteSpace: "pre-line",
            }}
          >
            {description}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              minHeight: "44px",
              padding: "0.6rem 1.25rem",
              background: "rgba(0, 0, 0, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.08)",
              borderRadius: "var(--radius-xs)",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "var(--text-sm)",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            style={{
              minHeight: "44px",
              padding: "0.6rem 1.5rem",
              background: confirmBg,
              border: "none",
              borderRadius: "var(--radius-xs)",
              color: "#fff",
              fontWeight: 800,
              fontSize: "var(--text-sm)",
              cursor: "pointer",
              transition: "background 0.15s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = confirmHover;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = confirmBg;
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
