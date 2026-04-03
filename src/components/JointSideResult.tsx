import React from 'react';
import { JOINTS, calculateSeverity } from '../lib/romData';
import type { RomSession, Side } from '../lib/romData';


interface JointSideResultProps {
    session: RomSession;
    jointId: string;
    side: Side;
    firstSession?: RomSession;
}

export const JointSideResult: React.FC<JointSideResultProps> = ({
    session, jointId, side, firstSession
}) => {
    const joint = JOINTS.find((j) => j.id === jointId);
    if (!joint) return null;

    const sideMeasurements = session.measurements?.[jointId]?.[side] ?? {};
    const firstSideMeasurements = firstSession?.measurements?.[jointId]?.[side] ?? {};

    const results = joint.movements.map((m) => {
        const measured = sideMeasurements[m.id] ?? 0;
        const firstMeasured = firstSideMeasurements[m.id];
        const diff = firstMeasured !== undefined ? measured - firstMeasured : null;

        return {
            ...m,
            measured,
            severity: m.isQualitative
                ? (measured === 1 ? '심각한제한' : '정상')
                : calculateSeverity(measured, m.normalRange),
            diff
        };
    });
    const hasLimitation = results.some((r) => r.severity !== '정상');

    const severityBgColor = (s: string) => ({
        '정상': 'var(--success)', 
        '경도제한': 'var(--warning)',
        '중등도제한': 'var(--warning)', 
        '심각한제한': 'var(--danger)',
    })[s] ?? '#9CA3AF';

    return (
        <div className="panel" style={{ marginBottom: '1rem' }}>
            <div className="panel-header">
                <h3>{joint.name}{joint.isSymmetric ? '' : ` — ${side}`}</h3>
                <span className={`badge ${hasLimitation ? 'badge-warning' : 'badge-success'}`}>
                    {hasLimitation ? '⚠️ 제한 있음' : '✅ 정상'}
                </span>
            </div>
            {results.map((res) => (
                <div key={res.id} className="file-item" style={{ 
                    cursor: 'default', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem', 
                    padding: '1.25rem',
                    background: 'var(--surface)',
                    boxShadow: 'var(--neumo-shadow-small)',
                    borderRadius: '16px',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255,255,255,0.5)'
                }}>
                    {/* 좌측: 이름 및 뱃지 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0, width: '130px' }}>
                        <p className="file-name" style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', wordBreak: 'keep-all' }}>{res.name}</p>
                        <div>
                            <span className={`badge ${res.severity === '정상' ? 'badge-success' : res.severity === '심각한제한' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', fontWeight: 800 }}>
                                {res.severity}
                            </span>
                        </div>
                    </div>

                    {/* 우측: 리니어 프로그레스 바 */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
                        {res.isQualitative ? (
                            <div style={{ fontSize: '1rem', fontWeight: 800, color: severityBgColor(res.severity) }}>
                                {res.measured === 1 ? '⚠️ 특이사항 (문제 발견됨)' : '✅ 정상 범위'}
                            </div>
                        ) : (
                            <>
                                {/* 라벨/수치 영역 */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                    <span>0°</span>
                                    <span>정상: {res.normalRange}°</span>
                                </div>
                                
                                {/* 트랙 & 바 */}
                                <div style={{ 
                                    position: 'relative', 
                                    height: '10px', 
                                    background: 'var(--border-color)', 
                                    borderRadius: '999px',
                                    margin: '24px 16px 8px 16px' // 팝오버가 글씨를 가리지 않도록 상/하/좌/우 여백 추가
                                }}>
                                    {(() => {
                                        const ratio = res.normalRange === 0 ? (res.measured >= -5 ? 1 : 0) : Math.min(Math.max(res.measured / res.normalRange, 0), 1);
                                        const percent = ratio * 100;
                                        const barColor = severityBgColor(res.severity);
                                        return (
                                            <>
                                                {/* 채워진 색상 바 */}
                                                <div style={{
                                                    position: 'absolute', top: 0, left: 0, height: '100%',
                                                    width: `${percent}%`,
                                                    background: barColor,
                                                    borderRadius: '999px',
                                                    transition: 'width 1s ease-out'
                                                }} />
                                                
                                                {/* 측정값 마커 */}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: `${percent}%`,
                                                    transform: 'translate(-50%, -50%)',
                                                    width: '18px',
                                                    height: '18px',
                                                    background: '#fff',
                                                    border: `4px solid ${barColor}`,
                                                    borderRadius: '50%',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}>
                                                    {/* 상단 팝오버 텍스트 */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: 'calc(100% + 6px)',
                                                        left: '50%',
                                                        transform: 'translateX(-50%)',
                                                        fontWeight: 900,
                                                        fontSize: '0.85rem',
                                                        color: barColor,
                                                        background: 'rgba(255,255,255,0.9)',
                                                        padding: '2px 6px',
                                                        borderRadius: '6px',
                                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {res.measured}°
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                

                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
