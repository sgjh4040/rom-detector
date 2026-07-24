// ExerciseVideoModal.tsx — CesInfo 운동 영상 라이트박스 모달 (redesign-spike).
// 카드의 재생 버튼 클릭 시 오버레이로 영상 표시. ESC/배경 클릭/X 로 닫기.
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { CesExercise } from "../../lib/ces/cesTypes";
import { CesExerciseVideo } from "../../core/components/CesExerciseVideo";

interface ExerciseVideoModalProps {
  exercise: CesExercise | null;
  onClose: () => void;
}

export const ExerciseVideoModal: React.FC<ExerciseVideoModalProps> = ({
  exercise,
  onClose,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // 열려 있는 동안 ESC 로 닫기 + 배경 스크롤 잠금 + 닫기 버튼 포커스
  useEffect(() => {
    if (!exercise) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [exercise, onClose]);

  if (!exercise) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${exercise.name} 운동 영상`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <h2 className="min-w-0 truncate text-base font-bold tracking-tight text-[var(--color-foreground)]">
            {exercise.name}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="영상 닫기"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="aspect-video w-full bg-black">
          <CesExerciseVideo
            source={exercise.youtubeId}
            title={exercise.name}
            objectFit="contain"
            clickToPlay
          />
        </div>

        {exercise.description && (
          <p className="px-5 py-4 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
            {exercise.description}
          </p>
        )}
      </div>
    </div>
  );
};
