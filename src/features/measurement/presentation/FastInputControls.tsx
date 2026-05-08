import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { ImageAngleMeasurer } from '../../../core/components/ImageAngleMeasurer';
import type { Movement } from '../../../lib/romData';

interface FastInputControlsProps {
    activeMov: Movement | undefined;
    activeVal: number;
    handleFast: (pct: number) => void;
    handlePhoto: (angle: number) => void;
}

export const FastInputControls: React.FC<FastInputControlsProps> = ({
    activeMov,
    activeVal,
    handleFast,
    handlePhoto
}) => {
    const [showPhoto, setShowPhoto] = useState(false);

    const onPhotoConfirmed = (angle: number) => {
        handlePhoto(angle);
        setShowPhoto(false);
    };

    const maxVal = activeMov?.normalRange ?? 180;
    const isNormalSelected = activeVal === maxVal && activeVal > 0;

    return (
        <>
            {/* Segmented Control */}
            <div className="rom-seg">
                {[25, 50, 75].map(pct => {
                    const targetVal = Math.round((maxVal * pct) / 100);
                    const isSelected = activeVal === targetVal && activeVal > 0;

                    return (
                        <button
                            key={pct}
                            onClick={() => handleFast(pct)}
                            className={`rom-seg__btn ${isSelected ? 'rom-seg__btn--active' : ''}`}
                        >
                            {pct}%
                        </button>
                    );
                })}
                <button
                    onClick={() => handleFast(100)}
                    className={`rom-seg__btn ${isNormalSelected ? 'rom-seg__btn--normal' : ''}`}
                >
                    목표치
                </button>
            </div>

            {/* Photo Button — [audit #35] 라벨이 "카메라로 정밀 분석하기" 였을 때
                사용자가 AI 자동 인식 같은 기능을 기대하던 문제 해소. 실제 동작은
                "사진 업로드 → 3점 클릭 → 두 벡터 사잇각 계산" 이라 라벨/부제로 명시. */}
            <button
                onClick={() => setShowPhoto(!showPhoto)}
                className={`rom-photo-btn ${showPhoto ? 'rom-photo-btn--open' : ''}`}
            >
                <Camera style={{ width: 18, height: 18 }} />
                {showPhoto ? '사진 측정 닫기' : '사진으로 측정하기'}
            </button>
            {!showPhoto && (
                <p
                    style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-secondary)',
                        textAlign: 'center',
                        marginTop: '0.4rem',
                        opacity: 0.75,
                        lineHeight: 1.4,
                    }}
                >
                    사진을 올리고 3점을 찍으면 각도가 자동 계산됩니다
                </p>
            )}

            {showPhoto && (
                <div className="rom-photo-wrap">
                    <ImageAngleMeasurer onAngleConfirmed={onPhotoConfirmed} />
                </div>
            )}
        </>
    );
};
