import { lazy, Suspense } from "react";
import { createRouter, createRoute, createRootRoute, redirect, stripSearchParams } from "@tanstack/react-router";
import { AppShell } from "./shell";
import { Skeleton } from "@/components/ui/skeleton";
const Workbench = lazy(() => import("@/features/guide/index"));
const root = createRootRoute({
  component: AppShell,
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "", view: typeof s.view === "string" ? s.view : "projects" }),
  search: { middlewares: [stripSearchParams({ q: "", view: "projects" })] },
  notFoundComponent: () => <div className="p-8">页面不存在，请返回工作台。</div>,
});
const routes = [createRoute({ getParentRoute: () => root, path: "/", component: () => <Suspense fallback={<Skeleton className="m-6 h-80" />}><Workbench /></Suspense> })];
// Keep old bookmarks usable while presenting a single workbench.
const legacy = { advanced: "advanced", toolkit: "tools", starter: "export", resources: "resources", components: "cards", layouts: "panels", interactions: "board", pages: "app" } as const;
const legacyRoutes = Object.entries(legacy).map(([path, hash]) => createRoute({ getParentRoute: () => root, path: `/${path}`, beforeLoad: () => { throw redirect({ to: "/", search: { q: "", view: "projects" }, hash }); } }));
export const router = createRouter({ routeTree: root.addChildren([...routes, ...legacyRoutes]), defaultPreload: "intent" });
declare module "@tanstack/react-router" { interface Register { router: typeof router; } }
