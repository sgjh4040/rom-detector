export const TEST_PATIENT = {
  id: 'e2e-patient-1',
  name: '테스트환자',
  age: 45,
  painArea: '어깨',
  vasScore: 6,
  lastMeasuredAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

export const TEST_SESSION = {
  patientId: 'e2e-patient-1',
  patientName: '테스트환자',
  patientAge: 45,
  painArea: '어깨',
  vasScore: 6,
  selectedJointIds: ['shoulder'],
  selectedSides: ['좌측', '우측'] as const,
  measurements: {
    shoulder: {
      '좌측': {
        'flexion': 160,
        'extension': 50,
        'abduction': 155,
        'internal_rotation': 70,
        'external_rotation': 80,
      },
      '우측': {
        'flexion': 170,
        'extension': 55,
        'abduction': 170,
        'internal_rotation': 80,
        'external_rotation': 90,
      },
    },
  },
  createdAt: new Date().toISOString(),
};

export const TEST_HISTORY = [
  { ...TEST_SESSION, createdAt: '2026-04-01T10:00:00.000Z' },
  { ...TEST_SESSION, createdAt: '2026-04-10T10:00:00.000Z', measurements: {
    shoulder: {
      '좌측': { flexion: 165, extension: 52, abduction: 160, internal_rotation: 75, external_rotation: 85 },
      '우측': { flexion: 175, extension: 58, abduction: 175, internal_rotation: 85, external_rotation: 90 },
    },
  }},
];

export const SEED_KEYS = {
  session: 'rom_session',
  patients: 'rom_patients',
  history: (patientId: string) => `rom_history_${patientId}`,
  cesDurations: 'ces_history_durations',
} as const;
