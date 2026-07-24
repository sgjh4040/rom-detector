// ankle.ts — 발목 CES 데이터
import { ex } from './cesTypes';
import type { JointCesData } from './cesTypes';

export const ANKLE_CES: JointCesData = {
    muscleMap: {
        plantar_flexion: { overactive: ['전경골근', '장지신근', '장무지신근'], underactive: ['비복근', '가자미근', '족저근'] },
        dorsi_flexion: { overactive: ['비복근', '가자미근', '족저근'], underactive: ['전경골근', '장지신근', '장무지신근'] },
        inversion: { overactive: ['비골근군(장비골근·단비골근·제3비골근)'], underactive: ['전경골근', '후경골근'] },
        eversion: { overactive: ['전경골근', '후경골근'], underactive: ['비골근군(장비골근·단비골근)'] },
    },
    protocol: {
        plantar_flexion: {
            inhibit: [ex('ak_inh_pf1', '전경골근 SMR', '마사지 볼로 정강이 외측(전경골근)을 30초 압박합니다.', '91.ak_inh_pf1.mp4', { tools: '마사지 볼', holdSeconds: 30 })],
            lengthen: [ex('ak_len_pf1', '전경골근 스트레칭', '서있는 자세에서 발등을 바닥에 대고 발목을 뒤로 부드럽게 눌러 30초 유지합니다.', '92.ak_len_pf1.mp4', { holdSeconds: 30, sets: 2 })],
            activate: [ex('ak_act_pf1', '비복근·가자미근 강화 (카프 레이즈)', '서서 발뒤꿈치를 최대한 들어올리고 천천히 내립니다.', '93.ak_act_pf1.mp4', { sets: 3, reps: 20 })],
        },
        dorsi_flexion: {
            inhibit: [ex('ak_inh_df1', '비복근 SMR', '폼롤러를 종아리 아래에 대고 발목~무릎 뒤까지 롤링합니다.', '94.ak_inh_df1.mp4', { tools: '폼롤러', holdSeconds: 40 }),
            ex('ak_inh_df2', '가자미근 SMR', '마사지볼을 종아리 아래에 대고 무릎을 굽힌 상태로 중간·하부를 롤링합니다.', '95.ak_inh_df2.mp4', { tools: '마사지볼', holdSeconds: 40 })],
            lengthen: [ex('ak_len_df1', '비복근 스트레칭 (무릎 편 상태)', '벽에 양손을 대고 한 발을 뒤로 빼 발뒤꿈치를 바닥에 붙인 채 30초 유지합니다.', '96.ak_len_df1.mp4', { holdSeconds: 30, sets: 2 }),
            ex('ak_len_df2', '가자미근 스트레칭 (무릎 굽힌 상태)', '벽에 양손을 대고 한 발을 뒤로 뺸 상태에서 뒤쪽 무릎을 약간 굽혀 가자미근을 30초 늘입니다.', '97.ak_len_df2.mp4', { holdSeconds: 30, sets: 2 })],
            activate: [ex('ak_act_df1', '전경골근 강화 (발등 들기)', '의자에 앉아 발뒤꿈치를 바닥에 두고 발등을 최대한 들어올립니다.', '98.ak_act_df1.mp4', { sets: 3, reps: 20 })],
        },
        inversion: {
            inhibit: [ex('ak_inh_inv1', '비골근 SMR', '마사지 볼로 외측 복사뼈 위쪽 비골근을 30초 압박합니다.', '99.ak_inh_inv1.mp4', { tools: '마사지 볼', holdSeconds: 30 })],
            lengthen: [ex('ak_len_inv1', '내번 스트레칭', '서있는 자세에서 발목을 안쪽으로 부드럽게 기울여(내번 방향) 30초 유지합니다.', '100.ak_len_inv1.mp4', { holdSeconds: 30, sets: 2 })],
            activate: [ex('ak_act_inv1', '후경골근 강화 (내번 밴드)', '밴드를 발에 감고 발목을 안쪽으로 당겨 후경골근을 수축합니다.', '101.ak_act_inv1.mp4', { tools: '탄성 밴드', sets: 3, reps: 15 })],
        },
        eversion: {
            inhibit: [ex('ak_inh_ev1', '후경골근·전경골근 SMR', '마사지 볼로 정강이 안쪽(후경골근)과 앞쪽(전경골근)을 각 30초 압박합니다.', '102.ak_inh_ev1.mp4', { tools: '마사지 볼', holdSeconds: 30 })],
            lengthen: [ex('ak_len_ev1', '외번 스트레칭', '서있는 자세에서 발목을 바깥쪽으로 부드럽게 기울여(외번 방향) 30초 유지합니다.', '103.ak_len_ev1.mp4', { holdSeconds: 30, sets: 2 })],
            activate: [ex('ak_act_ev1', '비골근 강화 (외번 밴드)', '밴드를 발에 감고 발목을 바깥쪽으로 당겨 비골근을 수축합니다.', '104.ak_act_ev1.mp4', { tools: '탄성 밴드', sets: 3, reps: 15 })],
        },
    },
    integrate: [
        ex('ak_int1', '싱글 레그 밸런스', '불안정한 지지면에 한 발로 서서 30초 균형 유지 — 눈 감기로 난이도 조절 가능합니다.', '13.ak_int1.mp4', { sets: 3, holdSeconds: 30, targetMuscles: ['비복근', '전경골근', '비골근'] }),
        ex('ak_int2', 'Y밸런스 익스커션', '한발로 중심을 잡고 반대발을 앞, 뒤안쪽, 뒤가쪽으로 최대한 이동해 발목 가동범위의 끝자락까지 이용합니다.', '14.ak_int2.mp4', { sets: 2, reps: 10, targetMuscles: ['중둔근', '비골근', '전경골근'] }),
    ],
};
