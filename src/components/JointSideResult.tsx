import React from "react";
import { JOINTS, calculateSeverity } from "../lib/romData";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { RomSession, Side } from "../lib/romData";
import { SEVERITY_COLORS } from "../lib/severityMeta";
import { SeverityBadge } from "./SeverityBadge";

interface JointSideResultProps {
  session: RomSession;
  jointId: string;
  side: Side;
  firstSession?: RomSession;
  /** 카드 좌측 강조 보더 색상 — 지정 시 4px 세로 스트립이 카드에 직접 붙음 */
  emphasisColor?: string;
}

export const JointSideResult: React.FC<JointSideResultProps> = ({
  session,
  jointId,
  side,
  firstSession,
  emphasisColor,
}) => {
  const joint = JOINTS.find((j) => j.id === jointId);
  if (!joint) return null;

  const sideMeasurements = session.measurements?.[jointId]?.[side] ?? {};
  const firstSideMeasurements =
    firstSession?.measurements?.[jointId]?.[side] ?? {};

  const results = joint.movements.map((m) => {
    const measured = sideMeasurements[m.id] ?? 0;
    const firstMeasured = firstSideMeasurements[m.id];
    const diff = firstMeasured !== undefined ? measured - firstMeasured : null;

    return {
      ...m,
      measured,
      severity: m.isQualitative
        ? measured === 1
          ? "심각한제한"
          : "정상"
        : calculateSeverity(measured, m.normalRange),
      diff,
    };
  });
  const hasLimitation = results.some((r) => r.severity !== "정상");

  // [audit #37] severity 색상은 lib/severityMeta.ts 단일 진실원에서 가져온다.
  // 이전엔 중등도제한이 var(--warning) (앰버) 으로 경도와 같은 톤이었으나,
  // SEVERITY_COLORS 통일로 #FB923C (오렌지) 로 명확히 분리된다.
  const severityBgColor = (s: string) =>
    SEVERITY_COLORS[s as keyof typeof SEVERITY_COLORS] ?? "#9CA3AF";

  // 강조 색상은 var(--danger) 또는 var(--warning) 가 들어옴 — 실제 픽스드 값으로 매핑
  // (CSS var + alpha 조합은 인라인 style에서 동작하지 않아 직접 rgba 사용)
  const emphasisTint =
    emphasisColor === "var(--danger)"
      ? "rgba(239, 68, 68, 0.05)"
      : emphasisColor === "var(--warning)"
        ? "rgba(245, 158, 11, 0.06)"
        : undefined;

  return (
    <div
      className="panel"
      style={{
        marginBottom: "1rem",
        // 강조 카드는 전체 카드에 아주 연한 tinted 배경 — 스트립/보더 없이도 눈에 들어옴
        ...(emphasisTint
          ? {
              background: emphasisTint,
            }
          : {}),
      }}
    >
      <div className="panel-header">
        <h3>
          {joint.name}
          {joint.isSymmetric ? "" : ` — ${side}`}
        </h3>
        <span
          className={`badge flex items-center gap-1 ${hasLimitation ? "badge-warning" : "badge-success"}`}
        >
          {hasLimitation ? <><AlertTriangle size={14} /> 제한 있음</> : <><CheckCircle size={14} /> 정상</>}
        </span>
      </div>
      {results.map((res) => (
        <div
          key={res.id}
          className="file-item"
          style={{
            cursor: "default",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            padding: "1.25rem",
            background: "var(--surface)",
            boxShadow: "var(--neumo-shadow-small)",
            borderRadius: "var(--radius-md)",
            marginBottom: "1rem",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          {/* 좌측: 이름 및 뱃지 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              flexShrink: 0,
              width: "130px",
            }}
          >
            <p
              className="file-name"
              style={{
                fontWeight: 800,
                fontSize: "var(--text-sm)",
                color: "var(--text-primary)",
                wordBreak: "keep-all",
              }}
            >
              {res.name}
            </p>
            <div>
              <SeverityBadge severity={res.severity} variant="fill" />
            </div>
          </div>

          {/* 우측: 리니어 프로그레스 바 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              paddingRight: "0.5rem",
            }}
          >
            {res.isQualitative ? (
              <div
                className="flex items-center gap-1"
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 800,
                  color: severityBgColor(res.severity),
                }}
              >
                {res.measured === 1
                  ? <><AlertTriangle size={16} /> 특이사항 (문제 발견됨)</>
                  : <><CheckCircle size={16} /> 정상 범위</>}
              </div>
            ) : (
              <>
                {/* 라벨/수치 영역 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                  }}
                >
                  <span>0°</span>
                  <span>정상: {res.normalRange}°</span>
                </div>

                {/* 트랙 & 바 */}
                <div
                  style={{
                    position: "relative",
                    height: "10px",
                    background: "var(--border-color)",
                    borderRadius: "var(--radius-pill)",
                    margin: "24px 16px 4px 16px", // 팝오버가 글씨를 가리지 않도록 상/하/좌/우 여백 추가
                  }}
                >
                  {(() => {
                    const ratio =
                      res.normalRange === 0
                        ? res.measured >= -5
                          ? 1
                          : 0
                        : Math.min(
                            Math.max(res.measured / res.normalRange, 0),
                            1,
                          );
                    const percent = ratio * 100;
                    const barColor = severityBgColor(res.severity);
                    return (
                      <>
                        {/* 채워진 색상 바 */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: `${percent}%`,
                            background: barColor,
                            borderRadius: "var(--radius-pill)",
                            transition: "width 1s ease-out",
                          }}
                        />

                        {/* 측정값 마커 */}
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: `${percent}%`,
                            transform: "translate(-50%, -50%)",
                            width: "18px",
                            height: "18px",
                            background: "#fff",
                            border: `4px solid ${barColor}`,
                            borderRadius: "var(--radius-circle)",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          {/* 상단 팝오버 텍스트 */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "calc(100% + 6px)",
                              left: "50%",
                              transform: "translateX(-50%)",
                              fontWeight: 900,
                              fontSize: "var(--text-sm)",
                              color: barColor,
                              background: "rgba(255,255,255,0.9)",
                              padding: "2px 6px",
                              borderRadius: "var(--radius-xs)",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {res.measured}°
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* 정상 대비 보조 라인 — 바 시각만으로는 정량 파악이 어려워 한 줄 추가 */}
                {(() => {
                  if (res.severity === "정상") {
                    return (
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: 700,
                          color: "var(--success)",
                          textAlign: "center",
                          marginTop: "0.4rem",
                        }}
                      >
                        정상 범위 도달
                      </div>
                    );
                  }
                  if (res.normalRange === 0) return null;
                  const measuredClamped = Math.max(0, res.measured);
                  const percent = Math.floor(
                    (measuredClamped / res.normalRange) * 100,
                  );
                  const remaining = res.normalRange - measuredClamped;
                  return (
                    <div
                      style={{
                        fontSize: "var(--text-xs)",
                        fontWeight: 700,
                        color: "var(--text-secondary)",
                        textAlign: "center",
                        marginTop: "0.4rem",
                      }}
                    >
                      정상의 {percent}% · {remaining}° 더 필요
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
