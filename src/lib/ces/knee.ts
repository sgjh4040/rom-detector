// knee.ts — 무릎 CES 데이터
import { ex } from './cesTypes';
import type { JointCesData } from './cesTypes';

export const KNEE_CES: JointCesData = {
    muscleMap: {
        flexion: { overactive: ['대퇴사두근(대퇴직근 포함)', 'IT밴드·대퇴근막장근', '슬개건'], underactive: ['슬굴곡근(대퇴이두·반건양·반막양근)'] },
        extension: { overactive: ['슬굴곡근', '비복근', '슬와근'], underactive: ['대퇴사두근(대퇴직근·내측광근·외측광근·중간광근)'] },
    },
    protocol: {
        flexion: {
            inhibit: [
                ex('kn_inh_flex1', '대퇴사두근 SMR', '폼롤러를 허벅지 앞쪽에 대고 엎드려 대퇴 전면 전체를 롤링합니다.', '', { tools: '폼롤러', holdSeconds: 40 }),
                ex('kn_inh_flex2', 'IT밴드 SMR', '폼롤러를 허벅지 외측에 대고 옆으로 누워 무릎 위까지 롤링합니다.', '', { tools: '폼롤러', holdSeconds: 40 })
            ],
            lengthen: [
                ex('kn_len_flex1', '대퇴사두근 스트레칭', '서서 한쪽 발목을 잡고 엉덩이 쪽으로 부드럽게 당겨 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 }),
                ex('kn_len_flex2', '대퇴직근 스트레칭 (런지)', '런지 자세에서 앞발에 무게를 실어 뒷다리 앞쪽을 30초 늘립니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('kn_act_flex1', '햄스트링 컬 (밴드)', '엎드린 자세에서 밴드를 발목에 감고 무릎을 천천히 굽혀 햄스트링 수축합니다.', '', { tools: '탄성 밴드', sets: 3, reps: 15 })
            ],
        },
        extension: {
            inhibit: [
                ex('kn_inh_ext1', '햄스트링 SMR', '폼롤러를 허벅지 뒤쪽에 대고 앉아  전체를 햄스트링 전체를 롤링합니다.', '', { tools: '폼롤러', holdSeconds: 40 }),
                ex('kn_inh_ext2', '비복근 SMR', '폼롤러를 종아리 아래에 대고 종아리~무릎 뒤까지 롤링합니다.', '', { tools: '폼롤러', holdSeconds: 40 })
            ],
            lengthen: [
                ex('kn_len_ext1', '햄스트링 스트레칭', '누운 자세에서 수건을 발에 걸고 무릎을 가능한 펴며 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 }),
                ex('kn_len_ext2', '비복근 스트레칭', '벽을 짚고 한쪽 발을 뒤로 빼 발뒤꿈치를 바닥에 붙인 채 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('kn_act_ext1', '의자 무릎 신전 (밴드)', '의자에 앉아 한쪽 다리를 천천히 펴고 3초 버틴 후 내립니다.', '', { tools: '탄성 밴드', holdSeconds: 3, sets: 3, reps: 15 }),
                ex('kn_act_ext2', '미니 스쿼트', '발 너비로 서서 무릎을 30° 굽혔다 펴줍니다.', '', { holdSeconds: 15, sets: 3 })
            ],
        },
    },
    integrate: [
        ex('kn_int1', '스텝업', '계단 한 칸을 이용해 한발로 올라서고 내려오는 동작으로 무릎 전체 협응을 훈련합니다.', '', { sets: 3, reps: 12 }),
        ex('kn_int2', '스쿼트', '발 너비로 서서 천천히 앉았다 일어서며 무릎·고관절·발목 협응 패턴을 훈련합니다.', '', { sets: 3, reps: 12 }),
    ],
};
