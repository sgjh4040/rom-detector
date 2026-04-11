// useCesPlayer.ts — NTC 플레이어 상태·타이머·자동 전환 훅 (PRD 4-0: 200줄 이하)
import { useState, useEffect, useRef, useCallback } from 'react';
import type { CesRoutine, CesPlayerStep } from '../../lib/ces/CesPlayerTypes';
import type { CesStage } from '../../lib/ces/cesTypes';
import { updatePhaseDuration } from '../../features/session/data/cesTimeTracker';

export interface UseCesPlayerReturn {
    currentStep: CesPlayerStep;
    nextStep: CesPlayerStep | null;
    countdown: number;
    isPaused: boolean;
    progress: number;           // 전체 진행률 0~100
    stepProgress: number;       // 현재 스텝 진행률 0~100
    stepIndex: number;
    totalSteps: number;
    isFinished: boolean;
    togglePause: () => void;
    goToStep: (idx: number) => void;
    restart: () => void;
    /** 현재 브레이크 스텝을 즉시 종료하고 다음 스텝으로 — exercise 스텝일 땐 no-op */
    skipBreak: () => void;
}

/** AudioContext로 짧은 Beep음 재생 */
const playBeep = (frequency: number = 880, duration: number = 0.12): void => {
    try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch {
        // AudioContext 미지원 환경 무시
    }
};

/** 다음 영상 pre-loading */
const prefetchVideo = (url: string): void => {
    if (!url) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'video';
    document.head.appendChild(link);
};

/** 다음 exercise 스텝의 비디오 URL 을 찾아 반환 — 브레이크는 건너뛴다 */
const findNextVideoUrl = (
    steps: CesPlayerStep[],
    fromIndex: number,
): string | null => {
    for (let i = fromIndex; i < steps.length; i++) {
        const s = steps[i];
        if (s.kind === 'exercise' && s.videoUrl) return s.videoUrl;
    }
    return null;
};

export const useCesPlayer = (routine: CesRoutine, sessionCreatedAt?: string): UseCesPlayerReturn => {
    const [stepIndex, setStepIndex] = useState(0);
    const [countdown, setCountdown] = useState(routine.exercises[0]?.durationSeconds ?? 0);
    // 진입 시 자동 재생하지 않음 — 사용자가 ▶ 버튼을 눌러야 시작
    const [isPaused, setIsPaused] = useState(true);
    const [isFinished, setIsFinished] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const beepFiredRef = useRef(false);
    // countdown을 ref로도 보관 — StrictMode에서 updater가 2번 호출되는 것을
    // 피하기 위해 side effect(updatePhaseDuration)는 updater 바깥에서 실행
    const countdownRef = useRef(countdown);
    useEffect(() => { countdownRef.current = countdown; }, [countdown]);

    const exercises = routine.exercises;
    const totalSteps = exercises.length;
    const currentStep = exercises[stepIndex] ?? exercises[0];
    const nextStep = stepIndex + 1 < totalSteps ? exercises[stepIndex + 1] : null;

    // 전체 경과 초 계산 — 브레이크 스텝도 루틴 총 시간에는 포함됨
    const elapsedTotal = exercises
        .slice(0, stepIndex)
        .reduce((sum, ex) => sum + ex.durationSeconds, 0)
        + (currentStep.durationSeconds - countdown);

    const progress = Math.min(100, (elapsedTotal / routine.totalDurationSeconds) * 100);
    const stepProgress = Math.min(100, ((currentStep.durationSeconds - countdown) / currentStep.durationSeconds) * 100);

    /** 다음 스텝으로 전환 */
    const advanceStep = useCallback(() => {
        setStepIndex(prev => {
            const next = prev + 1;
            if (next >= totalSteps) {
                setIsFinished(true);
                return prev;
            }
            const nextEx = exercises[next];
            setCountdown(nextEx.durationSeconds);
            beepFiredRef.current = false;
            // 브레이크 건너뛰고 "실제 다음 운동" 의 비디오를 prefetch
            const upcomingVideo = findNextVideoUrl(exercises, next + 1);
            if (upcomingVideo) prefetchVideo(upcomingVideo);
            return next;
        });
    }, [exercises, totalSteps]);

    /** 타이머 tick — exercise 스텝일 때만 updatePhaseDuration 호출 */
    useEffect(() => {
        if (isPaused || isFinished) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }
        timerRef.current = setInterval(() => {
            // 브레이크 스텝은 누적에서 제외 — 대시보드 목표 분모와 일관성 유지
            if (countdownRef.current > 0 && currentStep.kind === 'exercise') {
                const stage = currentStep.cesPhase.toLowerCase() as CesStage;
                updatePhaseDuration(stage, 1, sessionCreatedAt);
            }
            setCountdown(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isPaused, isFinished, currentStep, sessionCreatedAt]);

    /** 카운트다운 완료 시 스텝 전환 부작용 처리 */
    useEffect(() => {
        if (countdown <= 3 && countdown > 0 && !beepFiredRef.current) {
            beepFiredRef.current = true;
            playBeep();
        }
        if (countdown === 0 && !isFinished && !isPaused) {
            advanceStep();
        }
    }, [countdown, isFinished, isPaused, advanceStep]);

    // 마운트 시 다음 운동 영상 prefetch — 브레이크는 건너뛴다
    useEffect(() => {
        const upcoming = findNextVideoUrl(exercises, 1);
        if (upcoming) prefetchVideo(upcoming);
    }, [exercises]);

    const togglePause = useCallback(() => setIsPaused(p => !p), []);

    const goToStep = useCallback((idx: number) => {
        if (idx < 0 || idx >= totalSteps) return;
        setStepIndex(idx);
        setCountdown(exercises[idx].durationSeconds);
        setIsFinished(false);
        beepFiredRef.current = false;
    }, [exercises, totalSteps]);

    const restart = useCallback(() => goToStep(0), [goToStep]);

    /** 브레이크 스텝 중 사용자가 "건너뛰기" 를 누르면 즉시 다음 스텝으로 */
    const skipBreak = useCallback(() => {
        if (currentStep.kind !== 'break') return;
        advanceStep();
    }, [currentStep, advanceStep]);

    return { currentStep, nextStep, countdown, isPaused, progress, stepProgress, stepIndex, totalSteps, isFinished, togglePause, goToStep, restart, skipBreak };
};
