// hip.ts — 고관절 CES 데이터
import { ex } from './cesTypes';
import type { JointCesData } from './cesTypes';

export const HIP_CES: JointCesData = {
    muscleMap: {
        flexion: { overactive: ['대둔근', '슬굴곡근(반건양·반막양·대퇴이두)'], underactive: ['장요근', '대퇴직근', '봉공근'] },
        extension: { overactive: ['장요근', '대퇴직근', '대퇴근막장근(TFL)'], underactive: ['대둔근', '슬굴곡근'] },
        abduction: { overactive: ['내전근군(장·단·대내전근, 박근)', '치골근'], underactive: ['중둔근', '소둔근', '대퇴근막장근(TFL)'] },
        adduction: { overactive: ['대퇴근막장근(TFL)', '중둔근', '소둔근'], underactive: ['내전근군(장·단내전근, 박근)'] },
        internal_rotation: { overactive: ['이상근', '폐쇄근(내·외)', '상·하쌍둥이근', '대퇴방형근'], underactive: ['대퇴근막장근(TFL)', '중둔근(전면부)'] },
        external_rotation: { overactive: ['대퇴근막장근(TFL)', '중둔근(전면부)'], underactive: ['이상근', '폐쇄근', '쌍둥이근'] },
    },
    protocol: {
        flexion: {
            inhibit: [
                ex('hp_inh_flex1', '대둔근 SMR', '폼롤러를 둔부 아래에 놓고 체중을 실어 대둔근을 롤링합니다.', '', { tools: '폼롤러', holdSeconds: 40 }),
                ex('hp_inh_flex2', '햄스트링 SMR', '폼롤러를 허벅지 뒤쪽에 대고 허벅지 전체를 롤링합니다.', '', { tools: '폼롤러', holdSeconds: 40 })
            ],
            lengthen: [
                ex('hp_len_flex1', '누운 자세 대둔근 스트레칭', '누운자세에서 무릎이 가슴에 닿도록 감싸 30초 늘립니다.', '', { holdSeconds: 30, sets: 2 }),
                ex('hp_len_flex2', '누운 자세 햄스트링 스트레칭', '누운 상태에서 한쪽 무릎을 펴고 수건을 발에 걸어 다리를 30초 들어올립니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('hp_act_flex1', '장요근 활성화 (밴드)', '선 자세에서 밴드를 발목에 감고 무릎을 가슴 높이까지 들어올립니다.', '', { tools: '탄성 밴드', sets: 3, reps: 12 })
            ],
        },
        extension: {
            inhibit: [
                ex('hp_inh_ext1', '장요근 SMR', '마사지볼에 엎드려 골반 앞쪽(서혜부 위)을 30-40초 압박합니다. -', '', { tools: '마사지볼', holdSeconds: 40 }),
                ex('hp_inh_ext2', '대퇴직근 SMR', '폼롤러를 허벅지 앞쪽에 대고 엎드려 롤링합니다.', '', { tools: '폼롤러', holdSeconds: 40 })
            ],
            lengthen: [
                ex('hp_len_ext1', '런지 자세 장요근 스트레칭', '런지 자세에서 앞 무릎을 90°로 굽히고 골반을 앞으로 밀어 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 }),
                ex('hp_len_ext2', '토마스 테스트 스트레칭', '테이블 끝에 누워 한 무릎을 가슴으로 당기고 다른 다리는 자연스럽게 내려뜨립니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('hp_act_ext1', '힙 브릿지', '누운 자세에서 발바닥으로 바닥을 밀어 둔부를 최대한 높이 들어올립니다.', '', { sets: 3, reps: 15 }),
                ex('hp_act_ext2', '루마니안 데드리프트 (봉)', '밴드를 발로 밟고 상체를 앞으로 기울였다 세우며 대둔근·햄스트링을 활성화합니다.', '', { tools: '봉', sets: 3, reps: 12 })
            ],
        },
        abduction: {
            inhibit: [
                ex('hp_inh_abd1', '내전근 SMR', '폼롤러를 허벅지 안쪽에 대고 엎드려 내전근을 롤링합니다.', '', { tools: '폼롤러', holdSeconds: 40 })
            ],
            lengthen: [
                ex('hp_len_abd1', '내전근 스트레칭 (나비 자세)', '앉아서 발바닥을 마주 붙이고 무릎을 바닥 쪽으로 내린다음, 몸통을 앞으로 숙여 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('hp_act_abd1', '크램쉘 (Clamshell)', '옆으로 누워 무릎을 굽히고 발뒤꿈치를 붙인 채 위쪽 무릎을 벌립니다.', '', { sets: 3, reps: 15 })
            ],
        },
        adduction: {
            inhibit: [
                ex('hp_inh_add1', 'TFL SMR', '폼롤러를 엉덩이 옆쪽에 대고 It-band 부위를 롤링합니다.', '', { tools: '폼롤러', holdSeconds: 40 })
            ],
            lengthen: [
                ex('hp_len_add1', 'TFL 스트레칭', '벽에 서서 한쪽 다리를 반대편 앞으로 교차하고 측면으로 기울여 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('hp_act_add1', '내전근 수축 (등척성)', '등을 대고 누운 자세에서 무릎 사이에 폼롤러를 끼우고 5초 이상 꽉 쥡니다.', '', { tools: '폼롤러', holdSeconds: 5, sets: 3, reps: 12 })
            ],
        },
        internal_rotation: {
            inhibit: [
                ex('hp_inh_ir1', '이상근 SMR', '마사지 볼을 둔부 깊숙이(이상근 위치)에 대고 다리를 4자 모양으로 얹어 30-60초 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 50 })
            ],
            lengthen: [
                ex('hp_len_ir1', '누운자세 이상근 스트레칭', '누운자세에서 한 발목을 반대편 무릎위에 올리고 허벅지 뒷부분을 잡아 가슴쪽으로 당겨 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('hp_act_ir1', '내회전 밴드 강화', '밴드를 발목에 감고 의자에 앉은 자세에서 발을 천장 방향으로 회전합니다.', '', { tools: '탄성 밴드', sets: 3, reps: 12 })
            ],
        },
        external_rotation: {
            inhibit: [
                ex('hp_inh_er1', '내전근 SMR', '폼롤러를 허벅지 안쪽에 대고 엎드려 내전근을 롤링합니다.', '', { tools: '폼롤러', holdSeconds: 40 })
            ],
            lengthen: [
                ex('hp_len_er1', '누운자세 4자 스트레칭', '누운상태에서 한쪽 무릎을 구부리고 구부린쪽 무릎을 바닥에 닿게해 30초 스트레칭합니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('hp_act_er1', '외회전 밴드 강화 (클램쉘 응용)', '밴드를 무릎 위에 감고 클램쉘 동작으로 외회전을 강화합니다.', '', { tools: '탄성 밴드', sets: 3, reps: 15 })
            ],
        },
    },
    integrate: [
        ex('hp_int1', '밴드 워킹 (측면 보행)', '밴드를 무릎 위에 감고 옆으로 걸어 중둔근과 고관절 전체 안정화를 훈련합니다.', '', { tools: '탄성 밴드', sets: 3, reps: 12 }),
        ex('hp_int2', '스쿼트 투 로우', '밴드를 고정하고 스쿼트 하강 시 로우 동작을 더해 하체·고관절 전체 협응을 훈련합니다.', '', { tools: '탄성 밴드', sets: 3, reps: 10 }),
    ],
};
