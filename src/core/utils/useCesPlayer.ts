// useCesPlayer.ts — NTC 플레이어 상태·타이머·자동 전환 훅 (PRD 4-0: 200줄 이하)
import { useState, useEffect, useRef, useCallback } from 'react';
import type { CesRoutine, CesExerciseStep } from '../../lib/ces/CesPlayerTypes';
import type { CesStage } from '../../lib/ces/cesTypes';
import { updatePhaseDuration } from '../../features/session/data/cesTimeTracker';

export interface UseCesPlayerReturn {
    currentStep: CesExerciseStep;
    nextStep: CesExerciseStep | null;
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

    // 전체 경과 초 계산
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
            if (exercises[next + 1]) prefetchVideo(exercises[next + 1].videoUrl);
            return next;
        });
    }, [exercises, totalSteps]);

    /** 타이머 tick */
    useEffect(() => {
        if (isPaused || isFinished) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }
        timerRef.current = setInterval(() => {
            // side effect는 updater 바깥에서 — StrictMode 이중 호출 방지
            if (countdownRef.current > 0) {
                const stage = currentStep.cesPhase.toLowerCase() as CesStage;
                updatePhaseDuration(stage, 1, sessionCreatedAt);
            }
            setCountdown(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isPaused, isFinished, currentStep.cesPhase, sessionCreatedAt]);

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

    // 마운트 시 다음 영상 prefetch
    useEffect(() => {
        if (exercises[1]) prefetchVideo(exercises[1].videoUrl);
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

    return { currentStep, nextStep, countdown, isPaused, progress, stepProgress, stepIndex, totalSteps, isFinished, togglePause, goToStep, restart };
};
