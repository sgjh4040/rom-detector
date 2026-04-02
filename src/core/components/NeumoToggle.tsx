import React from 'react';

interface NeumoToggleProps {
    label: string;
    isOn: boolean;
    onToggle: () => void;
}

export const NeumoToggle: React.FC<NeumoToggleProps> = ({
    label,
    isOn,
    onToggle
}) => {
    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="relative flex items-center p-1 transition-all"
                style={{
                    width: 80,
                    height: 40,
                    cursor: 'pointer',
                    borderRadius: 20,
                    background: isOn
                        ? 'linear-gradient(135deg, #5C6BC0, #7986CB)'
                        : 'rgba(0, 0, 0, 0.06)',
                    border: isOn ? 'none' : '1px solid rgba(0,0,0,0.08)',
                    boxShadow: isOn
                        ? '0 4px 16px rgba(92, 107, 192, 0.3)'
                        : 'inset 0 2px 4px rgba(0,0,0,0.04)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={onToggle}
            >
                <div
                    className="absolute h-8 w-8 rounded-full flex items-center justify-center"
                    style={{
                        left: isOn ? 'calc(100% - 36px)' : '4px',
                        background: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        color: isOn ? 'var(--primary)' : 'var(--text-muted)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <div style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: 'currentColor',
                        boxShadow: '6px 0 0 currentColor, 0 6px 0 currentColor, 6px 6px 0 currentColor'
                    }} />
                </div>
            </div>
            <span className="text-xs font-bold opacity-60 uppercase tracking-widest" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>{label}</span>
        </div>
    );
};
