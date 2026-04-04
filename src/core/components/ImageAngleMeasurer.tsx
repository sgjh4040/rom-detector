import React from "react";
import { useAngleMeasurer } from "./useAngleMeasurer";
import { RotateCcw, Pointer, CheckCircle, Camera } from "lucide-react";

// [PRD 4-3] 매직 스트링 금지
const STEP_GUIDE = [
  "① 팔 끝점 A 클릭",
  "② 관절 중심 클릭",
  "③ 팔 끝점 B 클릭",
] as const;

interface Props {
  /** 각도 확정 시 호출 — 측정값을 입력란에 자동 반영 */
  onAngleConfirmed: (angle: number) => void;
}

export const ImageAngleMeasurer: React.FC<Props> = ({ onAngleConfirmed }) => {
  const {
    canvasRef,
    imageDataUrl,
    points,
    calculatedAngle,
    isInverted,
    handleFileUpload,
    handleCanvasClick,
    resetPoints,
    toggleInversion,
  } = useAngleMeasurer();

  return (
    <div
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: "20px",
        padding: "1.25rem",
        marginTop: "1rem",
        background: "var(--bg)",
        boxShadow: "var(--shadow-raised-sm)",
      }}
    >
      {/* 상단 버튼 */}
      <div className="flex gap-3 mb-4">
        <label
          className="btn btn-outline"
          style={{
            flex: 1,
            textAlign: "center",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Camera size={14} className="inline mr-1" /> 사진 불러오기
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </label>
        {imageDataUrl && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={resetPoints}
            style={{ flex: 0, minWidth: "80px" }}
          >
            <RotateCcw size={14} /> 다시
          </button>
        )}
      </div>

      {imageDataUrl ? (
        <>
          {/* 단계 안내 */}
          <div
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              backgroundColor: "var(--bg)",
              borderRadius: "15px",
              boxShadow: "var(--shadow-pressed)",
            }}
          >
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "var(--primary)",
              }}
            >
              {points.length < 3
                ? <><Pointer size={16} className="inline mr-1" /> {STEP_GUIDE[points.length]}</>
                : <><CheckCircle size={16} className="inline mr-1" /> 측정 완료!</>}
            </p>
            <div className="flex gap-2">
              {STEP_GUIDE.map((_, i) => (
                <span
                  key={i}
                  className={`badge ${i < points.length ? "badge-success" : "badge-outline"}`}
                  style={{
                    flex: 1,
                    fontSize: "0.7rem",
                    textAlign: "center",
                    padding: "0.4rem",
                  }}
                >
                  {i < points.length ? "✓" : `${i + 1}`}
                </span>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div
            style={{
              position: "relative",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "var(--shadow-raised-sm)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{
                width: "100%",
                display: "block",
                cursor: points.length < 3 ? "crosshair" : "default",
              }}
            />
          </div>

          {/* 각도 결과 & 사용 버튼 */}
          {calculatedAngle !== null && (
            <div
              style={{
                marginTop: "1.25rem",
                padding: "1.25rem",
                backgroundColor: "var(--bg)",
                borderRadius: "15px",
                textAlign: "center",
                boxShadow: "var(--shadow-raised)",
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
                >
                  측정된 각도
                </span>
                <button
                  type="button"
                  className={`btn ${isInverted ? "btn-primary" : "btn-outline"}`}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.75rem",
                    height: "auto",
                  }}
                  onClick={toggleInversion}
                >
                  <RotateCcw size={14} /> 호 반전 {isInverted ? "(외각)" : "(내각)"}
                </button>
              </div>
              <p
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "var(--primary)",
                  lineHeight: 1,
                  marginBottom: "1rem",
                }}
              >
                {calculatedAngle}°
              </p>
              <button
                type="button"
                className="btn btn-primary btn-large w-full"
                onClick={() => onAngleConfirmed(calculatedAngle)}
              >
                이 측정값 저장하기
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            padding: "1.5rem",
            textAlign: "center",
            border: "2px dashed var(--border-color)",
            borderRadius: "8px",
            color: "var(--text-secondary)",
          }}
        >
          <p className="flex justify-center" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}><Camera size={32} /></p>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
            사진을 불러오면 3점을 클릭해서
            <br />
            관절 각도를 직접 측정할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
};
