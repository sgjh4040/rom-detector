import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Settings, TrendingUp } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", icon: <Home size={20} />, label: "홈" },
  { path: "/settings", icon: <Settings size={20} />, label: "설정" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  patientId?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  patientId,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const trendsItem = patientId
    ? { path: `/trends?patientId=${patientId}`, icon: <TrendingUp size={20} />, label: "측정기록" }
    : null;

  const allNavItems = trendsItem
    ? [NAV_ITEMS[0], trendsItem, NAV_ITEMS[1]]
    : NAV_ITEMS;

  const renderNavItem = (item: {
    path: string;
    icon: React.ReactNode;
    label: string;
  }) => (
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
