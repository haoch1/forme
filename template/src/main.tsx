import { PresetButton as Button } from "@/components/preset-controls";
import { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Link,
  Outlet,
  createHashHistory,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Toaster } from "sonner";
import {
  Folder,
  User,
  Settings,
  LayoutDashboard,
  PanelLeft,
  Sun,
  Moon,
  Shapes,
  LucideProvider,
} from "lucide-react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { applyThemeToDocument, normalizeTheme, type ThemeConfig } from "@/design-system/theme";
import { iconPixels, iconStrokes, tooltipDelays, toastDurations } from "@/design-system/interface-options";
import { InterfaceOptionsProvider } from "@/design-system/interface-context";
import { useInputMethod } from "@/lib/use-input-method";
import { cn } from "@/lib/utils";
import selectedTheme from "./selected-theme.json";
import "./index.css";
import "./selected-theme.css";
const theme = normalizeTheme(selectedTheme as ThemeConfig);
// Honor the selected starting page only on a new entry, preserving shared hash URLs.
if (!window.location.hash || window.location.hash === "#") {
  const start = theme.startPage === "projects" ? "/" : `/${theme.startPage}`;
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${start}`);
}
const ProjectTable = lazy(() =>
  import("@/features/examples/project-table").then((m) => ({
    default: m.ProjectTable,
  })),
);
const ProfileForm = lazy(() =>
  import("@/features/examples/project-form").then((m) => ({
    default: m.ProfileForm,
  })),
);
const Preferences = lazy(() =>
  import("@/features/examples/cards").then((m) => ({ default: m.Preferences })),
);
const BoardDemo = lazy(() =>
  import("@/features/interactions/board").then((m) => ({
    default: m.BoardDemo,
  })),
);
const WorkspaceDemo = lazy(() =>
  import("@/features/layouts/workspace").then((m) => ({
    default: m.WorkspaceDemo,
  })),
);
const PracticalDemos = lazy(() => import("@/features/examples/toolkit-demos").then((m) => ({ default: m.PracticalDemos })));
const usePreferences = create<{ dark: boolean; toggle: () => void }>()(
  persist(
    (set) => ({
      dark: theme.mode === "dark",
      toggle: () => set((s) => ({ dark: !s.dark })),
    }),
    { name: "app-preferences-v1", storage: createJSONStorage(() => theme.advanced.preferenceStorage === "session" ? sessionStorage : localStorage) },
  ),
);
const nav = [
  { to: "/", label: "项目", icon: Folder },
  { to: "/board", label: "看板", icon: LayoutDashboard },
  { to: "/workspace", label: "工作台", icon: PanelLeft },
  { to: "/toolkit", label: "常用能力", icon: Shapes },
  { to: "/profile", label: "资料", icon: User },
  { to: "/settings", label: "设置", icon: Settings },
] as const;
function Shell() {
  useInputMethod();
  const dark = usePreferences((s) => s.dark);
  const toggle = usePreferences((s) => s.toggle);
  useEffect(() => {
    document.title = "应用示例";
    applyThemeToDocument(theme, dark ? "dark" : "light");
  }, [dark]);
  return (
    <LucideProvider size={iconPixels[theme.advanced.iconSize]} strokeWidth={iconStrokes[theme.advanced.iconStroke]}><MotionConfig reducedMotion={theme.motion ? "user" : "always"}><InterfaceOptionsProvider options={theme.advanced} motionEnabled={theme.motion}>
      <div className="app-shell">
        <header className="app-header">
          <span className="app-brand">应用示例</span>
          <Button
            className="ml-auto"
            size="icon"
            variant="ghost"
            onClick={toggle}
            aria-label="切换外观"
          >
            {dark ? <Sun /> : <Moon />}
          </Button>
        </header>
        <main className="app-main">
          <div className={cn("example-shell", theme.navigation === "top" && "top-navigation")}>
            <aside className="example-sidebar">
              <nav className="flex flex-col gap-1" aria-label="应用导航">
                {nav.map(({ to, label, icon: Icon }) => (
                  <Button
                    key={to}
                    variant="ghost"
                    className="justify-start"
                    asChild
                  >
                    <Link
                      to={to}
                      activeProps={{ className: "bg-secondary" }}
                      activeOptions={{ exact: true }}
                    >
                      <Icon data-icon="inline-start" />
                      {label}
                    </Link>
                  </Button>
                ))}
              </nav>
            </aside>
            <div className="example-main">
              <div className="example-content">
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <Outlet />
              </Suspense>
              </div>
            </div>
          </div>
        </main>
        <footer className="app-footer">
          <span>shadcn/ui · Lucide</span>
          <span>本地示例数据</span>
        </footer>
        <Toaster theme={dark ? "dark" : "light"} position={theme.advanced.toastPosition} duration={toastDurations[theme.advanced.toastDuration]} closeButton={theme.advanced.toastCloseButton} />
      </div>
    </InterfaceOptionsProvider></MotionConfig></LucideProvider>
  );
}
const root = createRootRoute({ component: Shell });
const routes = [
  createRoute({ getParentRoute: () => root, path: "/toolkit", component: () => <><h1 className="mb-6 text-2xl font-semibold">常用能力</h1><PracticalDemos motionEnabled={theme.motion} options={theme.advanced} /></> }),
  createRoute({
    getParentRoute: () => root,
    path: "/",
    component: () => (
      <>
        <h1 className="mb-6 text-2xl font-semibold">项目</h1>
        <ProjectTable />
      </>
    ),
  }),
  createRoute({
    getParentRoute: () => root,
    path: "/board",
    component: () => <BoardDemo options={theme.advanced} />,
  }),
  createRoute({
    getParentRoute: () => root,
    path: "/workspace",
    component: WorkspaceDemo,
  }),
  createRoute({
    getParentRoute: () => root,
    path: "/profile",
    component: () => (
      <div className="max-w-xl">
        <h1 className="mb-6 text-2xl font-semibold">个人资料</h1>
        <ProfileForm />
      </div>
    ),
  }),
  createRoute({
    getParentRoute: () => root,
    path: "/settings",
    component: () => (
      <div className="max-w-xl">
        <h1 className="mb-6 text-2xl font-semibold">通知设置</h1>
        <Preferences />
      </div>
    ),
  }),
];
const router = createRouter({
  routeTree: root.addChildren(routes),
  history: createHashHistory(),
});
const client = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <TooltipProvider delayDuration={tooltipDelays[theme.advanced.tooltipDelay]}>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
);
