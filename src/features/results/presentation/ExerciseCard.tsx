import React from 'react';
import type { Exercise } from '../../../lib/romData';
import { PlayCircle } from 'lucide-react';
import { Card } from '../../../components/redesign/ui/Card';
import { Badge } from '../../../components/redesign/ui/Badge';

interface ExerciseCardProps { exercise: Exercise; }

/** TrackActive 스타일 운동 카드 — 이미지 상단 전체 + 하단 정보 */
export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => (
    <Card className="overflow-hidden mb-4 p-0">
        {/* 이미지 + 플레이 오버레이 */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: 'var(--primary-light)' }}>
            <img
                src={exercise.imageUrl}
                alt={exercise.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(160deg, transparent 50%, rgba(0,0,0,0.35) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <div style={{
                    width: '48px', height: '48px', borderRadius: 'var(--radius-circle)',
                    background: 'rgba(255,255,255,0.92)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}>
                    <PlayCircle size={28} color="var(--primary)" />
                </div>
            </div>
            {/* 유형 뱃지 */}
            <Badge
                variant={exercise.type === 'stretching' ? 'success' : 'warning'}
                className="absolute top-2.5 left-2.5"
            >
                {exercise.type === 'stretching' ? '스트레칭' : '근력강화'}
            </Badge>
        </div>

        {/* 텍스트 정보 */}
        <div style={{ padding: '1rem' }}>
            <div className="flex justify-between items-center mb-1">
                <h3 style={{ fontSize: 'var(--text-base)' }}>{exercise.title}</h3>
                {exercise.level && (
                    <Badge variant="accent">{exercise.level}</Badge>
                )}
            </div>
            <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
                {exercise.description}
            </p>
        </div>
    </Card>
);
