import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Settings, TrendingUp, Dumbbell } from "lucide-react";
import { hasPatientHistory } from "../lib/patientHistory";

interface NavItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

const HOME_ITEM: NavItem = { path: "/", icon: <Home size={20} />, label: "홈" };
const SETTINGS_ITEM: NavItem = { path: "/settings", icon: <Settings size={20} />, label: "설정" };

interface AppLayoutProps {
  children: React.ReactNode;
  /** 현재 선택된 환자 ID — 없으면 홈/설정만 표시 */
  patientId?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  patientId,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // 환자 선택 시에만 측정기록 탭 추가
  const trendsItem: NavItem | null = patientId
    ? { path: `/trends?patientId=${patientId}`, icon: <TrendingUp size={20} />, label: "측정기록" }
    : null;

  // 환자 선택 + 측정 기록 있을 때만 CES 탭 추가
  const cesItem: NavItem | null =
    patientId && hasPatientHistory(patientId)
      ? { path: "/ces", icon: <Dumbbell size={20} />, label: "CES" }
      : null;

  const allNavItems: NavItem[] = [
    HOME_ITEM,
    ...(trendsItem ? [trendsItem] : []),
    ...(cesItem ? [cesItem] : []),
    SETTINGS_ITEM,
  ];

  const renderNavItem = (item: NavItem) => (
    <button
      key={item.path}
      className={`nav-item ${currentPath === item.path.split("?")[0] ? "active" : ""}`}
      onClick={() => navigate(item.path)}
    >
      <span className="nav-icon">{item.icon}</span>
      {item.label}
    </button>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="app-sidebar">
        <div className="nav-logo">V</div>
        {allNavItems.map(renderNavItem)}
      </nav>

      {/* Main Content */}
      <div className="app-main-with-sidebar">{children}</div>

      {/* Mobile Bottom NavBar */}
      <nav className="app-bottom-nav">{allNavItems.map(renderNavItem)}</nav>
    </>
  );
};
