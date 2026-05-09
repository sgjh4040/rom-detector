// romExercises.ts — 관절별 운동 처방 + 폴백 운동 (audit #13: romData.ts 분리).
// 스트레칭/근력 강화 두 종류로 분류. 특정 관절 데이터가 없으면 FALLBACK_* 사용.
import type { Exercise } from "./romTypes";

export const EXERCISES: Record<string, Exercise[]> = {
  shoulder: [
    {
      id: "sh_str_1",
      title: "관절가동범위 회복 벽 밀기",
      description: "벽에 두 손을 얹고 천천히 뒤로 물러나며 어깨를 아래로 눌러줍니다. 15초 유지 3회 반복.",
      type: "stretching",
      imageUrl: "/stretching_exercise.jpg",
    },
    {
      id: "sh_stg_1",
      title: "밴드를 이용한 외회전 강화",
      description: "밴드를 고정하고 팔꿈치를 옆구리에 붙인 상태에서 바깥쪽으로 당깁니다. 15회 3세트.",
      type: "strengthening",
      level: "초급",
      imageUrl: "/strength_training.jpg",
    },
  ],
  elbow: [
    {
      id: "el_str_1",
      title: "삼두근 스트레칭",
      description: "한 손으로 다른 팔의 팔꿈치를 잡고 머리 뒤로 넘기며 스트레칭합니다. 15초 3세트.",
      type: "stretching",
      imageUrl: "/stretching_exercise.jpg",
    },
  ],
  wrist: [
    {
      id: "wr_str_1",
      title: "손목 굴곡근 스트레칭",
      description: "팔을 쭉 펴고 손바닥이 위를 향하게 한 뒤, 반대 손으로 손가락을 몸 쪽으로 당겨줍니다.",
      type: "stretching",
      imageUrl: "/stretching_exercise.jpg",
    },
  ],
  hip: [
    {
      id: "hp_str_1",
      title: "이상근 스트레칭",
      description: "누운 자세에서 한쪽 다리를 굽혀 반대쪽 무릎 위에 올리고, 가슴 쪽으로 당겨줍니다.",
      type: "stretching",
      imageUrl: "/stretching_exercise.jpg",
    },
    {
      id: "hp_stg_1",
      title: "중둔근 강화 운동 (크램쉘)",
      description: "옆으로 누워 무릎을 굽히고 발뒤꿈치를 붙인 상태에서 위쪽 무릎을 벌려줍니다. 15회 3세트.",
      type: "strengthening",
      level: "초급",
      imageUrl: "/strength_training.jpg",
    },
  ],
  knee: [
    {
      id: "kn_str_1",
      title: "대퇴사두근 스트레칭",
      description: "서서 한쪽 발목을 잡고 엉덩이 쪽으로 당겨줍니다. 무릎이 너무 벌어지지 않게 주의합니다.",
      type: "stretching",
      imageUrl: "/stretching_exercise.jpg",
    },
    {
      id: "kn_stg_1",
      title: "의자에서 무릎 펴기",
      description: "의자에 앉아 한쪽 다리를 일자로 펴고 3초간 버틴 후 내립니다. 15회 3세트.",
      type: "strengthening",
      level: "초급",
      imageUrl: "/strength_training.jpg",
    },
  ],
  ankle: [
    {
      id: "ak_str_1",
      title: "종아리 스트레칭",
      description: "벽을 짚고 서서 한쪽 발을 뒤로 빼고 발뒤꿈치를 바닥에 붙인 채 앞무릎을 굽혀줍니다.",
      type: "stretching",
      imageUrl: "/stretching_exercise.jpg",
    },
  ],
  waist: [
    {
      id: "ws_str_1",
      title: "고양이-소 자세 스트레칭",
      description: "네발기기 자세에서 등을 둥글게 말았다가 천천히 펴주며 척추를 이완합니다. 10회 2세트.",
      type: "stretching",
      imageUrl: "/stretching_exercise.jpg",
    },
    {
      id: "ws_str_2",
      title: "아기 자세 (Child Pose)",
      description: "무릎을 꿇고 앉아 상체를 앞으로 숙여 허리 하부 근육을 부드럽게 늘려줍니다. 30초 유지.",
      type: "stretching",
      imageUrl: "/stretching_exercise.jpg",
    },
    {
      id: "ws_stg_1",
      title: "데드버그 코어 강화",
      description: "누운 자세에서 팔다리를 교차로 내리며 복부와 코어를 강화합니다. 12회 3세트.",
      type: "strengthening",
      level: "초급",
      imageUrl: "/strength_training.jpg",
    },
    {
      id: "ws_stg_2",
      title: "버드독 등척성 유지",
      description: "네발기기 자세에서 한쪽 팔과 반대쪽 다리를 들어 수평을 유지합니다. 10초 유지 5회.",
      type: "strengthening",
      level: "초급",
      imageUrl: "/strength_training.jpg",
    },
  ],
};

// 특정 관절 데이터가 없을 때 사용하는 기본 처방 [PRD 3-2 폴백 처리]
export const FALLBACK_STRETCHING: Exercise = {
  id: "fb_str",
  title: "전신 이완 스트레칭",
  description: "편안한 자세에서 호흡과 함께 긴장된 근육을 풀어줍니다.",
  type: "stretching",
  imageUrl: "/stretching_exercise.jpg",
};

export const FALLBACK_STRENGTHENING: Exercise = {
  id: "fb_stg",
  title: "등척성 근력 운동",
  description: "관절의 움직임 없이 근육에 일정한 힘을 주어 버티는 운동입니다.",
  type: "strengthening",
  level: "초급",
  imageUrl: "/strength_training.jpg",
};
