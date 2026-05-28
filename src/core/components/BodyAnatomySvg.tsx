// BodyAnatomySvg.tsx — flutter_body_atlas 패키지를 로드하는 iframe (PRD 4-0: 200줄 이하)
import React, { useEffect, useRef, useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
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
  const iframeLoadedRef = useRef<boolean>(false);
  // 첫 비어있지 않은 highlightIds 가 Flutter 로 전송되기 전까지 true → 스피너 노출
  const [isReady, setIsReady] = useState<boolean>(false);

  // Flutter 쪽에 데이터를 전송하는 핵심 함수
  const syncState = useCallback(
    (force = false) => {
      if (!iframeRef.current || !iframeRef.current.contentWindow) return;
      // [5번 root fix] 비어있는 highlightIds 는 보내지 않음.
      // 첫 mount 시 부모가 아직 prop 을 계산하지 않은 상태로 빈 배열을
      // postMessage 해버리면 Flutter 가 빈 색칠을 적용하고 idle 해진다.
      if (highlightIds.length === 0) return;
      // iframe 자체가 load 되기 전이면 onLoad 핸들러가 다시 호출해 줄 것.
      if (!iframeLoadedRef.current) return;

      const color = cesPhase ? PHASE_META[cesPhase].color : "#ff0000";
      const muscles = highlightIds.join(",");
      const msgStr = `${muscles}|${color}`;
      dbg("sync", { muscles, color, force });

      if (!force && lastMsgRef.current === msgStr) return;

      iframeRef.current.contentWindow.postMessage({ muscles, color }, "*");
      lastMsgRef.current = msgStr;
      setIsReady(true);
    },
    [highlightIds, cesPhase],
  );

  // Prop 변경 시 즉각 반영 + Flutter 엔진이 늦게 켜지는 케이스 보강 폴링.
  // prod 빌드에서 Flutter atlas 부팅이 3초보다 길어 첫 postMessage 가 listener
  // 부착 전에 도착해 색칠이 비어보이는 회귀가 있었음 → 폴링 30회 × 500ms = 15초.
  useEffect(() => {
    syncState();
    let count = 0;
    const interval = setInterval(() => {
      syncState(true);
      count++;
      if (count > 30) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, [syncState]);

  const handleIframeLoad = () => {
    iframeLoadedRef.current = true;
    syncState(true);
  };

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
          opacity: isReady ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
        title="Flutter Body Atlas"
        onLoad={handleIframeLoad}
      />
      {!isReady && (
        <div
          aria-label="신체 도해 로딩 중"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            color: "var(--color-muted-foreground)",
            background: "transparent",
            pointerEvents: "none",
          }}
        >
          <Loader2
            className="size-6 animate-spin"
            style={{ color: "var(--color-accent)" }}
          />
          <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>
            신체 도해 준비 중…
          </span>
        </div>
      )}
    </div>
  );
};
