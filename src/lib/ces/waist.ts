// waist.ts — 허리 CES 데이터 [PRD 4-0: 200줄 이하]
import { ex } from './cesTypes';
import type { JointCesData } from './cesTypes';

/**
 * 허리(Waist) CES 데이터
 * 주로 하부 교차 증후근(Lower Crossed Syndrome)과 관련된 근육 불균형을 다룹니다.
 */
export const WAIST_CES: JointCesData = {
    muscleMap: {
        lumbar_lordosis: {
            overactive: ['장요근', '요근', '대퇴직근', '척추기립근'],
            underactive: ['대둔근', '복근(복직근)', '내복사근']
        },
        pelvic_tilt: {
            overactive: ['장요근', '대퇴막장근', '허리 사각근'],
            underactive: ['중둔근', '외복사근', '복직근']
        },
    },
    protocol: {
        lumbar_lordosis: {
            inhibit: [
                ex('ws_inh_lord1', '척추기립근 SMR', '폼롤러를 허리 뒤쪽에 대고 천천히 하체 힘으로 롤링하며 척추기립근의 긴장을 풀어줍니다.', '', { tools: '폼롤러', holdSeconds: 40 }),
                ex('ws_inh_lord2', '장요근 마사지 볼 압박', '엎드린 상태에서 골반 앞쪽 깊숙한 부위(장요근)에 마사지 볼을 대고 30-60초간 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 40 })
            ],
            lengthen: [
                ex('ws_len_lord1', '장요근 런지 스트레칭', '한쪽 무릎을 바닥에 대고 반대쪽 다리를 앞으로 굽혀 골반 앞쪽을 늘려줍니다.', '', { holdSeconds: 30, sets: 2 }),
                ex('ws_len_lord2', '고양이-소 자세 (허리 이완)', '네발기기 자세에서 등을 둥글게 말았다가 천천히 펴주며 허리의 가동성을 확보합니다.', '', { sets: 2, reps: 10 })
            ],
            activate: [
                ex('ws_act_lord1', '데드버그 (복부 활성화)', '누워서 팔다리를 번갈아 내리며 허리가 바닥에서 뜨지 않게 조절하여 심부 복근을 활성화합니다.', '', { sets: 3, reps: 12 }),
                ex('ws_act_lord2', '브릿지 (둔근 활성화)', '누워 무릎을 굽힌 채 엉덩이를 들어 올려 둔근의 힘을 인지합니다.', '', { sets: 3, reps: 15 })
            ],
        },
        pelvic_tilt: {
            inhibit: [
                ex('ws_inh_tilt1', '대퇴근막장근 SMR', '폼롤러를 고관절 측면에 대고 옆으로 누워 대퇴근막장근 부위를 굴려줍니다.', '', { tools: '폼롤러', holdSeconds: 30 })
            ],
            lengthen: [
                ex('ws_len_tilt1', '이상근 스트레칭', '앉거나 누운 자세에서 한쪽 발을 반대쪽 무릎 위에 올리고 가슴 쪽으로 당겨줍니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('ws_act_tilt1', '클램쉘 (중둔근 활성화)', '옆으로 누워 무릎을 굽히고 조개껍데기처럼 위쪽 다리를 벌려 중둔근을 강화합니다.', '', { sets: 3, reps: 15 })
            ],
        },
    },
    integrate: [
        ex('ws_int1', '버드독 (Bird-Dog)', '네발기기 자세에서 반대쪽 팔과 다리를 동시에 뻗어 코어의 안정성을 유지합니다.', '', { sets: 3, reps: 10 }),
        ex('ws_int2', '플랭크', '팔꿈치로 몸을 지탱하며 머리부터 발끝까지 일직선을 유지하여 코어 전체를 통합합니다.', '', { holdSeconds: 30, sets: 3 }),
    ],
};
