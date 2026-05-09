// LicenseCard.tsx — Settings 페이지의 오픈소스 라이선스 섹션 (audit #13).
// 정적 컨텐츠라 stateless. flutter_body_atlas SVG (CC BY 4.0) 안내.
import React from "react";

export const LicenseCard: React.FC = () => {
  return (
    <div className="card settings-card">
      <h2>오픈소스 라이선스</h2>
      <div className="license-info">
        <h3>인체 해부 SVG (Human Body Atlas)</h3>
        <p>
          이 앱은 flutter_body_atlas 가 제공하는 인체 해부 SVG 그래픽을
          사용합니다.
        </p>
        <p>
          <strong>라이선스:</strong> CC BY 4.0
        </p>
        <p>
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer"
          >
            라이선스 보기
          </a>
        </p>
        <div className="license-note">
          원본 그래픽은 본 웹 앱의 동적 색상 하이라이트 기능에 맞게
          재조정되었습니다.
        </div>
      </div>
    </div>
  );
};
