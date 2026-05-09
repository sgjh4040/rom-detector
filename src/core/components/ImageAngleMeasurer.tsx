// ImageAngleMeasurer.tsx — 사진 위 3점 클릭으로 관절 각도 측정 (PRD §9-2).
// audit #13: 단계 안내(Steps) + 결과(Result) 분리. 본체는 Canvas + 빈 상태만.
import React from "react";
import { useAngleMeasurer } from "./useAngleMeasurer";
import { RotateCcw, Camera } from "lucide-react";
import { Steps } from "./imageAngleMeasurer/Steps";
import { Result } from "./imageAngleMeasurer/Result";

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
        borderRadius: "var(--radius-md)",
        padding: "1.25rem",
        marginTop: "1rem",
        background: "var(--bg)",
        boxShadow: "var(--shadow-raised-sm)",
      }}
    >
      {/* 상단 버튼 — 사진 불러오기 + 다시 */}
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
          <Steps pointCount={points.length} />

          {/* Canvas */}
          <div
            style={{
              position: "relative",
              borderRadius: "var(--radius-md)",
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

          {calculatedAngle !== null && (
            <Result
              angle={calculatedAngle}
              isInverted={isInverted}
              onToggleInversion={toggleInversion}
              onSave={() => onAngleConfirmed(calculatedAngle)}
            />
          )}
        </>
      ) : (
        <div
          style={{
            padding: "1.5rem",
            textAlign: "center",
            border: "2px dashed var(--border-color)",
            borderRadius: "var(--radius-xs)",
            color: "var(--text-secondary)",
          }}
        >
          <p
            className="flex justify-center"
            style={{ fontSize: "var(--text-2xl)", marginBottom: "0.5rem" }}
          >
            <Camera size={32} />
          </p>
          <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.5 }}>
            사진을 불러오면 3점을 클릭해서
            <br />
            관절 각도를 직접 측정할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
};
