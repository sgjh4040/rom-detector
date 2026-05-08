import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Joint } from '../../../lib/romData';

const MOVEMENT_ICONS: Record<string, string> = {
    flexion: '↗', extension: '↙', abduction: '↔', adduction: '↕',
    internal_rotation: '↺', external_rotation: '↻',
    supination: '↫', pronation: '↬',
    radial_deviation: '←', ulnar_deviation: '→',
    plantar_flexion: '↓', dorsi_flexion: '↑',
    inversion: '◁', eversion: '▷',
};


interface MovementSidebarProps {
    joint: Joint;
    measurements: Record<string, number>;
    activeId: string;
    onSelectActiveId: (id: string) => void;
}


export const MovementSidebar: React.FC<MovementSidebarProps> = ({ joint, measurements, activeId, onSelectActiveId }) => {
    return (
        <div className="w-full md:w-1/3 flex flex-col gap-2">
            <div className="px-2 mb-2 flex items-center justify-between">
                {/* [audit #27] 카테고리 라벨 — 헤딩이 아니라 그룹 라벨 */}
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Movements</div>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {joint.movements.length}
                </span>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 flex flex-col gap-1">
                {joint.movements.map(m => {
                    const val = measurements[m.id] ?? 0;
                    const isDone = val > 0;
                    const isActive = m.id === activeId;

                    return (
                        <button
                            key={m.id}
                            onClick={() => onSelectActiveId(m.id)}
                            className={`
                                relative flex items-center w-full px-4 py-3.5 rounded-xl transition-all duration-200 text-left
                                ${isActive ? 'bg-blue-50/80 shadow-sm' : 'hover:bg-slate-50'}
                            `}
                        >
                            {/* Active Indicator Line */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-blue-600 rounded-r-full" />
                            )}

                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center text-lg mr-4 shrink-0 transition-colors
                                ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}
                            `}>
                                {MOVEMENT_ICONS[m.id] ?? '↔'}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-base truncate ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>
                                    {m.name}
                                </p>
                                <p className="text-sm text-slate-500 truncate mt-0.5">
                                    {val}° <span className="text-slate-300 mx-1">/</span> {m.normalRange}°
                                </p>
                            </div>

                            <div className="ml-3 shrink-0 flex items-center justify-center">
                                {isDone ? (
                                    <div className="flex flex-col items-center">
                                        <CheckCircle2 className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-emerald-500'}`} />
                                    </div>
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
