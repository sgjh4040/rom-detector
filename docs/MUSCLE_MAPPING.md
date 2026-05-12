# 근육 색칠 매핑 가이드 (v4)

> **v4 — 2026-05-12 — `targetMuscles` 메타 우선 + 운동 이름 매칭 + stage fallback.**
> v3 는 운동 이름에 한글 근육명 없는 운동(예: "어깨 굽힘 운동", "스쿼트") 의 정확도가 떨어졌음. v4 는 `CesExercise.targetMuscles` 라는 명시적 메타 필드를 우선순위 1로 도입. 운동 이름은 환자 화면에 보이는 그대로 깔끔하게 유지 + 데이터/표시 분리.
>
> v2(관절-방향 동일 색칠), v1(Flutter 측 매핑, GitHub Pages) 는 모두 폐기.

---

## 개요 (v4 데이터 흐름)

```
운동 데이터 (knee.ts, shoulder.ts, …)
  ├─ ex(id, name, description, videoFile, { …, targetMuscles?: string[] })
  │      ├─ name = "어깨 굽힘 운동 (밴드)", "스텝업", …   ← 환자 UI 표시
  │      └─ targetMuscles = ['하부승모근','전거근','후방삼각근']  ← v4 메타 (명시적)
  │
  └─ muscleMap.{movement}.overactive/underactive  ← stage fallback 용
            │
            ▼ analyzeMuscles()
       analysis.{overactive/underactive}Muscles[]
            │
            ▼ getTargetMuscleIds(exercise, analysis, stage)
            │
            │   ★ 매칭 우선순위 3단계:
            │
            │   1) exercise.targetMuscles 메타 (명시적, 가장 정확)
            │        → ['하부승모근','전거근','후방삼각근'] → SVG ID
            │   2) exercise.name 키워드 매칭 (muscleMapping.ts 키 기반)
            │        → "대퇴사두근 SMR" → 대퇴사두근만
            │   3) stage 기반 fallback (CES 원리)
            │        - inhibit/lengthen → overactive 만 (풀거나 늘림)
            │        - activate         → underactive 만 (깨움)
            │        - integrate        → over + under 전체 (협응)
            │
       SVG ID[]    예: ['trapezius_lower_l', 'trapezius_lower_r', …]
            │
            ▼ BodyAnatomySvg → postMessage({muscles, color}, '*')
       Flutter iframe
            │
            ▼ MuscleMapper.getTargetMuscles(svgIds: List<String>)   ★ thin shell
       flutter_body_atlas 패키지가 색칠
```

핵심:
- **메타가 1순위** — 운동에 `targetMuscles` 박아두면 운동 이름이나 stage 와 상관없이 그것만 색칠. 통합 운동(스쿼트/스텝업/플랭크 등) 에 특히 유용.
- **운동 이름은 환자 친화** — `"어깨 굽힘 운동 (밴드)"` 같은 직관적 이름 그대로. 환자에게 한글 근육명 노출 X (메타로 분리).
- **stage 마다 다른 색** — inhibit 오렌지 / lengthen 시안 / activate 핑크 / integrate 그린.
- **SSOT** — 한글→영어 매핑 로직은 React 측 `src/lib/ces/muscleMapping.ts` 한 파일에만 존재. Flutter 는 SVG ID 받아서 색칠만 하는 얇은 껍데기.

---

## 자주 하는 작업 3가지

### 1. 새 운동 추가 (영상 + 운동 데이터)

색칠 정확도 ↑ 두 가지 길:

**(a) 운동 이름에 한글 근육명이 자연스럽게 들어있는 경우** — 추가 작업 없음.
   - 예: `"대퇴사두근 SMR"`, `"햄스트링 컬 (밴드)"`, `"광배근 밴드 풀다운"`
   - 운동 이름에서 자동 매칭됨.

**(b) 운동 이름에 근육명 없거나 의도와 다른 경우** — `targetMuscles` 메타 박기.
   - 예: `"어깨 굽힘 운동 (밴드)"`, `"스텝업"`, `"플랭크"`, `"버드독"`
   - 운동 이름은 환자가 보기 편한 그대로 두고, 메타로 정확한 타겟 표시:

   ```ts
   ex('sh_act_flex1', '어깨 굽힘 운동 (밴드)', '...', '',
      { tools: '탄성 밴드', sets: 3, reps: 12,
        targetMuscles: ['하부승모근', '전거근', '후방삼각근'] }),  // ← v4 메타
   ```

   - 통합 운동(integrate) 은 대부분 메타가 필요. 현재 박힌 메타 예시:
     - 스텝업/스쿼트 → `['대퇴사두근','슬굴곡근','대둔근']`
     - 플랭크 → `['복직근','복횡근','외복사근','척추기립근']`
     - 버드독 → `['척추기립근','복횡근','대둔근']`

또한:
- `muscleMap.{movement}.overactive/underactive` 도 정확히 채울 것 — fallback + 사이드바 "근육 밸런스" 카드 표시용.
- (선택) R2 에 mp4 업로드 후 `youtubeId` 자리에 파일명 박기.

> **예외:** `targetMuscles` 또는 운동 이름에 새 한글 근육명이 등장했는데 `MUSCLE_TO_SVG` 에 매핑 없으면 dev 콘솔에 `[muscleMapping] 매핑 없음: "…"` 경고 출력. → 작업 2번으로 이동.

### 2. 새 한글 근육명 매핑 추가

운동 데이터에 새 한글 근육명이 등장했고 매핑이 없을 때.

`src/lib/ces/muscleMapping.ts` 의 `MUSCLE_TO_SVG` 에 한 줄 추가:

```ts
'새근육명': ['svg_id_l', 'svg_id_r'],   // ✅ direct (그대로 존재)
'없는근육': ['가장_가까운_svg_id_l', '가장_가까운_svg_id_r'],   // ⚠️ substitute (대체)
'근육군':   ['svg_id_a_l', 'svg_id_a_r', 'svg_id_b_l', 'svg_id_b_r'],   // 🧩 group (여러 SVG 통합)
'광역부위': ['back'],                   // 🧩 atlas 그룹 ID
```

**SVG ID는 [docs/flutter-body-atlas-ids.txt](./flutter-body-atlas-ids.txt) 의 144개 중에서만** 사용 가능. 그 외는 패키지에 없어서 색칠 안 됨.

대체 전략 4가지:
- **a. 가장 가까운 위치로 대체** — 예: `장요근 → pectineus`, `가자미근 → gastrocnemius`
- **b. 카테고리 그룹** — 예: `복횡근 → core`, `척추기립근 → back`
- **c. 동족근으로 통합** — 예: `중간광근 → 외측광근 + 내측광근`
- **d. 매칭 포기** — 빈 배열 (회색 유지). 강제 색칠은 하지 말 것.

코드 수정 후 `npm run dev` 재시작만 하면 즉시 반영됨. **Flutter 빌드 불필요.**

### 3. SVG ID 자체에 새 그룹 추가 (드물게)

`muscleMapping.ts` 의 값에 `'foot_l'` 같은 새 그룹 ID 를 쓰고 싶고, 그것이 atlas 그룹(`back/core/glutes/hamstrings/legs/arms/chest/shoulders/neck/adductors`) 외 새로운 카테고리일 때.

→ `flutter_app/lib/utils/muscle_mapper.dart` 의 `_tryGroup` switch 에 `case '새그룹': return MuscleCatalog.새그룹;` 추가 후 **Flutter 빌드 + 복사** (아래 참조).

---

## Flutter 빌드 + 동기화 (필요 시)

Flutter 코드를 수정한 경우에만 필요. 대부분의 매핑 추가는 React 만 수정하면 됨.

```bash
cd flutter_app
flutter build web --base-href "/flutter_atlas/" --release
cp -r build/web/* ../public/flutter_atlas/
cd ..
git add public/flutter_atlas flutter_app
```

> ⚠️ `--base-href "/flutter_atlas/"` — Vercel 루트 도메인 (`https://rom-detector.vercel.app/`) 기준. GitHub Pages 시절의 `/Rom/flutter_atlas/` 가 아님.

배포는 main 푸쉬 → Vercel 자동.

---

## 트러블슈팅

### 색칠이 전혀 안 됨
1. dev 콘솔에서 `[BodyAnatomy] muscles: …` 로그 확인 — 비어있으면 분석 결과 자체가 빈 것.
2. `[muscleMapping] 매핑 없음: "…"` 경고 있으면 그 한글에 매핑 추가 필요.
3. Flutter iframe 자체가 로드 안 됐으면 `public/flutter_atlas/index.html` 존재 확인.

### 엉뚱한 부위가 색칠됨 — 옛날에 보던 "코어 강제 색칠"
v2 부터 fallback "코어" 제거됨. 그래도 잘못된 영역이 색칠된다면:
- `muscleMapping.ts` 의 해당 한글 매핑에서 SVG ID 가 잘못 적혀있을 가능성.
- [flutter-body-atlas-ids.txt](./flutter-body-atlas-ids.txt) 와 대조해서 실제 존재하는 ID 인지 확인.

### 로컬은 되는데 운영(Vercel)에선 안 됨
- `public/flutter_atlas/` 가 빌드 결과로 갱신됐는지 확인. `git status` 에 잡혀야 푸쉬 후 배포 반영.
- Vercel 캐시 새로고침: 브라우저 `Cmd + Shift + R`.

### 운동마다 색칠이 같음 (v2 잔재)
v3+ 부터 운동 이름 직접 매칭으로 운동별 다른 부위 색칠 가능. v4 부터는 `targetMuscles` 메타로 더 명시적 제어 가능.

### 통합 운동(스쿼트 등) 색칠 부위가 너무 광범위
v4 부터 통합 운동에 `targetMuscles` 메타가 기본 박혀있음. 특정 운동이 너무 광범위하면 그 운동의 메타를 좁혀서 수정. 메타 없는 운동은 stage fallback 으로 처리되니까 추가하면 정확해짐.

### `targetMuscles` 메타 vs 운동 이름 — 어느 게 우선?
**메타가 항상 우선.** 운동 이름에 한글 근육명이 있더라도 메타에 다른 값을 박으면 메타가 색칠됨. 둘이 충돌하지 않게 의도에 맞게 둘 중 하나만 정확히 설정 권장.

---

## 참고 파일

| 파일 | 역할 |
|---|---|
| [src/lib/ces/muscleMapping.ts](../src/lib/ces/muscleMapping.ts) | ★ 한글 → SVG ID SSOT 매핑 + 변환 헬퍼 |
| [src/pages/cesProtocol/helpers.ts](../src/pages/cesProtocol/helpers.ts) | `getTargetMuscleIds(analysis)` 진입점 |
| [src/core/components/BodyAnatomySvg.tsx](../src/core/components/BodyAnatomySvg.tsx) | Flutter iframe + postMessage |
| [flutter_app/lib/utils/muscle_mapper.dart](../flutter_app/lib/utils/muscle_mapper.dart) | Flutter thin shell (SVG ID → MuscleInfo) |
| [docs/flutter-body-atlas-ids.txt](./flutter-body-atlas-ids.txt) | flutter_body_atlas 0.1.3 의 144개 SVG ID 전체 |
