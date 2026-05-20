import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MobileBottomNav } from './AppShell';

const renderNav = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <MobileBottomNav />
    </MemoryRouter>,
  );

describe('MobileBottomNav — 환자 유무·측정기록 따른 nav 분기', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('환자 없음: 홈 + CES 정보 + 설정 3개 노출 (측정기록·프로토콜 미노출)', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /홈/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /CES 정보/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /설정/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /측정기록/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^프로토콜$/ })).not.toBeInTheDocument();
  });

  it('환자 있고 측정기록 없음: 홈/측정기록/CES 정보/설정 4개 (프로토콜 미노출)', () => {
    localStorage.setItem(
      'rom_patients',
      JSON.stringify([{ id: 'p1', name: 'X', age: 30, painArea: '', vasScore: 0, createdAt: Date.now(), lastMeasuredAt: null }]),
    );
    renderNav();
    expect(screen.getByRole('link', { name: /홈/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /측정기록/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /CES 정보/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /설정/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^프로토콜$/ })).not.toBeInTheDocument();
  });

  it('환자 + 측정기록 있음: 홈/측정기록/프로토콜/CES 정보/설정 5개 노출', () => {
    localStorage.setItem(
      'rom_patients',
      JSON.stringify([{ id: 'p1', name: 'X', age: 30, painArea: '', vasScore: 0, createdAt: Date.now(), lastMeasuredAt: Date.now() }]),
    );
    localStorage.setItem(
      'rom_history_p1',
      JSON.stringify([{
        patientId: 'p1', patientName: 'X', patientAge: 30,
        selectedJointIds: ['shoulder'], selectedSides: ['좌측'],
        measurements: { shoulder: { 좌측: { flexion: 90 } } },
        createdAt: new Date().toISOString(),
      }]),
    );
    renderNav();
    expect(screen.getByRole('link', { name: /홈/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /측정기록/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^프로토콜$/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /CES 정보/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /설정/ })).toBeInTheDocument();
  });

  it('측정기록 링크는 activeId(patientId) 를 쿼리에 포함', () => {
    localStorage.setItem(
      'rom_patients',
      JSON.stringify([{ id: 'patient-abc', name: 'X', age: 30, painArea: '', vasScore: 0, createdAt: Date.now(), lastMeasuredAt: null }]),
    );
    renderNav();
    const trendsLink = screen.getByRole('link', { name: /측정기록/ }) as HTMLAnchorElement;
    expect(trendsLink.getAttribute('href')).toContain('patientId=patient-abc');
  });
});
