import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
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

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Full-screen pages (no layout wrapper) */}
        <Route path="/measure" element={<RomMeasurement />} />
        <Route path="/ces" element={<CesProtocol />} />
        <Route path="/ces-player" element={<CesPlayerPage />} />
        <Route path="/ces-flutter" element={<CesFlutterPage />} />
        <Route path="/cesinfo" element={<CesInfo />} />

        {/* Pages with AppLayout (sidebar / bottom nav) */}
        <Route path="/" element={<Index />} />
        <Route
          path="/results"
          element={
            <AppLayout>
              <Results />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <Settings />
            </AppLayout>
          }
        />
        <Route
          path="/trends"
          element={
            <AppLayout>
              <Trends />
            </AppLayout>
          }
        />
        <Route
          path="/lab"
          element={
            <AppLayout>
              <Lab />
            </AppLayout>
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
