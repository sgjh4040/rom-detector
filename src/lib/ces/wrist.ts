// wrist.ts — 손목 CES 데이터
import { ex } from './cesTypes';
import type { JointCesData } from './cesTypes';

export const WRIST_CES: JointCesData = {
    muscleMap: {
        flexion: { overactive: ['요측수근신근(ECRL·ECRB)', '척측수근신근(ECU)', '총지신근'], underactive: ['요측수근굴근(FCR)', '척측수근굴근(FCU)', '장장근'] },
        extension: { overactive: ['요측수근굴근(FCR)', '척측수근굴근(FCU)', '장장근'], underactive: ['요측수근신근(ECRL·ECRB)', '척측수근신근(ECU)'] },
        radial_deviation: { overactive: ['척측수근굴근(FCU)', '척측수근신근(ECU)'], underactive: ['요측수근굴근(FCR)', '장요측수근신근(ECRL)'] },
        ulnar_deviation: { overactive: ['요측수근굴근(FCR)', '장요측수근신근(ECRL)'], underactive: ['척측수근굴근(FCU)', '척측수근신근(ECU)'] },
    },
    protocol: {
        flexion: {
            inhibit: [
                ex('wr_inh_flex1', '손목 신전근 SMR', '마사지 볼로 전완 뒤쪽 신전근 부위를 30초 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 30 })
            ],
            lengthen: [
                ex('wr_len_flex1', '손목 신전근 스트레칭', '팔을 앞으로 뻗고 손바닥이 아래를 향하게 한 뒤 반대 손으로 손가락을 몸 쪽으로 30초 당깁니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('wr_act_flex1', '손목 굴곡 강화 (밴드)', '밴드를 잡고 손목을 손바닥 방향으로 천천히 굽혔다 폅니다.', '', { tools: '탄성 밴드', sets: 3, reps: 15 })
            ],
        },
        extension: {
            inhibit: [
                ex('wr_inh_ext1', '손목 굴곡근 SMR', '마사지 볼로 전완 앞쪽 굴곡근 부위를 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 30 })
            ],
            lengthen: [
                ex('wr_len_ext1', '손목 굴곡근 스트레칭', '팔을 앞으로 뻗고 손등이 위를 향하게 한 뒤 반대 손으로 손가락을 몸 쪽으로 30초 당깁니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('wr_act_ext1', '손목 신전 강화 (밴드)', '밴드를 잡고 손목을 손등 방향으로 천천히 젖혔다 폅니다.', '', { tools: '탄성 밴드', sets: 3, reps: 15 })
            ],
        },
        radial_deviation: {
            inhibit: [
                ex('wr_inh_rad1', '척측 근육 SMR', '마사지 볼로 전완 척측(새끼손가락 쪽) 근육을 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 30 })
            ],
            lengthen: [
                ex('wr_len_rad1', '요측 편위 스트레칭', '손목을 엄지 방향으로 부드럽게 기울여 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('wr_act_rad1', '요측 편위 강화', '가벼운 아령을 기립자세에서 잡고 손목을 엄지 방향으로 올립니다.', '', { tools: '아령', sets: 3, reps: 12 })
            ],
        },
        ulnar_deviation: {
            inhibit: [
                ex('wr_inh_uln1', '요측 근육 SMR', '마사지 볼로 전완 요측(엄지손가락 쪽) 근육을 압박합니다.', '', { tools: '마사지 볼', holdSeconds: 30 })
            ],
            lengthen: [
                ex('wr_len_uln1', '척측 편위 스트레칭', '손목을 새끼 손가락 방향으로 부드럽게 기울여 30초 유지합니다.', '', { holdSeconds: 30, sets: 2 })
            ],
            activate: [
                ex('wr_act_uln1', '척측 편위 강화', '가벼운 아령을 기립자세에서 잡고 손목을 소지 방향으로 올립니다.', '', { tools: '아령', sets: 3, reps: 12 })
            ],
        },
    },
    integrate: [
        ex('wr_int1', '손목 원형 운동 (Circumduction)', '손목을 천천히 시계방향·반시계방향으로 크게 원을 그립니다.', '', { sets: 2, reps: 10 }),
        ex('wr_int2', '그립-릴리즈 복합 운동', '밴드나 공을 꽉 쥐었다 천천히 펴는 동작을 반복합니다.', '', { tools: '마사지 볼 또는 밴드', sets: 3, reps: 15 }),
    ],
};
