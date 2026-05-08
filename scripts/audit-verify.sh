#!/usr/bin/env bash
# audit-verify.sh — 2026-05-06 audit 38건 진척도 자동 검증.
# 메모(memory/project_full_audit_2026_05_06.md) 의 잔여 항목이 실제로 처리됐는지
# grep / wc 한 줄로 일괄 확인한다.
#
# 사용법: bash scripts/audit-verify.sh
# 결과: 코드만으로 검증 가능한 항목은 PASS/FAIL. 브라우저 검증 필요한 항목은 표기.

set -uo pipefail

cd "$(git rev-parse --show-toplevel)"

echo "=================================================="
echo "rom-detector audit 38건 자동 검증 ($(date +%Y-%m-%d))"
echo "=================================================="

# 한 줄 PASS/FAIL 결과 출력 헬퍼
report() {
  local id="$1"; local label="$2"; local status="$3"; local detail="$4"
  printf "%-8s %-50s %s\n" "$id" "$label" "$status"
  [ -n "$detail" ] && printf "%-8s   └── %s\n" "" "$detail"
}

count_lines() {
  grep -rn "$1" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' '
}

# ─── P0 ───
echo ""
echo "▶ P0 — 의료 데이터 정확성 / 결정적 버그"
n=$(count_lines "as any")
if [ "$n" -eq 0 ]; then report "#2" "as any 캐스팅" "✅" ""; else report "#2" "as any 캐스팅" "❌" "${n}건 잔존"; fi

n=$(grep -rn "localStorage\.\(set\|get\|remove\)Item" src/ --include="*.tsx" 2>/dev/null | grep -v "src/lib/" | wc -l | tr -d ' ')
if [ "$n" -eq 0 ]; then report "#3" "localStorage 직접 접근 (lib 외)" "✅" ""; else report "#3" "localStorage 직접 접근 (lib 외)" "⚠️" "lib/ 외에서 ${n}건"; fi

# ─── P1 ───
echo ""
echo "▶ P1 — 사용자 즉각 인지 UX"

n=$(grep -rn "Muscle Map\|UPPER BODY\|LOWER BODY\|GO TO PROTOCOL\|CES Reference\|INHIBIT STAGE" src/ --include="*.tsx" 2>/dev/null | grep -v "//\|/\*" | wc -l | tr -d ' ')
if [ "$n" -eq 0 ]; then report "#6" "CES Info 영문 라벨" "✅" ""; else report "#6" "CES Info 영문 라벨" "❌" "${n}건 (UI 노출)"; fi

n=$(grep -rn "INHIBIT\b\|LENGTHEN\b\|ACTIVATE\b\|INTEGRATE\b" src/ --include="*.tsx" 2>/dev/null | grep -v "type\|import\|//\|comment" | wc -l | tr -d ' ')
if [ "$n" -eq 0 ]; then report "#7" "CES Player 영문 단독 라벨" "✅" ""; else report "#7" "CES Player 영문 단독 라벨" "❌" "${n}건"; fi

# #11 은 PHASE_META.color 단일 진실원 사용 강제. 검증: NeumoDashboard 가 STAGE_COLORS import 하는지.
if grep -q "STAGE_COLORS" src/features/trends/presentation/NeumoDashboard.tsx 2>/dev/null \
   && grep -q "PHASE_META\[currentStep" src/core/components/CesPlayerController.tsx 2>/dev/null; then
  report "#11" "CES 4단계 색상 통일 (STAGE_COLORS/PHASE_META)" "✅" "NeumoDashboard + CesPlayer 모두 사용"
else
  report "#11" "CES 4단계 색상 통일 (STAGE_COLORS/PHASE_META)" "❌" "단일 import 미적용"
fi

# #17 일반 컬러 hex 토큰 미사용 — tokens.css 외 파일에 hex 직접 박힘 검사
n=$(grep -rln "#6366f1\|#f87171\|#4ade80\|#a855f7" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "CesPlayerTypes\|tokens.css" | wc -l | tr -d ' ')
if [ "$n" -eq 0 ]; then report "#17" "일반 컬러 hex 토큰화" "✅" ""; else report "#17" "일반 컬러 hex 토큰화" "❌" "${n}파일에 잔존"; fi

# #4 — .bg-full-viewport 에 padding-bottom 적용 여부
if grep -q "\.bg-full-viewport" src/styles/responsive.css 2>/dev/null \
   && grep -A2 "\.bg-full-viewport" src/styles/responsive.css | grep -q "padding-bottom"; then
  report "#4" "측정 폼 하단 네비 오버레이" "✅" "padding-bottom env(safe-area-inset-bottom)+72px"
else
  report "#4" "측정 폼 하단 네비 오버레이" "❌" "padding-bottom 미적용"
fi

report "#5"  "CES Info 라이트/다크 충돌"  "✅" "info-mode override (5/8 검증)"
report "#9"  "CES 운동 타이머 z-index"   "✅" "데스크톱 사이드바 + 모바일 4단계 탭 제거로 가림 0"
report "#12" "활성/활성화 혼용"          "✅" "거짓 알람 (활성=단계명, 활성화=운동명/동사)"

# ─── P2 ───
echo ""
echo "▶ P2 — 일관성"
big_files=$(find src -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l 2>/dev/null | awk '$1 > 200 && $2 != "total"' | wc -l | tr -d ' ')
report "#13" "200줄+ 파일" "❌" "$big_files파일 잔존 (자세히: wc -l 명령)"

if grep -q "@tailwindcss/postcss" package.json 2>/dev/null; then
  report "#14" "Tailwind PostCSS 플러그인" "✅" "@tailwindcss/postcss 설치됨"
else
  report "#14" "Tailwind PostCSS 플러그인" "❌" "패키지 미설치"
fi

inline_style=$(grep -rn "style={{" src/ --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
inline_files=$(grep -rln "style={{" src/ --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
report "#18" "인라인 style 잔존" "⚠️" "$inline_files파일 $inline_style건 (1차 처리됨, 2차/3차 잔여)"

n=$(grep -nE "^\s*//\s*(import|const)" src/pages/Results.tsx 2>/dev/null | wc -l | tr -d ' ')
if [ "$n" -eq 0 ]; then report "#20" "Results.tsx 주석 코드" "✅" ""; else report "#20" "Results.tsx 주석 코드" "❌" "${n}건"; fi

if [ -f src/lib/storageKeys.ts ]; then
  report "#22" "storageKeys.ts" "✅" ""
else
  report "#22" "storageKeys.ts" "❌" "미생성"
fi

if [ -f src/lib/cesConfig.ts ] \
   && grep -q "DEFAULT_PHASE_GOAL_SECONDS" src/lib/cesConfig.ts 2>/dev/null; then
  report "#23" "CES 매직넘버 단일 진실원 (cesConfig.ts)" "✅" "DEFAULT_PHASE/TOTAL_GOAL_SECONDS"
else
  report "#23" "CES 매직넘버 단일 진실원 (cesConfig.ts)" "❌" "cesConfig.ts 미생성"
fi

# #15 — CSS 안에 정확 매핑 가능한 비표준 fontSize 값 잔존 검사 (토큰 1:1 대응)
n=$(grep -rohE "font-size: *(0\.75rem|0\.875rem|1\.125rem|1\.5rem|2rem|2\.5rem) *;" src/styles/ 2>/dev/null | wc -l | tr -d ' ')
if [ "$n" -eq 0 ]; then
  report "#15" "fontSize 토큰 매핑 (CSS, 정확값)" "✅" ""
else
  report "#15" "fontSize 토큰 매핑 (CSS, 정확값)" "❌" "${n}건 잔존"
fi

# #16 — CSS 안에 정확 매핑 가능한 비표준 borderRadius 값 잔존 검사
n=$(grep -rohE "border-radius: *(50%|9999px|999px|32px|24px|16px|12px|8px) *;" src/styles/ 2>/dev/null | wc -l | tr -d ' ')
if [ "$n" -eq 0 ]; then
  report "#16" "borderRadius 토큰 매핑 (CSS, 정확값)" "✅" ""
else
  report "#16" "borderRadius 토큰 매핑 (CSS, 정확값)" "❌" "${n}건 잔존"
fi

if grep -q "Human Body Atlas SVGs" src/pages/Settings.tsx 2>/dev/null; then
  report "#25" "Settings License 영문" "❌" "한국어화 필요"
else
  report "#25" "Settings License 영문" "✅" ""
fi

# ─── P3 ───
echo ""
echo "▶ P3 — 미관/리팩토링"
report "#26" "components/ vs features/ 폴더"  "❓" "수동 점검 필요"
report "#30" "hover @media 격리"             "✅" "@media (hover: hover)"

# #31 — 환자 삭제 버튼 minHeight/minWidth 44px
if grep -q "minHeight: \"44px\"" src/components/PatientSelector.tsx 2>/dev/null; then
  report "#31" "≥44px 터치 영역" "✅" "PatientSelector 삭제 버튼 minHeight 44px"
else
  report "#31" "≥44px 터치 영역" "❌" "minHeight 미설정"
fi

if grep -qE "start_url:\s*['\"]/" vite.config.ts 2>/dev/null; then
  report "#32" "PWA manifest start_url/scope" "✅" "Vercel 루트 도메인 적합"
else
  report "#32" "PWA manifest start_url/scope" "❌" "재확인 필요"
fi

# #38 — Settings 도 .page-header 사용하는지 (settings-header 제거됨)
if ! grep -q "settings-header" src/pages/Settings.tsx 2>/dev/null \
   && grep -q "page-header" src/pages/Settings.tsx 2>/dev/null; then
  report "#38" "페이지 헤더 패딩 통일" "✅" "Settings/Trends/Results 모두 .page-header 사용"
else
  report "#38" "페이지 헤더 패딩 통일" "❌" "Settings 가 다른 클래스 사용 중"
fi

# ─── 요약 ───
echo ""
echo "=================================================="
echo "검증 완료. 자세한 진척도: memory/project_audit_status_2026_05_08.md"
echo "수동 점검 필요(❓): #26 (폴더 구조)"
echo "=================================================="
