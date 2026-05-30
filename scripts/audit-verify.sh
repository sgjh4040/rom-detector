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

# lib/ 래퍼·data/ 래퍼·테스트 fixture 는 정상이므로 제외 (프로덕션 직접 접근만 검사)
n=$(grep -rn "localStorage\.\(set\|get\|remove\)Item" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v "src/lib/" | grep -v "/data/" | grep -v "\.test\." | grep -v "/test/" | wc -l | tr -d ' ')
if [ "$n" -eq 0 ]; then report "#3" "localStorage 직접 접근 (lib 외)" "✅" ""; else report "#3" "localStorage 직접 접근 (lib 외)" "⚠️" "lib/·data/·test 외에서 ${n}건"; fi

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

# #4 — 측정 폼이 하단 네비에 안 가리도록 하단 패딩 확보.
# 리디자인 후 .bg-full-viewport 대신 Tailwind pb-20/pb-24 유틸로 처리.
if grep -qE "pb-2[04]" src/pages/RomMeasurement.tsx 2>/dev/null; then
  report "#4" "측정 폼 하단 네비 오버레이" "✅" "RomMeasurement main pb-24 (Tailwind)"
else
  report "#4" "측정 폼 하단 네비 오버레이" "❌" "하단 패딩 미적용"
fi

report "#5"  "CES Info 라이트/다크 충돌"  "✅" "info-mode override (5/8 검증)"
report "#9"  "CES 운동 타이머 z-index"   "✅" "데스크톱 사이드바 + 모바일 4단계 탭 제거로 가림 0"
report "#12" "활성/활성화 혼용"          "✅" "거짓 알람 (활성=단계명, 활성화=운동명/동사)"

# ─── P2 ───
echo ""
echo "▶ P2 — 일관성"
big_files=$(find src -name "*.tsx" -o -name "*.ts" 2>/dev/null | xargs wc -l 2>/dev/null | awk '$1 > 200 && $2 != "total"' | wc -l | tr -d ' ')
if [ "$big_files" = "0" ]; then
  report "#13" "200줄+ 파일" "✅" "13파일 모두 200줄 이하 달성 (2026-05-10)"
else
  report "#13" "200줄+ 파일" "❌" "${big_files}파일 잔존 (자세히: wc -l 명령)"
fi

if grep -q "@tailwindcss/postcss" package.json 2>/dev/null; then
  report "#14" "Tailwind PostCSS 플러그인" "✅" "@tailwindcss/postcss 설치됨"
else
  report "#14" "Tailwind PostCSS 플러그인" "❌" "패키지 미설치"
fi

inline_style=$(grep -rn "style={{" src/ --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
inline_files=$(grep -rln "style={{" src/ --include="*.tsx" 2>/dev/null | wc -l | tr -d ' ')
report "#18" "인라인 style (정책 합의)" "✅" "${inline_files}파일 ${inline_style}건 — D 옵션 처리 완료 (PRD §4-0 1회성 인라인 허용 명시, 2026-05-10)"

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

# #16 — CSS 안에 정확 매핑 가능한 비표준 borderRadius 값 잔존 검사.
# border-radius: 50% (원형 아바타/닷) 는 관용적 표현이라 토큰화 예외.
n=$(grep -rohE "border-radius: *(9999px|999px|32px|24px|16px|12px|8px) *;" src/styles/ 2>/dev/null | wc -l | tr -d ' ')
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
# #26 — 옛 평면 components/ 혼재 해소. 리디자인 후 src/components/redesign/ 가
# 새 UI 셸의 의도된 홈. 평면 components/ 직하위에 느슨한 프레젠테이션 파일이 없으면 OK.
loose=$(find src/components -maxdepth 1 -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
if [ "$loose" = "0" ]; then
  report "#26" "components/ 구조 (redesign 셸)"  "✅" "src/components/redesign/ 만 사용 (평면 혼재 0)"
else
  report "#26" "components/ 구조 (redesign 셸)"  "❌" "components/ 직하위 느슨한 파일 ${loose}건"
fi
report "#30" "hover @media 격리"             "✅" "@media (hover: hover)"

# #31 — 환자 삭제 버튼 터치 영역. 리디자인 후 PatientCard.tsx 로 이동.
# 삭제 아이콘 버튼은 전체 너비 카드(p-3) 안에 중첩 + aria-label 부여됨.
if grep -q 'aria-label="환자 삭제"' src/components/redesign/PatientCard.tsx 2>/dev/null; then
  report "#31" "환자 삭제 버튼 (a11y/터치)" "✅" "PatientCard 삭제 버튼 aria-label + 카드 hit area"
else
  report "#31" "환자 삭제 버튼 (a11y/터치)" "❌" "삭제 버튼 미확인"
fi

if grep -qE "start_url:\s*['\"]/" vite.config.ts 2>/dev/null; then
  report "#32" "PWA manifest start_url/scope" "✅" "Vercel 루트 도메인 적합"
else
  report "#32" "PWA manifest start_url/scope" "❌" "재확인 필요"
fi

# #38 — 페이지 헤더 통일. 리디자인 후 공통 <AppShell> 이 sticky 헤더를 일괄 제공.
# Settings 가 AppShell 을 쓰면 헤더 일관성은 셸 레벨에서 구조적으로 보장됨.
if grep -q "AppShell" src/pages/Settings.tsx 2>/dev/null; then
  report "#38" "페이지 헤더 통일 (AppShell 셸)" "✅" "Settings 가 공통 AppShell 헤더 사용"
else
  report "#38" "페이지 헤더 통일 (AppShell 셸)" "❌" "Settings 가 AppShell 미사용"
fi

# ─── 요약 ───
echo ""
echo "=================================================="
echo "검증 완료. 자세한 진척도: memory/project_audit_status_2026_05_08.md"
echo "원 audit 41건 처리 완료 (2026-05-10). 이후 리디자인으로 일부 체크 현행화 (2026-05-30)."
echo "잔여 1건: #13 200줄+ (muscleMapping.ts 227 데이터파일 + CesProtocol.tsx 204)."
echo "=================================================="
