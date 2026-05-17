import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Home, LineChart, Dumbbell, Settings as SettingsIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import { getPatients } from "../../lib/patientHistory";

type NavItem = { path: string; icon: React.ReactNode; label: string; requiresPatient?: boolean };

const NAV: NavItem[] = [
  { path: "/", icon: <Home className="size-5" />, label: "홈" },
  { path: "/measure", icon: <Activity className="size-5" />, label: "측정", requiresPatient: true },
  { path: "/results", icon: <LineChart className="size-5" />, label: "결과", requiresPatient: true },
  { path: "/ces", icon: <Dumbbell className="size-5" />, label: "CES", requiresPatient: true },
  { path: "/settings", icon: <SettingsIcon className="size-5" />, label: "설정" },
];

// 환자 유무에 따라 노출할 nav 를 결정 — 환자 없으면 측정/결과/CES 비활성
const useVisibleNav = (pathname: string): NavItem[] => {
  const [hasPatients, setHasPatients] = React.useState<boolean>(
    () => getPatients().length > 0,
  );
  React.useEffect(() => {
    setHasPatients(getPatients().length > 0);
  }, [pathname]);
  return hasPatients ? NAV : NAV.filter((i) => !i.requiresPatient);
};

export const TopNav: React.FC = () => {
  const { pathname } = useLocation();
  const visibleNav = useVisibleNav(pathname);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/80">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-[var(--color-foreground)] no-underline"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
            <Activity className="size-4" strokeWidth={2.5} />
          </div>
          <span className="text-base font-semibold tracking-tight">ROM Detector</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {visibleNav.slice(1).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                pathname === item.path
                  ? "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export const MobileBottomNav: React.FC = () => {
  const { pathname } = useLocation();
  const visibleNav = useVisibleNav(pathname);
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div
        className="mx-auto grid max-w-3xl"
        style={{ gridTemplateColumns: `repeat(${visibleNav.length}, minmax(0, 1fr))` }}
      >
        {visibleNav.map((item) => {
          const active = pathname === item.path.split("?")[0];
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                active
                  ? "text-[var(--color-foreground)]"
                  : "text-[var(--color-muted-foreground)]",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-10 items-center justify-center rounded-md transition-colors",
                  active && "bg-[var(--color-muted)]",
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  // Athletic Performance 톤 — 라이트 (2026-05-17)
  <div
    data-redesign="true"
    className="min-h-svh flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] font-sans"
  >
    <TopNav />
    <main className="flex-1 pb-20 md:pb-8">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">{children}</div>
    </main>
    <MobileBottomNav />
  </div>
);
