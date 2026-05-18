import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('children 텍스트 렌더', () => {
    render(<Button>시작</Button>);
    expect(screen.getByRole('button', { name: '시작' })).toBeInTheDocument();
  });

  it('클릭 시 onClick 핸들러 호출', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>탭</Button>);
    await userEvent.click(screen.getByRole('button', { name: '탭' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('disabled 면 클릭 무시 + aria 속성 부여', async () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>비활성</Button>);
    const btn = screen.getByRole('button', { name: '비활성' });
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('variant prop 이 className 에 반영 (outline)', () => {
    render(<Button variant="outline">테두리</Button>);
    const btn = screen.getByRole('button', { name: '테두리' });
    expect(btn.className).toContain('border');
  });

  it('size="lg" 면 큰 사이즈 클래스 (h-11) 적용', () => {
    render(<Button size="lg">큰버튼</Button>);
    const btn = screen.getByRole('button', { name: '큰버튼' });
    expect(btn.className).toMatch(/\bh-11\b/);
  });

  it('forwardRef 로 ref 접근 가능', () => {
    const ref: { current: HTMLButtonElement | null } = { current: null };
    render(<Button ref={ref}>ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('추가 className 이 variant class 와 병합', () => {
    render(<Button className="extra-class">조합</Button>);
    const btn = screen.getByRole('button', { name: '조합' });
    expect(btn.className).toContain('extra-class');
  });
});
