// BodyAnatomySvg.tsx — flutter_body_atlas 패키지를 로드하는 iframe (PRD 4-0: 200줄 이하)
import React, { useEffect, useRef, useCallback } from "react";
import type { CesPhase } from "../../lib/ces/CesPlayerTypes";
import { PHASE_META } from "../../lib/ces/CesPlayerTypes";

interface BodyAnatomySvgProps {
  highlightIds?: string[];
  cesPhase?: CesPhase;
  showGroupButtons?: boolean;
}

export const BodyAnatomySvg: React.FC<BodyAnatomySvgProps> = ({
  highlightIds = [],
  cesPhase,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastMsgRef = useRef<string>("");
  console.log("최종 highlightIds:", highlightIds);
  // Flutter 쪽에 데이터를 전송하는 핵심 함수
  const syncState = useCallback(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;

    console.log("PHASE_META:", PHASE_META);
    const color = cesPhase ? PHASE_META[cesPhase].color : "#ff0000";
    console.log("color:", color);
    const muscles = highlightIds.join(",");
    console.log("muscles:", muscles);
    const msgStr = `${muscles}|${color}`;
    console.log("msgStr1:", msgStr);
    // 이전 메시지와 동일하면 중복 전송하지 않음 (네트워크 오버헤드 방지)
    if (lastMsgRef.current === msgStr) return;

    // Flutter 쪽에 데이터를 전송
    iframeRef.current.contentWindow.postMessage({ muscles, color }, "*");
    lastMsgRef.current = msgStr;
    console.log("msgStr2:", msgStr);
  }, [highlightIds, cesPhase]);

  // Prop 변경 시 즉각 반영
  useEffect(() => {
    syncState();
  }, [syncState]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <iframe
        ref={iframeRef}
        src={`${import.meta.env.BASE_URL}flutter_atlas/index.html`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "transparent",
        }}
        title="Flutter Body Atlas"
        onLoad={syncState} // 로딩 완료 시점에 첫 데이터 동기화
      />
    </div>
  );
};
