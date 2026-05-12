# 근육 색칠 매핑 가이드 (v3)

> **v3 — 2026-05-12 — 운동 이름 매칭 + stage fallback 결합.**
> v2(2026-05-12 오전, 관절-방향 단위 동일 색칠) 는 CES 4단계(억제/신장/활성/통합) 마다 타겟이 달라야 한다는 요구와 맞지 않아 폐기. 운동 이름 직접 매칭으로 운동별 다른 부위 색칠 + stage 기반 fallback 도입.
> 옛 매뉴얼(`~/Projects/자료들/muscle_mapping_manual.md`) 의 v1 구조(한글→영어 매핑 Flutter 측, GitHub Pages) 는 더 이상 사용하지 않습니다.

---

## 개요 (v3 데이터 흐름)

```
운동 데이터 (knee.ts, shoulder.ts, …)
  ├─ ex(id, name, description, videoFile, …)
  │      └─ name = "대퇴사두근 SMR", "IT밴드 SMR", "햄스트링 컬 (밴드)", …
  │
  └─ muscleMap.{movement}.overactive/underactive  ← stage fallback 용
            │
            ▼ analyzeMuscles()
       analysis.{overactive/underactive}Muscles[]
            │
            ▼ getTargetMuscleIds(exerciseName, analysis, stage)
            │      1) 운동 이름에서 한글 근육 키워드 추출 (muscleMapping.ts 키 매칭)
            │         → 매칭 있으면 그것만 SVG ID 변환 ★ 가장 정확
            │      2) 매칭 없으면 stage 기반 fallback:
            │            - inhibit/lengthen → overactive 만
            │            - activate         → underactive 만
            │            - integrate        → over + under 전체
            │
       SVG ID[]    예: ['rectus_femoris_l', 'rectus_femoris_r']
            │
            ▼ BodyAnatomySvg → postMessage({muscles, color}, '*')
       Flutter iframe
            │
            ▼ MuscleMapper.getTargetMuscles(svgIds: List<String>)   ★ thin shell
       flutter_body_atlas 패키지가 색칠
```

핵심:
- **운동마다 다른 색칠** — `대퇴사두근 SMR` 과 `IT밴드 SMR` 은 같은 inhibit 단계여도 색칠 부위가 다르다.
- **stage 마다 다른 색** — `PHASE_META` 의 색 (inhibit 오렌지, lengthen 시안, activate 핑크, integrate 그린).
- **SSOT** — 한글→영어 매핑 로직은 React 측 `src/lib/ces/muscleMapping.ts` 한 파일에만 존재. Flutter 는 SVG ID 받아서 색칠만 하는 얇은 껍데기.

---

## 자주 하는 작업 3가지

### 1. 새 운동 추가 (영상 + 운동 데이터)

운동 추가 시 색칠을 정확하게 만들려면 **운동 이름에 타겟 한글 근육명을 명시하는 것이 핵심**.

1. `src/lib/ces/{joint}.ts` 의 `ex(id, name, ...)` 추가 시 `name` 에 타겟 근육명 포함 (예: `"대퇴사두근 SMR"`, `"햄스트링 컬 (밴드)"`).
   - 그 한글이 `muscleMapping.ts` 의 키와 매칭되면 자동으로 정확한 부위 색칠됨.
2. `muscleMap.{movement}.overactive/underactive` 도 정확히 채울 것 — 통합 운동(스쿼트/스텝업 등 이름에 근육명 없는 운동) 의 fallback 용이고, 사이드바 "근육 밸런스" 카드에도 표시됨.
3. (선택) R2 에 mp4 업로드 후 `youtubeId` 자리에 파일명 박기.

> **예외:** 운동 이름에 새 한글 근육명이 등장했는데 `MUSCLE_TO_SVG` 에 매핑 없으면 dev 콘솔에 `[muscleMapping] 매핑 없음: "…"` 경고 출력. → 작업 2번으로 이동.

> **운동 이름에 근육명 없는 통합 운동** (예: 스쿼트, 스텝업): stage 기반 fallback 으로 자동 처리됨 (의도된 동작).

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
v3 부터 운동 이름 직접 매칭으로 운동별 다른 부위 색칠 가능. 운동 이름에 한글 근육명이 들어있는지 확인하고, 없으면 `name` 에 추가하거나 `muscleMapping.ts` 키워드로 등록.

### 통합 운동(스쿼트 등) 색칠 부위가 너무 광범위
stage 기반 fallback (integrate = over + under 전체) 동작 중. 정확하게 좁히려면 운동 이름에 명시적 한글 근육명 추가 (예: `"스쿼트 — 대퇴사두근+햄스트링"`). 또는 향후 운동에 `targetMuscles` 메타 필드 추가하는 큰 리팩토링 가능.

---

## 참고 파일

| 파일 | 역할 |
|---|---|
| [src/lib/ces/muscleMapping.ts](../src/lib/ces/muscleMapping.ts) | ★ 한글 → SVG ID SSOT 매핑 + 변환 헬퍼 |
| [src/pages/cesProtocol/helpers.ts](../src/pages/cesProtocol/helpers.ts) | `getTargetMuscleIds(analysis)` 진입점 |
| [src/core/components/BodyAnatomySvg.tsx](../src/core/components/BodyAnatomySvg.tsx) | Flutter iframe + postMessage |
| [flutter_app/lib/utils/muscle_mapper.dart](../flutter_app/lib/utils/muscle_mapper.dart) | Flutter thin shell (SVG ID → MuscleInfo) |
| [docs/flutter-body-atlas-ids.txt](./flutter-body-atlas-ids.txt) | flutter_body_atlas 0.1.3 의 144개 SVG ID 전체 |
