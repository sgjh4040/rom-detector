import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Index } from "./pages/Index";
import { RomMeasurement } from "./pages/RomMeasurement";
import { Results } from "./pages/Results";
import { CesProtocol } from "./pages/CesProtocol";
import { CesPlayerPage } from "./pages/CesPlayerPage";
import { CesFlutterPage } from "./pages/CesFlutterPage";
import { Settings } from "./pages/Settings";
import { Trends } from "./pages/Trends";
import { Lab } from "./pages/Lab";
import { CesInfo } from "./pages/CesInfo";

// 각 페이지가 스스로 AppLayout을 래핑하고 patientId를 명시적으로 전달한다.
// 이렇게 해야 "새 환자 등록 중"처럼 의도적으로 환자 맥락을 해제한 상태와
// "아예 안 넘긴 상태"를 구분할 수 있다.
const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Full-screen pages (레이아웃 래퍼 없음) */}
        <Route path="/measure" element={<RomMeasurement />} />
        <Route path="/ces" element={<CesProtocol />} />
        <Route path="/ces-player" element={<CesPlayerPage />} />
        <Route path="/ces-flutter" element={<CesFlutterPage />} />
        <Route path="/cesinfo" element={<CesInfo />} />

        {/* AppLayout은 각 페이지 내부에서 직접 래핑 */}
        <Route path="/" element={<Index />} />
        <Route path="/results" element={<Results />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/lab" element={<Lab />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
