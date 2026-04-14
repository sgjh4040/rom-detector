// shoulder.ts — 어깨 CES 데이터 [PRD 4-0: 200줄 이하]
import { ex } from './cesTypes';
import type { JointCesData } from './cesTypes';

export const SHOULDER_CES: JointCesData = {
    muscleMap: {
        flexion: { overactive: ['소흉근', '전방삼각근', '오훼완근'], underactive: ['하부승모근', '전거근', '후방삼각근'] },
        extension: { overactive: ['광배근', '대원근', '소원근'], underactive: ['전방삼각근', '오훼완근'] },
        abduction: { overactive: ['상부승모근', '견갑거근', '소흉근'], underactive: ['중부승모근', '전거근', '극상근'] },
        adduction: { overactive: ['중부승모근', '극상근', '삼각근'], underactive: ['광배근', '대원근', '대흉근'] },
        internal_rotation: { overactive: ['후방관절낭', '극하근', '소원근'], underactive: ['견갑하근'] },
        external_rotation: { overactive: ['견갑하근', '대흉근(전면부)'], underactive: ['극하근', '소원근', '후방삼각근'] },
    },
    protocol: {
        flexion: {
            inhibit: [
                ex('sh_inh_flex1', '대흉근 SMR', '마사지 볼을 대흉근(앞쪽 가슴부위)에 대고 30-60초 지그시 압박합니다.', 'Xh1zz52efS0', { tools: '마사지 볼', holdSeconds: 40 }),
                ex('sh_inh_flex2', '광배근 SMR', '마사지 볼로 광배근(등 뒤가쪽 부위)에 천천히 롤링합니다.', '', { tools: '마사지 볼', holdSeconds: 30 })
            ],
            lengthen: [
                ex('sh_len_flex1', '대흉근 문틀 스트레칭', '문틀에 팔꿈치를 90°로 얹고 앞으로 천천히 기울여 가슴 앞쪽을 늘입니다. 30초 유지.', 'QSBT7wNO-gI', { holdSeconds: 30, sets: 2 }),
                ex('sh_len_flex2', '흉추 신전 스트레칭', '폼롤러를 등 어깨뼈 높이에 놓고 양손을 뒤통수에 받친 채 천천히 뒤로 누워 흉추를 신전합니다.', 'f_oZmt8uT6Q', { tools: '폼롤러', holdSeconds: 30 })
            ],
            activate: [
                ex('sh_act_flex1', '어깨 굽힘 운동 (밴드)', '선 자세에서 밴드를 손에 묶고 팔꿈치를 편상태에서 팔을 귀옆까지 올립니다. .', '', { sets: 3, reps: 12 }),
                ex('sh_act_flex2', '전거근 활성화 (Push-Up Plus)', '팔굽혀펴기 자세에서 상체를 완전히 올린 뒤 견갑골을 앞으로 더 밀어냅니다.', 'RFbjeyq_ZPc', { sets: 3, reps: 10 })
            ],
        },
        extension: {
            inhibit: [
                ex('sh_inh_ext1', '전방삼각근 SMR', '마사지볼을 어깨 앞쪽부위에 대고 롤링합니다.', '', { tools: '마사지볼', holdSeconds: 40 })
            ],
            lengthen: [
                ex('sh_len_ext1', '전방삼각근 스트레칭', '문틀이나 기둥을 한 손으로 잡고 반대쪽으로 체중을 실어 옆구리~등을 늘입니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('sh_act_ext1', '광배근 밴드 신전', '문고리에 밴드를 걸고 팔꿈치를 편상태에서 팔을 뒤로 보냅니다', '', { tools: '탄성 밴드', sets: 3, reps: 12 })
            ],
        },
        abduction: {
            inhibit: [
                ex('sh_inh_abd1', '대흉근 SMR', '마사지 볼을 대흉근(앞쪽 가슴부위)에 대고 30-60초 지그시 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 40 }),
                ex('sh_inh_abd2', '광배근 SMR', '마사지 볼로 광배근(등 뒤가쪽 부위)에 천천히 롤링합니다.', '', { tools: '마사지 볼', holdSeconds: 30 })
            ],
            lengthen: [
                ex('sh_len_abd1', '대흉근 문틀 스트레칭', '문틀에 팔꿈치를 90°로 얹고 앞으로 천천히 기울여 가슴 앞쪽을 늘입니다. 30초 유지.', '', { holdSeconds: 30, sets: 2 }),
                ex('sh_len_abd2', '손가락 사다리', '코너 벽에 옆으로 서서 손가락으로 벽을 탑니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('sh_act_abd1', 'Y자 하부승모근 활성화', '엎드린 자세에서 양팔을 Y자로 들어 천장 방향으로 올립니다. 2초 유지 후 내립니다.', '', { sets: 3, reps: 12 })
            ],
        },
        adduction: {
            inhibit: [
                ex('sh_inh_add1', '삼각근 SMR', '반대 손이나 마사지 볼로 삼각근 전체를 부드럽게 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 30 })
            ],
            lengthen: [
                ex('sh_len_add1', '측면 삼각근 스트레칭', '한팔을 가슴 앞으로 뻗고 반대 팔로 30초 당겨줍니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('sh_act_add1', '광배근 밴드 풀다운', '밴드를 머리 위에 고정하고 팔꿈치를 옆구리로 당깁니다.', '', { tools: '탄성 밴드', sets: 3, reps: 12 })
            ],
        },
        internal_rotation: {
            inhibit: [
                ex('sh_inh_ir1', '극하근 SMR', '마사지 볼을 어깨뼈 후면(극하와)에 대고 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 40 })
            ],
            lengthen: [
                ex('sh_len_ir1', '후방 관절낭 스트레칭 (Cross-Body)', '한팔을 가슴 앞으로 뻗고 반대 손으로 팔꿈치를 잡아 몸 쪽으로 30초 당깁니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('sh_act_ir1', '밴드 내회전', '밴드를 고정하고 팔꿈치 90° 상태에서 안쪽으로 천천히 당깁니다.', '', { tools: '탄성 밴드', sets: 3, reps: 15 })
            ],
        },
        external_rotation: {
            inhibit: [
                ex('sh_inh_er1', '견갑하근 SMR', '마사지 볼로 겨드랑이 앞벽(견갑하근)을 부드럽게 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 30 })
            ],
            lengthen: [
                ex('sh_len_er1', '외회전 스트레칭(봉)', '봉을 이용해 한쪽손을 옆구리에 붙이고 반대쪽손으로 한쪽손을 밀어 몸 바깥쪽으로 돌아가게 만듭니다.', '', { tools: '봉', holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('sh_act_er1', '밴드 외회전', '팔꿈치를 옆구리에 고정하고 밴드를 바깥쪽으로 천천히 당깁니다.', '', { tools: '탄성 밴드', sets: 3, reps: 15 })
            ],
        },
    },
    integrate: [
        ex('sh_int1', '케이블 외회전 투 프레스', '밴드로 외회전 동작 후 팔을 위로 프레스하여 어깨 전체 협응을 훈련합니다.', '', { tools: '탄성 밴드', sets: 3, reps: 10 }),
        ex('sh_int2', 'Y-T-W 복합 동작', '엎드린 상태에서 Y → T → W 순으로 연속 동작하며 어깨 안정화 근육군을 통합 활성화합니다.', '', { sets: 2, reps: 8 }),
    ],
};
