// BodyAnatomySvg.tsx — flutter_body_atlas 패키지를 로드하는 iframe (PRD 4-0: 200줄 이하)
import React, { useEffect, useRef, useCallback } from "react";
import type { CesPhase } from "../../lib/ces/CesPlayerTypes";
import { PHASE_META } from "../../lib/ces/CesPlayerTypes";

interface BodyAnatomySvgProps {
  highlightIds?: string[];
  cesPhase?: CesPhase;
  showGroupButtons?: boolean;
}

/**
 * [audit #19] 근육 색칠 정확도 디버깅용 로그 헬퍼.
 * import.meta.env.DEV 가드로 dev 서버에서만 출력하고 프로덕션 번들에서는 제거된다.
 * 새로운 진단 로그가 필요하면 여기에 dbg(...) 호출을 추가하면 prefix 가 자동 적용된다.
 */
const dbg = (...args: unknown[]): void => {
  if (import.meta.env.DEV) {
    console.log("[BodyAnatomy]", ...args);
  }
};

export const BodyAnatomySvg: React.FC<BodyAnatomySvgProps> = ({
  highlightIds = [],
  cesPhase,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastMsgRef = useRef<string>("");
  dbg("최종 highlightIds:", highlightIds);
  // Flutter 쪽에 데이터를 전송하는 핵심 함수
  const syncState = useCallback(
    (force = false) => {
      if (!iframeRef.current || !iframeRef.current.contentWindow) return;

      dbg("PHASE_META:", PHASE_META);
      const color = cesPhase ? PHASE_META[cesPhase].color : "#ff0000";
      dbg("color:", color);
      const muscles = highlightIds.join(",");
      dbg("muscles:", muscles);
      const msgStr = `${muscles}|${color}`;
      dbg("msgStr1:", msgStr);

      // 이전 메시지와 동일하면 중복 전송하지 않음 (단, force가 true면 무조건 전송)
      if (!force && lastMsgRef.current === msgStr) return;

      // Flutter 쪽에 데이터를 전송
      iframeRef.current.contentWindow.postMessage({ muscles, color }, "*");
      lastMsgRef.current = msgStr;
      dbg("msgStr2:", msgStr);
    },
    [highlightIds, cesPhase],
  );

  // Prop 변경 시 즉각 반영 및 로드 대기(Flutter 엔진 부팅 시간 보완)
  useEffect(() => {
    syncState(); // 즉시 1회 시도

    // Flutter 엔진이 비동기로 늦게 켜지는 문제를 방지하기 위해 
    // 처음 3초간 0.5초 간격으로 계속 `postMessage` 전송을 보장합니다.
    let count = 0;
    const interval = setInterval(() => {
      syncState(true); // 강제 전송
      count++;
      if (count > 6) clearInterval(interval); // 6회(3초) 이후 중단
    }, 500);

    return () => clearInterval(interval);
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
        onLoad={() => syncState(true)} // 로딩 완료 시점에 첫 데이터 동기화 강제
      />
    </div>
  );
};
