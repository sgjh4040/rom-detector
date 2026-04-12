// CesProtocol.tsx — CES 재활 프로토콜 메인 페이지 (PRD 4-0: 200줄 이하)
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { loadRomSession, JOINTS } from "../lib/romData";
import { analyzeMuscles } from "../lib/muscleAnalysis";
import { CesExercisePlayer } from "../core/components/CesExercisePlayer";
import { BodyAnatomySvg } from "../core/components/BodyAnatomySvg";
import { getExMeta, formatTime } from "../core/utils/cesProtocolHelpers";
import {
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { updatePhaseDuration } from "../features/session/data/cesTimeTracker";
import { buildRoutineFromAnalysis } from "../lib/ces/cesRoutineBuilder";
import type { CesStage } from "../lib/ces/cesTypes";
import type { CesPhase } from "../lib/ces/CesPlayerTypes";
import type { Side } from "../lib/romTypes";

const STAGES: { id: CesStage; name: string }[] = [
  { id: "inhibit", name: "INHIBIT" },
  { id: "lengthen", name: "LENGTHEN" },
  { id: "activate", name: "ACTIVATE" },
  { id: "integrate", name: "INTEGRATE" },
];

export const CesProtocol: React.FC = () => {
  const navigate = useNavigate();
  const session = loadRomSession();
  console.log("session", session);
  const [activeJointSide, setActiveJointSide] = useState("");
  const [activeStage, setActiveStage] = useState<CesStage>("inhibit");
  const [activeIndex, setActiveIndex] = useState(0);

  // ── 타이머 (▶ 시작 버튼을 눌러야 작동) ──────────────────────────
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((p) => p + 1);
        // 1초마다 실시간(latest) 및 현재 1/2회차 세션(createdAt) 양쪽 모두에 시간 기록
        updatePhaseDuration(activeStage, 1, session?.createdAt);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, activeStage]);

  const toggleTimer = useCallback(() => setTimerRunning((r) => !r), []);
  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setSeconds(0);
  }, []);

  // ── 관절-방향 목록 ────────────────────────────────────────────────
  const jointSideList = useMemo(() => {
    if (!session) return [];
    const list: { id: string; label: string; jid: string; side: Side }[] = [];

    session.selectedJointIds.forEach((jid) => {
      const joint = JOINTS.find((j) => j.id === jid);
      if (joint?.isSymmetric) {
        list.push({
          id: `${jid}-좌측`,
          label: joint.name,
          jid,
          side: "좌측",
        });
      } else {
        session.selectedSides.forEach((side) => {
          list.push({
            id: `${jid}-${side}`,
            label: `${joint?.name} — ${side}`,
            jid,
            side,
          });
        });
      }
    });
    return list;
  }, [session]);

  useEffect(() => {
    if (jointSideList.length > 0 && !activeJointSide)
      setActiveJointSide(jointSideList[0].id);
  }, [jointSideList, activeJointSide]);

  // [PRD 4-2] Early return
  if (!session) {
    navigate("/");
    return null;
  }
  if (jointSideList.length === 0)
    return <div className="container">Loading...</div>;

  const currentJS =
    jointSideList.find((js) => js.id === activeJointSide) ?? jointSideList[0];
  const analysis = analyzeMuscles(session, currentJS.jid, currentJS.side);
  const exercises = analysis[activeStage];
  const currentEx = exercises[activeIndex] || exercises[0];

  // 운동 이름에서 매칭 가능한 한국어 근육 키워드를 뽑아냅니다.
  const getTargetMuscles = useCallback((name: string) => {
    const keywords = [
      "소흉근",
      "대흉근",
      "전방삼각근",
      "광배근",
      "상부승모근",
      "견갑거근",
      "극하근",
      "견갑하근",
      "하부승모근",
      "전경골근",
      "비복근",
      "가자미근",
      "후경골근",
      "비골근",
      "대둔근",
      "중둔근",
      "복횡근",
      "코어",
      "전거근",
      "Y자",
      "T자",
      "케이블",
      "흉추",
      "삼각근",
      "장요근",
    ];
    const found = keywords.filter((k) => name.includes(k));
    return found.length > 0 ? found : ["코어"]; // fallback
  }, []);

  const targetMuscles = useMemo(() => {
    if (!currentEx) return ["코어"];
    return getTargetMuscles(currentEx.name);
  }, [currentEx, getTargetMuscles]);

  // ── 데이터 연동: 빌더에 위임 ──
  //
  // `buildRoutineFromAnalysis` 가 세트 분할 + set-rest/transition 브레이크
  // 삽입을 담당한다. CesProtocol 은 분석 결과와 근육 타겟 매퍼만 넘기면 된다.
  // 스텝의 durationSeconds 합은 cesGoalCalculator.exerciseSeconds 와 일치해서
  // 대시보드 phase 목표와 1:1 로 매칭된다.
  const handleStartPlayer = () => {
    const customRoutine = buildRoutineFromAnalysis(analysis, {
      getTargetMuscles,
    });
    navigate("/ces-player", { state: { customRoutine } });
  };

  console.log("최종 targetMuscles:", targetMuscles);
  return (
    <div className="ces-dashboard page-bg-ces">
      {/* ─── 사이드바 ──────────────────────────────────────── */}
      <div className="ces-sidebar">
        {/* 해부 SVG: 사이드바 상단 — 로고/햄버거 제거, SVG 가 주인공 */}
        <div
          className="human-anatomy-box"
          style={{
            padding: 0,
            height: "50vh",
            width: "100%",
            flex: "0 0 50vh",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BodyAnatomySvg
            highlightIds={targetMuscles}
            cesPhase={
              (activeStage.charAt(0).toUpperCase() +
                activeStage.slice(1)) as CesPhase
            }
          />
        </div>

        {/* 타이머 — NTC 스타일 수동 누적 */}
        <div className="sidebar-stats">
          <div
            className={`card stat-card-inner ${timerRunning ? "is-active" : ""}`}
          >
            <p className="sub-label">누적 운동 시간</p>
            <p className="stat-main-val">{formatTime(seconds)}</p>
            <div className="timer-actions">
              <button
                onClick={toggleTimer}
                className={`btn-timer flex justify-center items-center gap-1 ${timerRunning ? "is-running" : "primary"}`}
              >
                {timerRunning ? (
                  <>
                    <Pause size={14} /> 일시정지
                  </>
                ) : (
                  <>
                    <Play size={14} /> 시작
                  </>
                )}
              </button>
              <button
                onClick={resetTimer}
                className="btn-timer btn-reset flex justify-center items-center gap-1"
              >
                <RotateCcw size={14} /> 초기화
              </button>
            </div>
          </div>

          {currentEx && getExMeta(currentEx) && (
            <div>
              <p className="sub-label">현재 운동</p>
              <p className="stat-sub-val" style={{ color: "#63E6BE" }}>
                {getExMeta(currentEx)}
              </p>
            </div>
          )}
        </div>

        {/* 단계 탭 */}
        <div className="ces-stage-tabs">
          {STAGES.map((s) => (
            <button
              key={s.id}
              className={`ces-tab-btn ${activeStage === s.id ? "is-active" : ""}`}
              onClick={() => {
                setActiveStage(s.id);
                setActiveIndex(0);
              }}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* 하단 액션 */}
        <div className="sidebar-actions">
          <button
            className="btn-complete is-primary"
            onClick={handleStartPlayer}
          >
            자동 재생 시작 <span>›</span>
          </button>
          <button
            className="btn-complete is-success"
            onClick={() => navigate(`/trends?patientId=${session.patientId}`)}
          >
            운동 완료 <span>›</span>
          </button>
        </div>
      </div>

      {/* ─── 메인 패널 ─────────────────────────────────────── */}
      <div className="ces-main">
        {/* 상단 헤더 — 관절/방향 + 환자 요약 (압축) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
            gap: "12px",
          }}
        >
          <select
            className="form-select"
            style={{
              width: "auto",
              boxShadow: "none",
              fontWeight: 800,
              fontSize: "1.1rem",
              padding: "0.5rem 2rem 0.5rem 0.75rem",
              borderRadius: "10px",
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.7)",
            }}
            value={activeJointSide}
            onChange={(e) => {
              setActiveJointSide(e.target.value);
              setActiveIndex(0);
            }}
          >
            {jointSideList.map((js) => (
              <option key={js.id} value={js.id}>
                {js.label}
              </option>
            ))}
          </select>
          <span
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
              opacity: 0.7,
              whiteSpace: "nowrap",
            }}
          >
            {session?.patientName ?? "환자"}
            {session?.patientAge ? ` · ${session.patientAge}세` : ""}
          </span>
        </div>

        <CesExercisePlayer
          exercises={exercises}
          stageId={activeStage}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
        />

        {/* 근육 밸런스 */}
        <div className="muscle-balance-box">
          <h3
            className="main-title"
            style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}
          >
            Muscle Balance Status
          </h3>
          <div className="balance-grid">
            <div className="balance-card">
              <p
                className="balance-title flex items-center gap-1"
                style={{ color: "var(--danger)" }}
              >
                <AlertTriangle size={18} /> Overactive (뭉친 근육)
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.overactiveMuscles.map((m) => (
                  <span
                    key={m}
                    style={{
                      fontSize: "0.8rem",
                      padding: "0.3rem 0.6rem",
                      background: "rgba(240,62,62,0.1)",
                      color: "var(--danger)",
                      borderRadius: "6px",
                      fontWeight: 700,
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="balance-card">
              <p
                className="balance-title flex items-center gap-1"
                style={{ color: "var(--success)" }}
              >
                <CheckCircle size={18} /> Underactive (약한 근육)
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.underactiveMuscles.map((m) => (
                  <span
                    key={m}
                    style={{
                      fontSize: "0.8rem",
                      padding: "0.3rem 0.6rem",
                      background: "rgba(46,204,136,0.1)",
                      color: "var(--success)",
                      borderRadius: "6px",
                      fontWeight: 700,
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
