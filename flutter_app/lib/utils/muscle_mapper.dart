import 'package:flutter/material.dart';
import 'package:flutter_body_atlas/flutter_body_atlas.dart';

class MuscleMapper {
  static final MuscleResolver _resolver = const MuscleResolver();

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

  static List<MuscleInfo> getTargetMuscles(List<String> muscleIds) {
    List<MuscleInfo> parts = [];
    final map = <String, List<String>>{
      'chest': ['pectoralis_major_l', 'pectoralis_major_r'],
      '소흉근': ['pectoralis_major_l', 'pectoralis_major_r'],
      '대흉근': ['pectoralis_major_l', 'pectoralis_major_r'],
      '전방삼각근': ['anterior_deltoid_l', 'anterior_deltoid_r'],
      '삼각근': ['lateral_deltoid_l', 'lateral_deltoid_r'],
      '광배근': ['latissimus_dorsi_l', 'latissimus_dorsi_r'],
      '상부승모근': ['trapezius_upper_l', 'trapezius_upper_r'],
      '견갑거근': ['trapezius_upper_l', 'trapezius_upper_r'],
      '극하근': ['infraspinatus_l', 'infraspinatus_r'],
      '견갑하근': ['infraspinatus_l', 'infraspinatus_r'],
      '하부승모근': ['trapezius_lower_l', 'trapezius_lower_r'],
      '장요근': ['pectineus_l', 'pectineus_r'], // closest to hip flexor
      'Y자': ['trapezius_lower_l', 'trapezius_lower_r'], // Y-Raise
      'T자': ['trapezius_middle_l', 'trapezius_middle_r'], // T-Raise
      '케이블': ['lateral_deltoid_l', 'lateral_deltoid_r'],
    };

    for (var id in muscleIds) {
      if (map.containsKey(id)) {
        for (var svgId in map[id]!) {
          final exact = _resolver.tryById(svgId);
          if (exact != null) parts.add(exact);
        }
      } else {
        // Special logic for catalog groups
        if (id == '전경골근' || id == '후경골근') {
          parts.addAll(MuscleCatalog.legs.where((m) => m.aliases.contains('shin')));
        } else if (id == '비복근' || id == '가자미근' || id == 'calves') {
          parts.addAll(MuscleCatalog.legs.where((m) => m.aliases.contains('calf')));
        } else if (id == '비골근') {
          parts.addAll(MuscleCatalog.legs.where((m) => m.aliases.contains('peroneus longus')));
        } else if (id == '대둔근' || id == '중둔근' || id == 'glutes') {
          parts.addAll(MuscleCatalog.glutes);
        } else if (id == '복횡근' || id == '코어' || id == '전거근' || id == '흉추') {
          parts.addAll(MuscleCatalog.core);
        } else if (id == 'quads') {
          parts.addAll(MuscleCatalog.legs.where((m) => m.aliases.contains('quad')));
        } else if (id == 'hamstrings') {
          parts.addAll(MuscleCatalog.hamstrings);
        } else {
          final exact = _resolver.tryById(id);
          if (exact != null) {
            parts.add(exact);
          } else {
            // Default fallback
            parts.addAll(MuscleCatalog.core);
          }
        }
      }
    }
    return parts;
  }
}
