import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_CES_DATA } from '../lib/ces';
import { JOINTS } from '../lib/romData';
import type { CesStage } from '../lib/ces/cesTypes';

const STAGE_LABELS: Record<CesStage, { label: string; icon: string; color: string }> = {
  inhibit: { label: 'Inhibit (억제)', icon: '🔴', color: 'var(--danger)' },
  lengthen: { label: 'Lengthen (신장)', icon: '🟠', color: 'var(--warning)' },
  activate: { label: 'Activate (활성화)', icon: '🟢', color: 'var(--success)' },
  integrate: { label: 'Integrate (통합)', icon: '🔵', color: 'var(--primary)' },
};

const JOINT_ICONS: Record<string, string> = {
  shoulder: '👕',
  elbow: '💪',
  wrist: '⌚',
  hip: '👖',
  knee: '🦵',
  ankle: '🦶',
  waist: '🧍',
};

const UPPER_BODY = ['shoulder', 'elbow', 'wrist', 'waist'];
const LOWER_BODY = ['hip', 'knee', 'ankle'];

export const CesInfo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedJointId, setSelectedJointId] = useState<string>('shoulder');
  const [selectedMovement, setSelectedMovement] = useState<string>('');

  const currentJoint = JOINTS.find(j => j.id === selectedJointId);
  const cesData = ALL_CES_DATA[selectedJointId];

  // Derive the actual movement to display (robust for joint switches)
  const currentMovements = useMemo(() => cesData ? Object.keys(cesData.protocol) : [], [cesData]);
  const activeMovement = currentMovements.includes(selectedMovement) ? selectedMovement : (currentMovements[0] || '');

  // Sync state back for the selector
  useEffect(() => {
    if (activeMovement && activeMovement !== selectedMovement) {
      setSelectedMovement(activeMovement);
    }
  }, [activeMovement, selectedMovement]);

  if (!cesData) return <div className="p-8">Data not found for {selectedJointId}</div>;

  return (
    <div className="ces-dashboard page-bg-ces info-mode">
      {/* --- Sidebar for Joint Selection --- */}
      <div className="ces-sidebar">
        <div className="sidebar-logo">
          <span>●</span> CES Reference
        </div>
        <div className="sidebar-menu mt-8">
          <div className="menu-group-label text-[10px] opacity-40 font-bold mb-2 ml-4 tracking-widest uppercase">Upper Body</div>
          {JOINTS.filter(j => UPPER_BODY.includes(j.id)).map(j => (
            <button
              key={j.id}
              className={`sidebar-item ${selectedJointId === j.id ? 'is-active' : ''}`}
              onClick={() => setSelectedJointId(j.id)}
            >
              <span className="item-icon">{JOINT_ICONS[j.id]}</span>
              <span className="item-label">{j.name.split(' (')[0]}</span>
            </button>
          ))}
          
          <div className="menu-group-label text-[10px] opacity-40 font-bold mb-2 ml-4 mt-6 tracking-widest uppercase">Lower Body</div>
          {JOINTS.filter(j => LOWER_BODY.includes(j.id)).map(j => (
            <button
              key={j.id}
              className={`sidebar-item ${selectedJointId === j.id ? 'is-active' : ''}`}
              onClick={() => setSelectedJointId(j.id)}
            >
              <span className="item-icon">{JOINT_ICONS[j.id]}</span>
              <span className="item-label">{j.name.split(' (')[0]}</span>
            </button>
          ))}
        </div>
        
        <div className="sidebar-actions mt-auto">
          <button className="btn-complete" onClick={() => navigate('/ces')}>
            Go to Protocol <span>›</span>
          </button>
          <button className="btn-close-circle" onClick={() => navigate('/')}>✕</button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="ces-main scroll-y">
        <header className="info-header mb-8">
          <h1 className="main-title text-4xl">{currentJoint?.name}</h1>
          <p className="sub-label opacity-70">Corrective Exercise Strategy Reference Guide</p>
        </header>

        {/* Movement Selector (Sub-tabs) */}
        <div className="movement-tabs mb-8 flex gap-2 flex-wrap">
          {Object.keys(cesData.protocol).map(mId => {
            const mName = currentJoint?.movements.find(m => m.id === mId)?.name || mId;
            return (
              <button
                key={mId}
                className={`ces-tab-btn flex-1 min-w-[120px] ${activeMovement === mId ? 'is-active' : ''}`}
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
                  <span className="icon">🧠</span> Muscle Map
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-red-400 font-bold mb-2">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      Overactive (짧아짐)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cesData.muscleMap[activeMovement]?.overactive.map(m => (
                        <span key={m} className="muscle-tag overactive">{m}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-green-400 font-bold mb-2">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      Underactive (약해짐)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cesData.muscleMap[activeMovement]?.underactive.map(m => (
                        <span key={m} className="muscle-tag underactive">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* --- Right Column: Protocols --- */}
            <div className="lg:col-span-8 space-y-6">
              {(['inhibit', 'lengthen', 'activate'] as const).map(stage => (
                <section key={stage} className="card protocol-section p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="section-title flex items-center gap-2">
                      <span className="icon">{STAGE_LABELS[stage].icon}</span>
                      {STAGE_LABELS[stage].label}
                    </h3>
                    <span className="text-xs font-mono opacity-50 uppercase">{stage} stage</span>
                  </div>
                  
                  <div className="exercise-list space-y-4">
                    {cesData.protocol[activeMovement][stage].map((ex, idx) => (
                      <div key={ex.id} className="exercise-info-item flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="ex-num font-mono text-2xl opacity-20">{idx + 1}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1">{ex.name}</h4>
                          <p className="text-sm opacity-70 mb-3">{ex.description}</p>
                          <div className="ex-meta flex flex-wrap gap-3">
                            {ex.tools && <span className="meta-tag">🛠 {ex.tools}</span>}
                            {ex.holdSeconds && <span className="meta-tag">⏱ {ex.holdSeconds}s</span>}
                            {ex.sets && <span className="meta-tag">🔄 {ex.sets} Sets</span>}
                            {ex.reps && <span className="meta-tag">🔢 {ex.reps} Reps</span>}
                          </div>
                        </div>
                        {ex.youtubeId && (
                          <div className="yt-indicator text-red-500 animate-pulse">
                            ▶
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
            <span className="icon">🔵</span> Integration (통합 운동)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cesData.integrate.map(ex => (
              <div key={ex.id} className="exercise-info-item p-4 rounded-xl bg-white/5 border border-primary/20">
                <h4 className="text-lg font-bold text-primary-light mb-1">{ex.name}</h4>
                <p className="text-sm opacity-70 mb-3">{ex.description}</p>
                <div className="ex-meta flex gap-3">
                  {ex.sets && <span className="meta-tag">🔄 {ex.sets} Sets</span>}
                  {ex.reps && <span className="meta-tag">🔢 {ex.reps} Reps</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .info-mode .ces-main { padding: 2.5rem; }
        .info-mode .main-title { font-weight: 900; letter-spacing: -0.05em; background: linear-gradient(to right, #fff, #aaa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .muscle-tag { padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; }
        .muscle-tag.overactive { background: rgba(240, 62, 62, 0.15); color: #ff8787; border: 1px solid rgba(240, 62, 62, 0.3); }
        .muscle-tag.underactive { background: rgba(46, 204, 136, 0.15); color: #63e6be; border: 1px solid rgba(46, 204, 136, 0.3); }
        .muscle-tag.underactive { background: rgba(46, 204, 136, 0.15); color: #63e6be; border: 1px solid rgba(46, 204, 136, 0.3); }
        .meta-tag { font-size: 0.75rem; color: #aaa; background: rgba(255,255,255,0.05); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); }
        .sidebar-item { display: flex; align-items: center; width: calc(100% - 1.5rem); margin: 0.25rem 0.75rem; padding: 0.75rem 1rem; border-radius: 12px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); color: rgba(255,255,255,0.7); position: relative; }
        .sidebar-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .sidebar-item.is-active { background: var(--primary); color: #fff; font-weight: 700; box-shadow: 0 4px 20px rgba(0,0,0,0.4); transform: translateX(4px); }
        .sidebar-item .item-icon { font-size: 1.2rem; margin-right: 0.75rem; transition: transform 0.3s; }
        .sidebar-item.is-active .item-icon { transform: scale(1.2); }
        .sidebar-item.is-active::before { content: ''; position: absolute; left: -10px; top: 20%; height: 60%; width: 4px; background: #fff; border-radius: 0 4px 4px 0; }
        .movement-tabs .ces-tab-btn { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); text-transform: none; font-weight: 700; height: 3.5rem; border-radius: 12px; border: 2px solid rgba(0,0,0,0.1); background: rgba(0,0,0,0.03); color: #4a5568; }
        .movement-tabs .ces-tab-btn:hover { border-color: rgba(0,0,0,0.2); background: rgba(0,0,0,0.05); color: #2d3748; }
        .movement-tabs .ces-tab-btn.is-active { background: #fff; color: #000; border-color: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.2); transform: translateY(-2px) scale(1.02); }
        .section-title { font-weight: 800; font-size: 1.3rem; letter-spacing: -0.02em; color: #1a202c; }
        .exercise-info-item { transition: all 0.3s ease; background: #fff; border: 1px solid rgba(0,0,0,0.05); }
        .exercise-info-item:hover { transform: translateY(-2px); border-color: rgba(0,0,0,0.1); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .exercise-info-item h4 { color: #2d3748; }
        .exercise-info-item p { color: #4a5568; }
        .text-primary-light { color: #3182ce; }
        .scroll-y { overflow-y: auto; height: 100vh; }
      `}} />
    </div>
  );
};
