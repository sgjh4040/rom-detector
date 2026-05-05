import React from 'react';
import type { RomSession } from '../../../lib/romTypes';
import { useNavigate } from 'react-router-dom';

interface HistoryItemProps {
    session: RomSession;
    index: number;
    total: number;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ session, index, total }) => {
    const navigate = useNavigate();

    const openDetail = () => {
        localStorage.setItem('rom_session', JSON.stringify(session));
        navigate('/results');
    };

    return (
        <button
            type="button"
            className="neumo-card transition-all duration-200 history-row"
            onClick={openDetail}
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                padding: '20px',
                borderRadius: '24px',
                marginBottom: '10px',
                background: 'transparent',
                fontFamily: 'inherit',
                textAlign: 'left',
                cursor: 'pointer',
            }}
        >
            <div>
                <div className="font-bold opacity-80">
                    {total - index}회차: {new Date(session.createdAt).toLocaleString()}
                </div>
                <div className="text-xs text-secondary opacity-60">
                    VAS: {session.vasScore || 0} | 부위: {session.painArea || '없음'}
                </div>
            </div>
            <span
                aria-hidden="true"
                style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    opacity: 0.4,
                }}
            >
                ›
            </span>
        </button>
    );
};
