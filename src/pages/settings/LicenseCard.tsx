// LicenseCard.tsx — Settings 오픈소스 라이선스 섹션 (redesign-spike).
import React from "react";
import { ExternalLink } from "lucide-react";

export const LicenseCard: React.FC = () => (
  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
    <h2 className="text-base font-bold tracking-tight text-[var(--color-foreground)]">
      오픈소스 라이선스
    </h2>
    <div className="mt-4 flex flex-col gap-2">
      <h3 className="text-sm font-bold text-[var(--color-foreground)]">
        인체 해부 SVG (Human Body Atlas)
      </h3>
      <p className="text-sm text-[var(--color-muted-foreground)]">
        이 앱은 flutter_body_atlas 가 제공하는 인체 해부 SVG 그래픽을 사용합니다.
      </p>
      <p className="text-sm text-[var(--color-foreground)]">
        <span className="font-bold">라이선스:</span> CC BY 4.0
      </p>
      <a
        href="https://creativecommons.org/licenses/by/4.0/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-fit items-center gap-1 text-sm font-bold text-[var(--color-accent)] hover:underline"
      >
        라이선스 보기
        <ExternalLink className="size-3" />
      </a>
      <div className="mt-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-3 text-xs text-[var(--color-muted-foreground)]">
        원본 그래픽은 본 웹 앱의 동적 색상 하이라이트 기능에 맞게 재조정되었습니다.
      </div>
    </div>
  </div>
);
