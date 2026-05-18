import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Home, TrendingUp, Dumbbell, Settings as SettingsIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import { getPatients, hasPatientHistory } from "../../lib/patientHistory";
import { loadRomSession } from "../../lib/romTypes";

type NavItem = { path: string; icon: React.ReactNode; label: string };

const HOME_ITEM: NavItem = { path: "/", icon: <Home className="size-5" />, label: "홈" };
const SETTINGS_ITEM: NavItem = { path: "/settings", icon: <SettingsIcon className="size-5" />, label: "설정" };

// 옛 main 의 AppLayout 동작 복원:
// - 환자 없음: 홈/설정
// - 환자 있음: 홈/측정기록/설정
// - 환자 있고 측정기록 있음: 홈/측정기록/CES/설정
// activeId 는 마지막 세션 patientId → fallback 으로 첫 번째 환자.
const buildNav = (): NavItem[] => {
  const patients = getPatients();
  if (patients.length === 0) return [HOME_ITEM, SETTINGS_ITEM];

  const activeId = loadRomSession()?.patientId ?? patients[0].id;
  const items: NavItem[] = [HOME_ITEM];
  items.push({
    path: `/trends?patientId=${activeId}`,
    icon: <TrendingUp className="size-5" />,
    label: "측정기록",
  });
  if (hasPatientHistory(activeId)) {
    items.push({ path: "/ces", icon: <Dumbbell className="size-5" />, label: "CES" });
  }
  items.push(SETTINGS_ITEM);
  return items;
};

const useVisibleNav = (pathname: string): NavItem[] => {
  const [items, setItems] = React.useState<NavItem[]>(() => buildNav());
  React.useEffect(() => {
    setItems(buildNav());
  }, [pathname]);
  return items;
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
          {visibleNav.slice(1).map((item) => {
            const activePath = item.path.split("?")[0];
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                  pathname === activePath
                    ? "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                    : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
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
