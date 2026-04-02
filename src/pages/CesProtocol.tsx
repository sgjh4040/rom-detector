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
import { updatePhaseDuration } from "../features/session/data/cesTimeTracker";
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

  // ── 데이터 연동: 4단계 운동을 플레이어 규격에 맞게 병합 ──
  const handleStartPlayer = () => {
    let stepCount = 0;
    const routineExercises: any[] = [];

    const mapExercises = (phaseArr: any[], phaseName: string) => {
      phaseArr.forEach((ex) => {
        routineExercises.push({
          step: ++stepCount,
          exerciseName: ex.name,
          videoUrl: ex.youtubeId || "",
          durationSeconds: ex.holdSeconds || (ex.reps ? ex.reps * 3 : 30),
          cesPhase: phaseName,
          targetSvgIds: getTargetMuscles(ex.name),
        });
      });
    };

    mapExercises(analysis.inhibit, "Inhibit");
    mapExercises(analysis.lengthen, "Lengthen");
    mapExercises(analysis.activate, "Activate");
    mapExercises(analysis.integrate, "Integrate");

    const customRoutine = {
      routineId: `routine_${Date.now()}`,
      totalDurationSeconds: routineExercises.reduce(
        (acc, curr) => acc + curr.durationSeconds,
        0,
      ),
      exercises: routineExercises,
    };

    navigate("/ces-player", { state: { customRoutine } });
  };

  console.log("최종 targetMuscles:", targetMuscles);
  return (
    <div className="ces-dashboard page-bg-ces">
      {/* ─── 사이드바 ──────────────────────────────────────── */}
      <div className="ces-sidebar">
        <div className="sidebar-logo">
          <span>●</span> medicalmotion
        </div>
        <div className="flex justify-end pr-2 mb-4">
          <div className="sidebar-menu-btn" />
        </div>

        {/* 해부 SVG: 사이드바 절반 차지, 잘림 없음 */}
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

        {/* 통계: 타이머 + 운동 처방 */}
        <div className="sidebar-stats">
          <div className={`card stat-card-inner ${timerRunning ? "is-active" : ""}`}>
            <p className="sub-label">Total Time</p>
            <p className="stat-main-val">{formatTime(seconds)}</p>
            <div className="timer-actions">
              <button
                onClick={toggleTimer}
                className={`btn-timer ${timerRunning ? "is-running" : "primary"}`}
              >
                {timerRunning ? "⏸ PAUSE" : "▶ START"}
              </button>
              <button onClick={resetTimer} className="btn-timer btn-reset">
                <span>↺</span> RESET
              </button>
            </div>
          </div>

          {currentEx && getExMeta(currentEx) && (
            <div>
              <p className="sub-label">Exercise</p>
              <p className="stat-sub-val" style={{ color: "#63E6BE" }}>
                {getExMeta(currentEx)}
              </p>
            </div>
          )}
          {/* [PRD 4-2] Line/Systems 비표시 (사용자 요청으로 주석 처리) */}
          {/* <div><p className="sub-label">Line</p><p className="stat-sub-val" style={{ letterSpacing: '0.1em' }}>Front Line</p></div> */}
          {/* <div><p className="sub-label">Systems</p><p className="stat-sub-val">Fascia System<br />Nervous Systems</p></div> */}
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
          <button className="btn-complete is-primary" onClick={handleStartPlayer}>
            Start Player <span>›</span>
          </button>
          <button className="btn-complete is-success" onClick={() => navigate("/")}>
            Complete Exercise <span>›</span>
          </button>
          <button
            className="btn-close-circle"
            onClick={() => navigate("/results")}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ─── 메인 패널 ─────────────────────────────────────── */}
      <div className="ces-main">
        <div className="flex justify-between items-center mb-8">
          <select
            className="form-select"
            style={{
              width: "auto",
              boxShadow: "none",
              fontWeight: 800,
              fontSize: "1.25rem",
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
          <div className="main-user-info">
            <div>
              <p className="user-name">{session?.patientName ?? "환자"}</p>
              <p className="user-meta">{session?.patientAge ? `${session.patientAge}세` : ""}</p>
            </div>
            <div className="user-avatar">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.patientName ?? "default"}`}
                alt="avatar"
                style={{ width: "100%" }}
              />
            </div>
          </div>
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
              <p className="balance-title" style={{ color: "var(--danger)" }}>
                🔴 Overactive (뭉친 근육)
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
              <p className="balance-title" style={{ color: "var(--success)" }}>
                🟢 Underactive (약한 근육)
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
