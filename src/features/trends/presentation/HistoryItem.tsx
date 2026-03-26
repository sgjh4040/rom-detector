import React, { useState } from 'react';
import type { RomSession } from '../../../lib/romTypes';
import { useNavigate } from 'react-router-dom';

interface HistoryItemProps {
    session: RomSession;
    index: number;
    total: number;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ session, index, total }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            className={`neumo-card transition-all duration-300`}
            style={{
                border: '1px solid rgba(255, 255, 255, 0.8)',
                padding: '24px 20px',
                borderRadius: '24px',
                marginBottom: '10px'
            }}
        >
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>
                    <div className="font-bold opacity-80">{total - index}회차: {new Date(session.createdAt).toLocaleString()}</div>
                    <div className="text-xs text-secondary opacity-60">
                        VAS: {session.vasScore || 0} | 부위: {session.painArea || '없음'}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="neumo-btn btn-small px-3 py-1 text-xs"
                        onClick={(e) => {
                            e.stopPropagation();
                            localStorage.setItem('rom_session', JSON.stringify(session));
                            navigate('/results');
                        }}
                    >
                        상세보기
                    </button>
                    <span className={`text-xs opacity-40 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-xs opacity-50 mb-1">측정 부위</p>
                            <p className="font-medium">{session.selectedJointIds.join(', ')}</p>
                        </div>
                        <div>
                            <p className="text-xs opacity-50 mb-1">측정 방향</p>
                            <p className="font-medium">{session.selectedSides.join(', ')}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs opacity-50 mb-1">통증 지수 (VAS)</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent-red"
                                        style={{ width: `${(session.vasScore || 0) * 10}%` }}
                                    />
                                </div>
                                <span className="font-bold">{session.vasScore || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
