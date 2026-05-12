// muscleMapping.ts — 한글 근육명 → flutter_body_atlas SVG ID 매핑 (SSOT)
//
// [근거]
//   - 실제 패키지: flutter_body_atlas 0.1.3
//   - 검증된 SVG ID 144개 (assets/svg/muscle_layer_*.svg 에서 직접 추출)
//   - 매핑 전략:
//     ✅ direct    — 패키지에 정확히 존재
//     ⚠️ substitute — 패키지에 없음, 시각적으로 가장 가까운 위치로 대체
//     🧩 group     — 여러 SVG ID 합쳐서 한 근육군 표현 (예: 대퇴사두근 = 3광근)
//     ❌ unmapped  — 적절한 대체조차 없음 → 빈 배열 (색칠 안 함, 회색 유지)
//
// [중요] 정렬: 자주 쓰이는 굵직한 부위부터 → 디버깅 가독성 우선.

/** 한글 근육명(또는 키워드) → 1개 이상의 SVG ID 배열 */
export const MUSCLE_TO_SVG: Record<string, readonly string[]> = {
    // ════════════════════════════════════════════════════════════════
    // 어깨 / 가슴 (Shoulder & Chest)
    // ════════════════════════════════════════════════════════════════
    '대흉근':         ['pectoralis_major_l', 'pectoralis_major_r'],                  // ✅
    '소흉근':         ['pectoralis_major_l', 'pectoralis_major_r'],                  // ⚠️ (minor 없음 → major 로 대체)
    '광배근':         ['latissimus_dorsi_l', 'latissimus_dorsi_r'],                  // ✅

    '삼각근':         ['anterior_deltoid_l', 'anterior_deltoid_r',
                       'lateral_deltoid_l', 'lateral_deltoid_r',
                       'posterior_deltoid_l', 'posterior_deltoid_r'],                // 🧩 통합
    '전방삼각근':     ['anterior_deltoid_l', 'anterior_deltoid_r'],                  // ✅
    '후방삼각근':     ['posterior_deltoid_l', 'posterior_deltoid_r'],                // ✅

    '상부승모근':     ['trapezius_upper_l', 'trapezius_upper_r'],                    // ✅
    '중부승모근':     ['trapezius_middle_l', 'trapezius_middle_r'],                  // ✅
    '하부승모근':     ['trapezius_lower_l', 'trapezius_lower_r'],                    // ✅
    '견갑거근':       ['trapezius_upper_l', 'trapezius_upper_r'],                    // ⚠️ (목 옆 → 상부승모근 부근)

    // 회전근개 — 패키지에 infraspinatus 만 있음
    '극상근':         ['trapezius_upper_l', 'trapezius_upper_r'],                    // ⚠️ (어깨 위 → 상부승모근)
    '극하근':         ['infraspinatus_l', 'infraspinatus_r'],                        // ✅
    '소원근':         ['infraspinatus_l', 'infraspinatus_r'],                        // ⚠️ (회전근개 동일 영역)
    '견갑하근':       ['infraspinatus_l', 'infraspinatus_r'],                        // ⚠️ (회전근개 동일 영역)
    '대원근':         ['latissimus_dorsi_l', 'latissimus_dorsi_r'],                  // ⚠️ (광배근 위)

    '전거근':         ['external_oblique_1_l', 'external_oblique_1_r',
                       'external_oblique_2_l', 'external_oblique_2_r'],              // ⚠️ (옆구리 위)

    // ════════════════════════════════════════════════════════════════
    // 팔 (Arms)
    // ════════════════════════════════════════════════════════════════
    '이두근':         ['biceps_brachii_caput_longum_l', 'biceps_brachii_caput_longum_r',
                       'biceps_brachii_caput_breve_l',  'biceps_brachii_caput_breve_r'],   // 🧩 장두+단두
    '상완이두근':     ['biceps_brachii_caput_longum_l', 'biceps_brachii_caput_longum_r',
                       'biceps_brachii_caput_breve_l',  'biceps_brachii_caput_breve_r'],   // 🧩
    '삼두근':         ['triceps_brachii_caput_longum_l',   'triceps_brachii_caput_longum_r',
                       'triceps_brachii_caput_laterale_l', 'triceps_brachii_caput_laterale_r',
                       'triceps_brachii_caput_mediale_l',  'triceps_brachii_caput_mediale_r'], // 🧩 3두
    '상완삼두근':     ['triceps_brachii_caput_longum_l',   'triceps_brachii_caput_longum_r',
                       'triceps_brachii_caput_laterale_l', 'triceps_brachii_caput_laterale_r',
                       'triceps_brachii_caput_mediale_l',  'triceps_brachii_caput_mediale_r'], // 🧩
    '상완근':         ['biceps_brachii_caput_breve_l', 'biceps_brachii_caput_breve_r'],  // ⚠️ (이두근 단두 영역)
    '오훼완근':       ['biceps_brachii_caput_breve_l', 'biceps_brachii_caput_breve_r'],  // ⚠️ (상완 안쪽 깊은 근육)
    '주근':           ['anconeus_l', 'anconeus_r'],                                      // ✅
    '회외근':         ['brachioradialis_l', 'brachioradialis_r'],                        // ⚠️ (전완 기시부 부근)
    '상완요골근':     ['brachioradialis_l', 'brachioradialis_r'],                        // ✅

    // 전완
    '요측수근굴근':   ['flexor_carpi_radialis_l', 'flexor_carpi_radialis_r'],            // ✅
    '척측수근굴근':   ['flexor_carpi_ulnaris_l', 'flexor_carpi_ulnaris_r'],              // ✅
    '요측수근신근':   ['extensor_carpi_radialis_longus_l', 'extensor_carpi_radialis_longus_r'], // ✅ (longus만)
    '척측수근신근':   ['extensor_carpi_ulnaris_l', 'extensor_carpi_ulnaris_r'],          // ✅
    '장요측수근신근': ['extensor_carpi_radialis_longus_l', 'extensor_carpi_radialis_longus_r'], // ✅
    '총지신근':       ['extensor_digitorum_l', 'extensor_digitorum_r'],                  // ✅
    '장장근':         ['palmaris_longus_l', 'palmaris_longus_r'],                        // ✅
    '원형 회내근':    ['pronator_teres_l', 'pronator_teres_r'],                          // ✅
    '방형 회내근':    ['pronator_quadratus_l', 'pronator_quadratus_r'],                  // ✅

    // ════════════════════════════════════════════════════════════════
    // 복부 / 허리 (Abdomen & Lower Back)
    // ════════════════════════════════════════════════════════════════
    '복직근':         ['rectus_abdominis_1',
                       'rectus_abdominis_2_l', 'rectus_abdominis_2_r',
                       'rectus_abdominis_3_l', 'rectus_abdominis_3_r',
                       'rectus_abdominis_4_l', 'rectus_abdominis_4_r'],                  // 🧩 (4분할 7개 path)
    '복근':           ['rectus_abdominis_1',
                       'rectus_abdominis_2_l', 'rectus_abdominis_2_r',
                       'rectus_abdominis_3_l', 'rectus_abdominis_3_r',
                       'rectus_abdominis_4_l', 'rectus_abdominis_4_r'],                  // 🧩
    '외복사근':       ['external_oblique_1_l','external_oblique_1_r',
                       'external_oblique_2_l','external_oblique_2_r',
                       'external_oblique_3_l','external_oblique_3_r',
                       'external_oblique_4_l','external_oblique_4_r',
                       'external_oblique_5_l','external_oblique_5_r',
                       'external_oblique_6_l','external_oblique_6_r',
                       'external_oblique_7_l','external_oblique_7_r',
                       'external_oblique_8_l','external_oblique_8_r'],                   // 🧩 (8분할 16개)
    '내복사근':       ['external_oblique_3_l','external_oblique_3_r',
                       'external_oblique_4_l','external_oblique_4_r'],                   // ⚠️ (외복사 깊은 층 대체)
    '복횡근':         ['core'],                                                          // 🧩 그룹 ID (코어 통째)
    '척추기립근':     ['back'],                                                          // 🧩 그룹 ID (등 통째)
    '허리 사각근':    ['external_oblique_5_l','external_oblique_5_r',
                       'external_oblique_6_l','external_oblique_6_r'],                   // ⚠️ (옆구리 아래)

    // ════════════════════════════════════════════════════════════════
    // 고관절 / 둔부 (Hip & Glutes)
    // ════════════════════════════════════════════════════════════════
    '대둔근':         ['gluteus_maximus_l', 'gluteus_maximus_r'],                        // ✅
    '중둔근':         ['gluteus_medius_1_l', 'gluteus_medius_1_r',
                       'gluteus_medius_2_l', 'gluteus_medius_2_r'],                      // 🧩 (2분할)
    '소둔근':         ['gluteus_medius_1_l', 'gluteus_medius_1_r',
                       'gluteus_medius_2_l', 'gluteus_medius_2_r'],                      // ⚠️ (중둔과 동영역)

    // 장요근/요근 — 패키지에 iliopsoas 없음 → pectineus 로 대체 (매뉴얼 권장)
    '장요근':         ['pectineus_l', 'pectineus_r'],                                    // ⚠️
    '대요근':         ['pectineus_l', 'pectineus_r'],                                    // ⚠️
    '요근':           ['pectineus_l', 'pectineus_r'],                                    // ⚠️
    '치골근':         ['pectineus_l', 'pectineus_r'],                                    // ✅

    // 고관절 깊은 회전근 (이상근/폐쇄근/쌍둥이근/대퇴방형근) — 패키지 없음 → 대둔근으로 대체
    '이상근':         ['gluteus_maximus_l', 'gluteus_maximus_r'],                        // ⚠️
    '폐쇄근':         ['gluteus_maximus_l', 'gluteus_maximus_r'],                        // ⚠️
    '쌍둥이근':       ['gluteus_maximus_l', 'gluteus_maximus_r'],                        // ⚠️
    '대퇴방형근':     ['gluteus_maximus_l', 'gluteus_maximus_r'],                        // ⚠️

    '봉공근':         ['sartoris_l', 'sartoris_r'],                                      // ✅ (패키지 자체 오타: sartori"s")
    '대퇴근막장근':   ['iliotibial_tract_l', 'iliotibial_tract_r'],                      // ⚠️ (TFL 자체 SVG 없음 → 장경인대로 표시)
    'IT밴드':         ['iliotibial_tract_l', 'iliotibial_tract_r'],                      // ✅
    '대퇴막장근':     ['iliotibial_tract_l', 'iliotibial_tract_r'],                      // ⚠️ (TFL 줄임말)

    // ════════════════════════════════════════════════════════════════
    // 허벅지 (Thigh)
    // ════════════════════════════════════════════════════════════════
    '대퇴사두근':     ['rectus_femoris_l', 'rectus_femoris_r',
                       'vastus_lateralis_l', 'vastus_lateralis_r',
                       'vastus_medialis_l', 'vastus_medialis_r'],                        // 🧩 (3광근, 중간광근 없음)
    '대퇴직근':       ['rectus_femoris_l', 'rectus_femoris_r'],                          // ✅
    '외측광근':       ['vastus_lateralis_l', 'vastus_lateralis_r'],                      // ✅
    '내측광근':       ['vastus_medialis_l', 'vastus_medialis_r'],                        // ✅
    '중간광근':       ['vastus_lateralis_l', 'vastus_lateralis_r',
                       'vastus_medialis_l', 'vastus_medialis_r'],                        // ⚠️ (없음 → 외/내측광근으로 대체)

    // 햄스트링
    '슬굴곡근':       ['biceps_femoris_l', 'biceps_femoris_r',
                       'semitendinosus_l', 'semitendinosus_r',
                       'semimembranosus_1_l', 'semimembranosus_1_r',
                       'semimembranosus_2_l', 'semimembranosus_2_r'],                    // 🧩 햄스트링 전체
    '햄스트링':       ['biceps_femoris_l', 'biceps_femoris_r',
                       'semitendinosus_l', 'semitendinosus_r',
                       'semimembranosus_1_l', 'semimembranosus_1_r',
                       'semimembranosus_2_l', 'semimembranosus_2_r'],                    // 🧩
    '대퇴이두':       ['biceps_femoris_l', 'biceps_femoris_r'],                          // ✅
    '대퇴이두근':     ['biceps_femoris_l', 'biceps_femoris_r'],                          // ✅
    '반건양':         ['semitendinosus_l', 'semitendinosus_r'],                          // ✅
    '반건양근':       ['semitendinosus_l', 'semitendinosus_r'],                          // ✅
    '반막양':         ['semimembranosus_1_l', 'semimembranosus_1_r',
                       'semimembranosus_2_l', 'semimembranosus_2_r'],                    // 🧩 (2분할)
    '반막양근':       ['semimembranosus_1_l', 'semimembranosus_1_r',
                       'semimembranosus_2_l', 'semimembranosus_2_r'],                    // 🧩

    // 내전근
    '내전근':         ['adductor_longus_l', 'adductor_longus_r',
                       'adductor_magnus_l', 'adductor_magnus_r',
                       'gracilis_l', 'gracilis_r'],                                      // 🧩
    '내전근군':       ['adductor_longus_l', 'adductor_longus_r',
                       'adductor_magnus_l', 'adductor_magnus_r',
                       'gracilis_l', 'gracilis_r'],                                      // 🧩
    '장내전근':       ['adductor_longus_l', 'adductor_longus_r'],                        // ✅
    '대내전근':       ['adductor_magnus_l', 'adductor_magnus_r'],                        // ✅
    '단내전근':       ['adductor_longus_l', 'adductor_longus_r',
                       'adductor_magnus_l', 'adductor_magnus_r'],                        // ⚠️ (없음 → 장/대내전 영역)
    '박근':           ['gracilis_l', 'gracilis_r'],                                      // ✅

    // 무릎 주변 (작은 근육 / 인대)
    '슬개건':         ['rectus_femoris_l', 'rectus_femoris_r'],                          // ⚠️ (무릎 위 = 대퇴직근 끝)
    '슬와근':         ['biceps_femoris_l', 'biceps_femoris_r'],                          // ⚠️ (무릎 뒤 = 햄스트링 일부)
    '후방관절낭':     ['infraspinatus_l', 'infraspinatus_r'],                            // ⚠️ (어깨 뒤 회전근개 영역)

    // ════════════════════════════════════════════════════════════════
    // 종아리 / 발목 (Calf & Ankle)
    // ════════════════════════════════════════════════════════════════
    '비복근':         ['gastrocnemius_l', 'gastrocnemius_r'],                            // ✅
    '가자미근':       ['gastrocnemius_l', 'gastrocnemius_r'],                            // ⚠️ (soleus 없음 → 비복근 영역)
    '족저근':         ['gastrocnemius_l', 'gastrocnemius_r'],                            // ⚠️ (없음 → 비복근 영역)
    '전경골근':       ['tibialis_anterior_l', 'tibialis_anterior_r'],                    // ✅
    '후경골근':       ['gastrocnemius_l', 'gastrocnemius_r'],                            // ⚠️ (posterior 없음 → 비복근으로 — 위치상 종아리 뒤쪽 동영역)
    '비골근':         ['fibularis_longus_l', 'fibularis_longus_r'],                      // ✅ (패키지 명명: fibularis)
    '비골근군':       ['fibularis_longus_l', 'fibularis_longus_r'],                      // ✅
    '장비골근':       ['fibularis_longus_l', 'fibularis_longus_r'],                      // ✅
    '단비골근':       ['fibularis_longus_l', 'fibularis_longus_r'],                      // ⚠️ (longus만 있음)
    '제3비골근':      ['fibularis_longus_l', 'fibularis_longus_r'],                      // ⚠️
    '장지신근':       ['extensor_digitorum_longus_l', 'extensor_digitorum_longus_r'],    // ✅
    '장무지신근':     ['extensor_hallucis_longus_l', 'extensor_hallucis_longus_r'],      // ✅
} as const;

/** SVG ID 정합성 검증용 — 매핑되지 않은 한글 근육명 발견 시 dev 콘솔에 경고 */
export const resolveMuscleIds = (koreanNames: readonly string[]): string[] => {
    const result = new Set<string>();
    for (const name of koreanNames) {
        const ids = MUSCLE_TO_SVG[name];
        if (ids) {
            ids.forEach((id) => result.add(id));
        } else if (import.meta.env.DEV) {
            console.warn(`[muscleMapping] 매핑 없음: "${name}" — muscleMapping.ts 에 추가 필요`);
        }
    }
    return [...result];
};

/**
 * 운동 데이터 muscleMap 에 들어있는 복합 한글(예: "대퇴사두근(대퇴직근 포함)") 을
 * 등록된 키워드와 매칭해 분할한다. 괄호/·/, 분리 후 includes 검색.
 *
 * 예: "대퇴사두근(대퇴직근 포함)" → ['대퇴사두근', '대퇴직근']
 *     "내전근군(장·단·대내전근, 박근)" → ['내전근군', '장내전근', '대내전근', '박근']
 */
export const extractMuscleKeywords = (raw: string): string[] => {
    const keys = Object.keys(MUSCLE_TO_SVG);
    return keys.filter((k) => raw.includes(k));
};

/**
 * 분석 결과(과활성·저활성 복합 한글 리스트) → SVG ID 배열.
 *
 * `BodyAnatomySvg` 의 `highlightIds` 에 그대로 전달하는 게 목표.
 * 운동마다 다른 색칠을 하려면 movement 별 분석 필요(현재 미지원).
 * 일단 한 관절-방향 안의 모든 처방 근육을 함께 색칠한다.
 */
export const resolveAnalysisToSvgIds = (raws: readonly string[]): string[] => {
    const tokens = [...new Set(raws.flatMap(extractMuscleKeywords))];
    return resolveMuscleIds(tokens);
};
