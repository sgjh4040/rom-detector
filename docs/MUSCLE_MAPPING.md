# 근육 색칠 매핑 가이드 (v2)

> **v2 — 2026-05-12 — SSOT 통합 후 신규 매뉴얼.**
> 옛 매뉴얼(`~/Projects/자료들/muscle_mapping_manual.md`) 은 GitHub Pages + 한글→영어 매핑 Flutter 측에 두던 v1 구조라 더 이상 사용하지 않습니다.

---

## 개요 (v2 데이터 흐름)

```
운동 데이터 (knee.ts, shoulder.ts, …)
  └─ muscleMap.{movement}.overactive/underactive  ←  ★ 진실의 원천 (운동 본질)
            │
            ▼ analyzeMuscles()
       analysis.overactiveMuscles[],  analysis.underactiveMuscles[]
            │                                     예: ['대퇴사두근(대퇴직근 포함)', 'IT밴드·대퇴근막장근', …]
            ▼ getTargetMuscleIds()  =  resolveAnalysisToSvgIds()
       SVG ID[]                                    예: ['rectus_femoris_l', 'rectus_femoris_r', 'iliotibial_tract_l', …]
            │                                     ★ 변환은 React 측에서 끝남
            ▼ BodyAnatomySvg → postMessage({muscles, color}, '*')
       Flutter iframe
            │
            ▼ MuscleMapper.getTargetMuscles(svgIds: List<String>)   ★ thin shell
       flutter_body_atlas 패키지가 색칠
```

핵심: **모든 한글→영어 매핑 로직이 React 측 `src/lib/ces/muscleMapping.ts` 한 파일에 모임 (SSOT).** Flutter 는 받은 SVG ID 들을 그대로 색칠하는 얇은 껍데기.

---

## 자주 하는 작업 3가지

### 1. 새 운동 추가 (영상 + 운동 데이터)

운동 추가는 muscleMap 만 정확하면 색칠은 자동으로 따라옴. **별도 매핑 작업 필요 없음.**

1. `src/lib/ces/{joint}.ts` 의 `muscleMap` 에 새 movement / 근육 추가
2. (선택) R2 에 mp4 업로드 후 `youtubeId` 자리에 파일명 박기
3. 끝 — 색칠은 분석 결과를 자동으로 따라간다.

> **예외:** 운동 데이터에 등장한 한글 근육명이 `MUSCLE_TO_SVG` 매핑에 없으면 dev 콘솔에 `[muscleMapping] 매핑 없음: "…"` 경고 출력. → 작업 2번으로 이동.

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

### 단일 운동마다 다른 부위 색칠 원함 (현재는 관절-방향 단위)
현재는 한 관절-방향(예: 무릎 굴곡) 내 모든 처방 근육을 같이 색칠. 운동별로 다르게 하려면 `muscleAnalysis` 가 movement 단위로 결과를 보존하도록 확장 필요 (향후 과제).

---

## 참고 파일

| 파일 | 역할 |
|---|---|
| [src/lib/ces/muscleMapping.ts](../src/lib/ces/muscleMapping.ts) | ★ 한글 → SVG ID SSOT 매핑 + 변환 헬퍼 |
| [src/pages/cesProtocol/helpers.ts](../src/pages/cesProtocol/helpers.ts) | `getTargetMuscleIds(analysis)` 진입점 |
| [src/core/components/BodyAnatomySvg.tsx](../src/core/components/BodyAnatomySvg.tsx) | Flutter iframe + postMessage |
| [flutter_app/lib/utils/muscle_mapper.dart](../flutter_app/lib/utils/muscle_mapper.dart) | Flutter thin shell (SVG ID → MuscleInfo) |
| [docs/flutter-body-atlas-ids.txt](./flutter-body-atlas-ids.txt) | flutter_body_atlas 0.1.3 의 144개 SVG ID 전체 |
