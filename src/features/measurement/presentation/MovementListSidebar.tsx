import React from 'react';
import type { Joint } from '../../../lib/romData';

const MOVEMENT_ICONS: Record<string, string> = {
    flexion: '↗', extension: '↙', abduction: '↔', adduction: '↕',
    internal_rotation: '↺', external_rotation: '↻',
    supination: '↫', pronation: '↬',
    radial_deviation: '←', ulnar_deviation: '→',
    plantar_flexion: '↓', dorsi_flexion: '↑',
    inversion: '◁', eversion: '▷',
};

interface MovementListSidebarProps {
    joint: Joint;
    measurements: Record<string, number>;
    activeId: string;
    onSelectActiveId: (id: string) => void;
}
// 동작 목록 사이드바
export const MovementListSidebar: React.FC<MovementListSidebarProps> = ({
    joint,
    measurements,
    activeId,
    onSelectActiveId
}) => {
    return (
        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col pt-4">
            {/* [audit #27] 13px 카테고리 라벨은 헤딩이 아니라 그룹 라벨 — div 로 시멘틱 정확화 */}
            <div className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest px-4 mb-4">
                Measurements ({joint.movements.length})
            </div>

            <div className="flex flex-col gap-1">
                {joint.movements.map(m => {
                    const val = measurements[m.id] ?? 0;
                    const isDone = val > 0;
                    const isActive = m.id === activeId;

                    return (
                        <button
                            key={m.id}
                            onClick={() => onSelectActiveId(m.id)}
                            className={`
                                flex items-center w-full px-4 py-3.5 rounded-2xl transition-all duration-300 text-left group
                                ${isActive ? 'bg-white shadow-sm ring-1 ring-gray-100' : 'hover:bg-black/5'}
                            `}
                        >
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm mr-4 shrink-0 transition-colors duration-300
                                ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}
                            `}>
                                {MOVEMENT_ICONS[m.id] ?? '↔'}
                            </div>

                            <div className="flex-1 min-w-0 pr-4">
                                <p className={`font-semibold text-[15px] truncate transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {m.name}
                                </p>
                            </div>

                            <div className="shrink-0 flex items-center justify-end w-12">
                                {isDone ? (
                                    <span className={`text-[15px] font-bold ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                                        {val}°
                                    </span>
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
