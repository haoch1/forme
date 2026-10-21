import { useEffect } from "react";
import { useInputMethod } from "@/lib/use-input-method";
import { Outlet } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { Toaster } from "sonner";
import { useThemeSync } from "@/stores/theme-store";
import { applyThemeToDocument, initialTheme } from "@/design-system/theme";

export function AppShell() {
  useThemeSync();
  useEffect(() => {
    // The workbench is a stable tool; selected project styling belongs to the iframe.
    applyThemeToDocument(initialTheme);
    document.title = "Forme · 前端风格工作台";
  }, []);
  useInputMethod();
 return <MotionConfig reducedMotion="user">
    <div className="app-shell">
      <a href="#main-content" className="skip-link">跳到主要内容</a>
      <Outlet />
      <Toaster theme="light" closeButton position="bottom-right" />
    </div>
  </MotionConfig>;
}
