import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ALL_CES_DATA } from "../lib/ces";
import { JOINTS } from "../lib/romData";
import type { CesStage } from "../lib/ces/cesTypes";
import { 
  CircleSlash, Accessibility, Activity, CheckCircle2,
  User, Crosshair, Watch, Footprints, MoveVertical,
  Brain, Wrench, Timer, Repeat, Hash, PlayCircle
} from "lucide-react";

const STAGE_LABELS: Record<
  CesStage,
  { label: string; short: string; icon: React.ReactNode; color: string }
> = {
  inhibit: { label: "억제 (Inhibit)", short: "억제", icon: <CircleSlash size={18} color="currentColor" />, color: "var(--danger)" },
  lengthen: { label: "신장 (Lengthen)", short: "신장", icon: <Accessibility size={18} color="currentColor" />, color: "var(--warning)" },
  activate: { label: "활성 (Activate)", short: "활성", icon: <CheckCircle2 size={18} color="currentColor" />, color: "var(--success)" },
  integrate: { label: "통합 (Integrate)", short: "통합", icon: <Activity size={18} color="currentColor" />, color: "var(--primary)" },
};

const JOINT_ICONS: Record<string, React.ReactNode> = {
  shoulder: <User size={18} />,
  elbow: <Crosshair size={18} />,
  wrist: <Watch size={18} />,
  hip: <Activity size={18} />,
  knee: <Footprints size={18} />,
  ankle: <Footprints size={18} />,
  waist: <MoveVertical size={18} />,
};

const UPPER_BODY = ["shoulder", "elbow", "wrist", "waist"];
const LOWER_BODY = ["hip", "knee", "ankle"];

export const CesInfo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedJointId, setSelectedJointId] = useState<string>("shoulder");
  const [selectedMovement, setSelectedMovement] = useState<string>("");

  const currentJoint = JOINTS.find((j) => j.id === selectedJointId);
  const cesData = ALL_CES_DATA[selectedJointId];

  // Derive the actual movement to display (robust for joint switches)
  const currentMovements = useMemo(
    () => (cesData ? Object.keys(cesData.protocol) : []),
    [cesData],
  );
  const activeMovement = currentMovements.includes(selectedMovement)
    ? selectedMovement
    : currentMovements[0] || "";

  // Sync state back for the selector
  useEffect(() => {
    if (activeMovement && activeMovement !== selectedMovement) {
      setSelectedMovement(activeMovement);
    }
  }, [activeMovement, selectedMovement]);

  if (!cesData)
    return <div className="p-8">{selectedJointId} 데이터를 찾을 수 없어요</div>;

  return (
    <div className="ces-dashboard page-bg-ces info-mode">
      {/* --- Sidebar for Joint Selection --- */}
      <div className="ces-sidebar">
        <div className="sidebar-logo">
          <span>●</span> CES 참고
        </div>
        <div className="sidebar-menu mt-8">
          <div className="menu-group-label text-[10px] opacity-40 font-bold mb-2 ml-4 tracking-widest">
            상체
          </div>
          {JOINTS.filter((j) => UPPER_BODY.includes(j.id)).map((j) => (
            <button
              key={j.id}
              className={`sidebar-item ${selectedJointId === j.id ? "is-active" : ""}`}
              onClick={() => setSelectedJointId(j.id)}
            >
              <span className="item-icon">{JOINT_ICONS[j.id]}</span>
              <span className="item-label">{j.name.split(" (")[0]}</span>
            </button>
          ))}

          <div className="menu-group-label text-[10px] opacity-40 font-bold mb-2 ml-4 mt-6 tracking-widest">
            하체
          </div>
          {JOINTS.filter((j) => LOWER_BODY.includes(j.id)).map((j) => (
            <button
              key={j.id}
              className={`sidebar-item ${selectedJointId === j.id ? "is-active" : ""}`}
              onClick={() => setSelectedJointId(j.id)}
            >
              <span className="item-icon">{JOINT_ICONS[j.id]}</span>
              <span className="item-label">{j.name.split(" (")[0]}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-actions mt-auto">
          <button className="btn-complete" onClick={() => navigate("/ces")}>
            프로토콜 시작 <span>›</span>
          </button>
          <button
            className="btn-close-circle"
            onClick={() => navigate("/")}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="ces-main scroll-y">
        <header className="info-header mb-8">
          <h1 className="main-title text-4xl">{currentJoint?.name}</h1>
          <p className="sub-label opacity-70">
            교정 운동 전략 (CES) 참고 가이드
          </p>
        </header>

        {/* Movement Selector (Sub-tabs) */}
        <div className="movement-tabs mb-8 flex gap-2 flex-wrap">
          {Object.keys(cesData.protocol).map((mId) => {
            const mName =
              currentJoint?.movements.find((m) => m.id === mId)?.name || mId;
            return (
              <button
                key={mId}
                className={`ces-tab-btn flex-1 min-w-[120px] ${activeMovement === mId ? "is-active" : ""}`}
                onClick={() => setSelectedMovement(mId)}
              >
                {mName}
              </button>
            );
          })}
        </div>

        {activeMovement && (
          <div className="info-grid grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* --- Left Column: Muscle Map --- */}
            <div className="lg:col-span-4 space-y-6">
              <section className="card muscle-map-card p-6 h-full">
                <h3 className="section-title mb-4 flex items-center gap-2">
                  <span className="icon text-primary"><Brain size={24} /></span> 근육 분석
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-red-400 font-bold mb-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      과활성 (짧아짐)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cesData.muscleMap[activeMovement]?.overactive.map(
                        (m) => (
                          <span key={m} className="muscle-tag overactive">
                            {m}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-green-400 font-bold mb-2">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      저활성 (약해짐)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cesData.muscleMap[activeMovement]?.underactive.map(
                        (m) => (
                          <span key={m} className="muscle-tag underactive">
                            {m}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* --- Right Column: Protocols --- */}
            <div className="lg:col-span-8 space-y-6">
              {(["inhibit", "lengthen", "activate"] as const).map((stage) => (
                <section key={stage} className="card protocol-section p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="section-title flex items-center gap-2">
                      <span className="icon">{STAGE_LABELS[stage].icon}</span>
                      {STAGE_LABELS[stage].label}
                    </h3>
                    <span className="text-xs font-mono opacity-50">
                      {STAGE_LABELS[stage].short} 단계
                    </span>
                  </div>

                  <div className="exercise-list space-y-4">
                    {cesData.protocol[activeMovement][stage].map((ex, idx) => (
                      <div
                        key={ex.id}
                        className="exercise-info-item flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="ex-num font-mono text-2xl opacity-20">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1">
                            {ex.name}
                          </h4>
                          <p className="text-sm opacity-70 mb-3">
                            {ex.description}
                          </p>
                          <div className="ex-meta flex flex-wrap gap-3">
                            {ex.tools && (
                              <span className="meta-tag flex items-center gap-1"><Wrench size={12} /> {ex.tools}</span>
                            )}
                            {ex.holdSeconds && (
                              <span className="meta-tag flex items-center gap-1">
                                <Timer size={12} /> {ex.holdSeconds}초
                              </span>
                            )}
                            {ex.sets && (
                              <span className="meta-tag flex items-center gap-1">
                                <Repeat size={12} /> {ex.sets}세트
                              </span>
                            )}
                            {ex.reps && (
                              <span className="meta-tag flex items-center gap-1">
                                <Hash size={12} /> {ex.reps}회
                              </span>
                            )}
                          </div>
                        </div>
                        {ex.youtubeId && (
                          <div className="yt-indicator text-red-500 animate-pulse">
                            <PlayCircle size={24} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {/* --- Integration Section (Full Width) --- */}
        <section className="card integrate-section p-6 mt-8">
          <h3 className="section-title mb-6 flex items-center gap-2">
            <span className="icon text-primary"><Activity size={24} /></span> 통합 운동 (Integration)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cesData.integrate.map((ex) => (
              <div
                key={ex.id}
                className="exercise-info-item p-4 rounded-xl bg-white/5 border border-primary/20"
              >
                <h4 className="text-lg font-bold text-primary-light mb-1">
                  {ex.name}
                </h4>
                <p className="text-sm opacity-70 mb-3">{ex.description}</p>
                <div className="ex-meta flex gap-3">
                  {ex.sets && (
                    <span className="meta-tag flex items-center gap-1"><Repeat size={12} /> {ex.sets}세트</span>
                  )}
                  {ex.reps && (
                    <span className="meta-tag flex items-center gap-1"><Hash size={12} /> {ex.reps}회</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* === info-mode (CesInfo) — 라이트 글래스 톤 통일 === */
        .info-mode.ces-dashboard {
          background: var(--bg-gradient, linear-gradient(135deg, #f6f7fb 0%, #eef0f6 100%));
        }
        .info-mode .ces-sidebar {
          background: rgba(255, 255, 255, 0.55);
          border-right: 1px solid rgba(0, 0, 0, 0.05);
          color: var(--text-primary);
        }
        .info-mode .sidebar-logo {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.06);
          color: var(--text-primary) !important;
        }
        .info-mode .sidebar-logo span { color: var(--primary); }
        .info-mode .menu-group-label { color: var(--text-secondary); opacity: 0.55 !important; }

        .info-mode .ces-main { padding: 2.5rem; }
        .info-mode .main-title {
          font-weight: 900;
          letter-spacing: -0.05em;
          color: var(--text-primary);
          background: none;
          -webkit-text-fill-color: currentColor;
        }
        .info-mode .sub-label { color: var(--text-secondary); }

        /* 사이드바 칩(관절 선택) — 라이트 톤 */
        .info-mode .sidebar-item {
          display: flex; align-items: center;
          width: calc(100% - 1.5rem);
          margin: 0.25rem 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          transition: all 0.2s ease;
          color: var(--text-secondary);
          background: transparent;
          border: 1px solid transparent;
          position: relative;
        }
        .info-mode .sidebar-item:hover {
          background: rgba(255, 255, 255, 0.7);
          color: var(--text-primary);
          border-color: rgba(0, 0, 0, 0.06);
        }
        .info-mode .sidebar-item.is-active {
          background: var(--primary);
          color: #fff;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(92, 107, 192, 0.25);
        }
        .info-mode .sidebar-item .item-icon { margin-right: 0.75rem; transition: transform 0.2s; }
        .info-mode .sidebar-item.is-active .item-icon { transform: scale(1.1); }

        /* 근육 태그 / 메타 태그 */
        .muscle-tag { padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; }
        .muscle-tag.overactive { background: rgba(239, 68, 68, 0.1); color: #c53030; border: 1px solid rgba(239, 68, 68, 0.25); }
        .muscle-tag.underactive { background: rgba(34, 197, 94, 0.1); color: #2f855a; border: 1px solid rgba(34, 197, 94, 0.3); }
        .info-mode .meta-tag { font-size: 0.75rem; color: var(--text-secondary); background: rgba(0, 0, 0, 0.04); padding: 0.2rem 0.5rem; border-radius: 6px; border: 1px solid rgba(0, 0, 0, 0.06); }

        /* 동작(움직임) 탭 */
        .info-mode .movement-tabs .ces-tab-btn {
          transition: all 0.2s ease;
          text-transform: none;
          font-weight: 700;
          height: 3rem;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(255, 255, 255, 0.6);
          color: var(--text-secondary);
        }
        .info-mode .movement-tabs .ces-tab-btn:hover {
          border-color: rgba(92, 107, 192, 0.3);
          color: var(--text-primary);
        }
        .info-mode .movement-tabs .ces-tab-btn.is-active {
          background: var(--primary);
          color: #fff;
          border-color: var(--primary);
          box-shadow: 0 6px 18px rgba(92, 107, 192, 0.25);
        }

        /* 섹션 제목 + 운동 카드 */
        .info-mode .section-title { font-weight: 800; font-size: 1.3rem; letter-spacing: -0.02em; color: var(--text-primary); }
        .info-mode .exercise-info-item {
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.85) !important;
          border: 1px solid rgba(0, 0, 0, 0.05) !important;
          color: var(--text-primary);
        }
        .info-mode .exercise-info-item:hover { transform: translateY(-1px); border-color: rgba(0, 0, 0, 0.1) !important; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06); }
        .info-mode .exercise-info-item h4 { color: var(--text-primary) !important; }
        .info-mode .exercise-info-item p { color: var(--text-secondary); }
        .info-mode .ex-num { color: rgba(0, 0, 0, 0.15) !important; }
        .info-mode .text-primary-light { color: var(--primary); }

        /* btn-complete / btn-close-circle 라이트 톤 override */
        .info-mode .btn-complete {
          background: var(--primary);
          color: #fff;
          border: none;
          font-weight: 700;
          padding: 0.85rem 1.25rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(92, 107, 192, 0.25);
          transition: all 0.2s ease;
        }
        .info-mode .btn-complete:hover {
          background: #4a5cb0;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(92, 107, 192, 0.3);
        }
        .info-mode .btn-close-circle {
          background: rgba(0, 0, 0, 0.04);
          color: var(--text-secondary);
          border: 1px solid rgba(0, 0, 0, 0.08);
          width: 44px;
          height: 44px;
          border-radius: 12px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .info-mode .btn-close-circle:hover {
          background: rgba(0, 0, 0, 0.06);
        }

        .scroll-y { overflow-y: auto; height: 100vh; }

        /* === 모바일: 사이드바 → 상단 가로 칩 셀렉터 === */
        @media (max-width: 768px) {
          .info-mode .ces-sidebar {
            position: sticky;
            top: 0;
            z-index: 10;
            background: #f6f7fb;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            padding: 0.75rem 1rem;
            border-right: none;
            border-bottom: 1px solid rgba(0, 0, 0, 0.08);
            order: -1;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          }
          .info-mode .ces-sidebar .sidebar-logo { display: none; }
          .info-mode .ces-sidebar .menu-group-label { display: none; }
          .info-mode .sidebar-menu {
            display: flex;
            flex-direction: row;
            gap: 8px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding: 4px 0;
            margin: 0;
          }
          .info-mode .sidebar-menu::-webkit-scrollbar { display: none; }
          .info-mode .sidebar-item {
            flex-shrink: 0;
            width: auto;
            margin: 0;
            padding: 0.5rem 0.9rem;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.7);
            border: 1px solid rgba(0, 0, 0, 0.08);
            font-size: 0.78rem;
            font-weight: 700;
          }
          .info-mode .sidebar-item .item-icon { margin-right: 0.4rem; }
          .info-mode .sidebar-item .item-icon svg { width: 14px; height: 14px; }
          .info-mode .sidebar-item.is-active { box-shadow: 0 4px 12px rgba(92, 107, 192, 0.25); }

          /* 사이드바 액션(프로토콜 시작/닫기) — 모바일에선 페이지 하단에 fixed bar 로 노출 */
          .info-mode .sidebar-actions {
            display: flex !important;
            gap: 0.5rem;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 0;
            padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom));
            background: #ffffff;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
            z-index: 50;
          }
          .info-mode .sidebar-actions .btn-complete { flex: 1; }
          /* 모바일에선 본문 내부 스크롤 풀기 (페이지 흐름 스크롤로) */
          .info-mode .scroll-y {
            height: auto !important;
            overflow-y: visible !important;
          }
          /* 본문이 fixed 바에 가려지지 않도록 padding-bottom 추가 */
          .info-mode .ces-main {
            padding-bottom: calc(80px + env(safe-area-inset-bottom));
          }

          /* 메인 본문 — 모바일 padding 축소 */
          .info-mode .ces-main {
            padding: 1.25rem 1rem 4rem;
          }
          .info-mode .main-title { font-size: 1.5rem !important; }
          .info-mode .info-header { margin-bottom: 1.5rem; }
        }
      `,
        }}
      />
    </div>
  );
};
