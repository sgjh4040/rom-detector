// elbow.ts — 팔꿈치 CES 데이터
import { ex } from './cesTypes';
import type { JointCesData } from './cesTypes';

export const ELBOW_CES: JointCesData = {
    muscleMap: {
        flexion: { overactive: ['삼두근(장두·내측두·외측두)', '주근'], underactive: ['이두근', '상완근', '상완요골근'] },
        extension: { overactive: ['이두근', '상완근', '상완요골근'], underactive: ['삼두근(장두·외측두·내측두)'] },
        supination: { overactive: ['원형 회내근', '방형 회내근'], underactive: ['회외근', '이두근(회외 기능)'] },
        pronation: { overactive: ['회외근', '이두근(회외 기능)'], underactive: ['원형 회내근', '방형 회내근'] },
    },
    protocol: {
        flexion: {
            inhibit: [
                ex('el_inh_flex1', '삼두근 SMR', '폼롤러를 상완 후면에 대고 팔을 뻗은 채 삼두근을 롤링합니다.', '', { tools: '폼롤러', holdSeconds: 30 })
            ],
            lengthen: [
                ex('el_len_flex1', '삼두근 스트레칭', '한 손으로 반대 팔꿈치를 잡아 머리 뒤로 넘기고 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('el_act_flex1', '이두근 컬 (밴드)', '밴드를 발로 밟고 천천히 팔꿈치를 굽혀 이두근을 수축합니다.', '', { tools: '탄성 밴드', sets: 3, reps: 12 })
            ],
        },
        extension: {
            inhibit: [
                ex('el_inh_ext1', '이두근 SMR', '반대 손이나 마사지 볼로 상완 이두근 부위를 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 30 })
            ],
            lengthen: [
                ex('el_len_ext1', '이두근 스트레칭', '벽에 손바닥을 대고 팔을 뒤로 돌려 이두근을 30초 늘입니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('el_act_ext1', '삼두근 킥백 (밴드)', '상체를 앞으로 숙이고 팔꿈치를 고정한 채 팔을 뒤로 뻗어 삼두근을 수축합니다.', '', { tools: '탄성 밴드', sets: 3, reps: 12 })
            ],
        },
        supination: {
            inhibit: [
                ex('el_inh_sup1', '전완 회내근 SMR', '마사지 볼로 전완 내측(회내근 부위)을 30초 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 30 })
            ],
            lengthen: [
                ex('el_len_sup1', '전완 회내근 스트레칭', '팔꿈치를 굽힌 상태에서 손바닥이 위를 향하도록 천천히 회전하며 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('el_act_sup1', '전완 회외근 강화', '밴드를 잡고 팔꿈치를 옆구리에 고정한 채 손바닥이 위를 향하도록 회전합니다.', '', { tools: '탄성 밴드', sets: 3, reps: 15 })
            ],
        },
        pronation: {
            inhibit: [
                ex('el_inh_pro1', '전완 회외근 SMR', '마사지 볼로 전완 외측(회외근 부위)을 30초 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 30 })
            ],
            lengthen: [
                ex('el_len_pro1', '전완 회외근 스트레칭', '팔꿈치를 굽힌 상태에서 손바닥이 아래를 향하도록 회전하며 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('el_act_pro1', '전완 회내근 강화', '밴드를 잡고 팔꿈치를 옆구리에 고정한 채 손바닥이 아래를 향하도록 회전합니다.', '', { tools: '탄성 밴드', sets: 3, reps: 15 })
            ],
        },
    },
    integrate: [
        ex('el_int1', '팔꿈치 굴신 + 전완 회전 복합 동작', '천천히 팔꿈치를 굽히면서 동시에 전완을 회외로 돌리고, 펼 때 회내로 돌립니다.', '', { sets: 3, reps: 10 }),
        ex('el_int2', '다관절 로우 (밴드)', '밴드로 팔꿈치 굴곡과 견갑 후인을 동시에 수행합니다.', '', { tools: '탄성 밴드', sets: 3, reps: 10 }),
    ],
};
