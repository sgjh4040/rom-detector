import type { Patient, RomSession } from './romTypes';

const PATIENTS_KEY = 'rom_patients';

/** 전체 환자 목록 불러오기 */
export const getPatients = (): Patient[] => {
    try {
        const saved = localStorage.getItem(PATIENTS_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('환자 목록 로드 실패:', error);
        return [];
    }
};

/** 환자 정보 저장 또는 업데이트 */
export const savePatient = (patient: Patient): void => {
    try {
        const patients = getPatients();
        const idx = patients.findIndex(p => p.id === patient.id);
        if (idx >= 0) {
            patients[idx] = patient;
            //기존 환자 정보 업데이트
        } else {
            patients.push(patient);
            //새 환자 정보 추가
        }
        localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
    } catch (error) {
        console.error('환자 저장 실패:', error);
    }
};

/** 특정 환자의 모든 측정 히스토리 불러오기 */
export const getPatientHistory = (patientId: string): RomSession[] => {
    try {
        const key = `rom_history_${patientId}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('히스토리 로드 실패:', error);
        return [];
    }
};

/** 새로운 측정 세션을 히스토리에 추가 */
export const addSessionToHistory = (patientId: string, session: RomSession): void => {
    try {
        const history = getPatientHistory(patientId);
        // 중복 저장 방지 (createdAt 기준)
        if (history.some(s => s.createdAt === session.createdAt)) return;

        history.push(session);
        // 최근 순으로 정렬
        history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        localStorage.setItem(`rom_history_${patientId}`, JSON.stringify(history));

        // 환자의 마지막 측정일 업데이트
        const patients = getPatients();
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
            patient.lastMeasuredAt = session.createdAt;
            savePatient(patient);
        }
    } catch (error) {
        console.error('히스토리 저장 실패:', error);
    }
};

/** 환자 정보와 모든 히스토리 삭제 */
export const deletePatient = (patientId: string): void => {
    try {
        // 1. 환자 목록에서 제거
        const patients = getPatients();
        const filtered = patients.filter(p => p.id !== patientId);
        localStorage.setItem(PATIENTS_KEY, JSON.stringify(filtered));

        // 2. 해당 환자의 히스토리 삭제
        localStorage.removeItem(`rom_history_${patientId}`);

        // 3. 현재 세션이 해당 환자라면 삭제
        const currentSession = localStorage.getItem('rom_session');
        if (currentSession) {
            const parsed = JSON.parse(currentSession);
            if (parsed.patientId === patientId) {
                localStorage.removeItem('rom_session');
            }
        }
    } catch (error) {
        console.error('환자 삭제 실패:', error);
    }
};
