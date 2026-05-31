// CesPlayerPage.tsx — CES 가이드 플레이어 진입점.
// 빈 루틴 가드만 담당하고, 본문은 CesPlayerView 에 위임 (Rules of Hooks 준수:
// useCesPlayer 는 항상 마운트되는 자식에서만 호출 → 조건부 훅 호출 회피).
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import { EmptyState } from "../core/components/EmptyState";
import { MOCK_ROUTINE } from "../lib/ces/CesPlayerTypes";
import type { CesRoutine } from "../lib/ces/CesPlayerTypes";
import { CesPlayerView } from "./cesPlayerPage/CesPlayerView";

export const CesPlayerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const customRoutine =
    (location.state?.customRoutine as CesRoutine) || MOCK_ROUTINE;

  // 빈 루틴 방어 — exercises 가 비면 플레이어가 currentStep undefined 로 크래시.
  // 정상 경로(가이드 운동 시작 / MOCK)에선 도달 안 하지만, 미래에 운동 없는
  // 관절·빌더 버그 시 흰 화면 대신 안내를 보여준다.
  if (!customRoutine.exercises || customRoutine.exercises.length === 0) {
    return (
      <EmptyState
        size="lg"
        fullScreen
        icon={<Dumbbell size={44} strokeWidth={1.8} />}
        title="표시할 운동이 없어요"
        description="이 루틴에 등록된 운동이 없습니다. CES 프로토콜에서 단계별 운동을 확인해 주세요."
        cta={{
          label: "CES 프로토콜로",
          variant: "pill",
          onClick: () => navigate("/ces"),
        }}
      />
    );
  }

  return <CesPlayerView routine={customRoutine} />;
};
