import 'package:flutter/material.dart';
import 'package:flutter_body_atlas/flutter_body_atlas.dart';

/// CES 단계별 강조 색 + SVG ID → MuscleInfo 변환 (thin shell).
///
/// [v2 — 2026-05-12] 한글 → 영어 매핑을 React 측으로 이전 (`src/lib/ces/muscleMapping.ts`).
/// Flutter 는 이미 영어 SVG ID 로 변환된 입력을 받아 색칠만 담당한다.
/// 단일 진실의 원천(SSOT)을 React 에 둠으로써 매핑 추가/수정 시 Flutter 재빌드 불필요.
class MuscleMapper {
  static final MuscleResolver _resolver = const MuscleResolver();

  /// CES 단계별 강조 색 (이 부분은 패키지 위젯이 직접 활용한다면 유지)
  static Color getHighlightColor(String cesPhase) {
    switch (cesPhase.toLowerCase()) {
      case 'inhibit':
        return Colors.orangeAccent;
      case 'lengthen':
        return Colors.blue;
      case 'activate':
        return Colors.redAccent;
      case 'integrate':
        return Colors.green;
      default:
        return Colors.redAccent;
    }
  }

  /// 그룹 ID(`back`, `core`, `glutes`, ...) → 그룹 내 MuscleInfo 리스트.
  /// React 측 매핑에서 광범위 부위 표시용으로 사용된다 (예: 척추기립근 → `back`).
  static List<MuscleInfo>? _tryGroup(String id) {
    switch (id) {
      case 'hamstrings':
        return MuscleCatalog.hamstrings;
      case 'legs':
        return MuscleCatalog.legs;
      case 'glutes':
        return MuscleCatalog.glutes;
      case 'core':
        return MuscleCatalog.core;
      case 'arms':
        return MuscleCatalog.arms;
      case 'neck':
        return MuscleCatalog.neck;
      case 'back':
        return MuscleCatalog.back;
      case 'shoulders':
        return MuscleCatalog.shoulders;
      case 'chest':
        return MuscleCatalog.chest;
      case 'adductors':
        return MuscleCatalog.adductors;
      default:
        return null;
    }
  }

  /// SVG ID 배열 → `MuscleInfo` 리스트.
  /// - 그룹 ID 면 카탈로그 그룹 전체 전개
  /// - 개별 ID 면 `_resolver.tryById` 로 해결
  /// - 매칭 실패한 ID 는 무시 (이전 'core 강제 색칠' fallback 제거 — 회색 유지)
  static List<MuscleInfo> getTargetMuscles(List<String> svgIds) {
    final parts = <MuscleInfo>[];
    final seen = <String>{};
    for (final id in svgIds) {
      if (id.isEmpty) continue;
      // 1) 그룹 ID 먼저 시도
      final group = _tryGroup(id);
      if (group != null) {
        for (final m in group) {
          if (seen.add(m.id)) parts.add(m);
        }
        continue;
      }
      // 2) 개별 ID 시도
      final exact = _resolver.tryById(id);
      if (exact != null && seen.add(exact.id)) {
        parts.add(exact);
      }
      // 3) 매칭 실패 → 무시 (개발 콘솔에서만 확인 가능)
    }
    return parts;
  }
}
