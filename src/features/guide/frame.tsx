import { useEffect, useLayoutEffect, useState } from "react";
import { LucideProvider } from "lucide-react";
import { MotionConfig } from "motion/react";
import { Toaster } from "@/components/ui/sonner";
import { useThemeStore, useThemeSync } from "@/stores/theme-store";
import { applyThemeToDocument } from "@/design-system/theme";
import { iconPixels, iconStrokes, tooltipDelays, toastDurations } from "@/design-system/interface-options";
import { InterfaceDetailsDemo } from "@/features/examples/details-demo";
import { DetailOptionPreview } from "@/features/examples/detail-option-preview";
import { detailOptionIds } from "@/design-system/option-catalog";
import { InterfaceOptionsProvider } from "@/design-system/interface-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "motion/react";
import { PreviewBoundary } from "./preview-boundary";
import { ApplicationPreview } from "@/features/examples/app-preview";
import { IconsDemo, MotionDemo, PanelsDemo, PreferenceDemo } from "@/features/examples/toolkit-demos";

import { ComponentCards as Cards } from "@/features/examples/cards";
import { BoardDemo as Board } from "@/features/interactions/board";
import { isPreviewId, type PreviewId } from "./preview-types";

export default function ResponsivePreview() {
  const theme = useThemeStore((s) => s.theme);
  const [view, setView] = useState(theme.startPage);
  const [example, setExample] = useState<{ id: string; revision: number } | null>(null);
  const [demo, setDemo] = useState<PreviewId>(() => {
    const initial = new URLSearchParams(window.location.search).get("demo");
    return isPreviewId(initial) ? initial : "cards";
  });
  useThemeSync();
  useLayoutEffect(() => {
    document.documentElement.dataset.embeddedPreview = "true";
    applyThemeToDocument(theme);
    document.title = "界面预览";
  }, [theme]);
  useEffect(() => {
    const onViewport = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      if (event.data?.type === "style-preview-demo") {
        if (isPreviewId(event.data.demo)) setDemo(event.data.demo);
        return;
      }
      if (event.data?.type === "style-preview-example") {
        const next = event.data.example;
        if (next === null) setExample(null);
        else if (detailOptionIds.includes(next?.id) && Number.isSafeInteger(next?.revision)) setExample({ id: next.id, revision: next.revision });
        return;
      }
      if (event.data?.type !== "style-preview-viewport") return;
      const { center, height } = event.data;
      if (typeof center === "number" && Number.isFinite(center) && typeof height === "number" && Number.isFinite(height)) {
        document.documentElement.style.setProperty("--preview-overlay-top", `${center}px`);
        document.documentElement.style.setProperty("--preview-overlay-height", `${height}px`);
      }
    };
    window.addEventListener("message", onViewport);
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !document.querySelector('[role="dialog"][data-state="open"], [role="menu"][data-state="open"], [role="listbox"][data-state="open"], [role="tooltip"]')) {
        window.parent.postMessage({ type: "style-preview-escape" }, window.location.origin);
      }
    };
    window.addEventListener("keydown", onEscape, true);
    window.parent.postMessage({ type: "style-preview-ready" }, window.location.origin);
    return () => { window.removeEventListener("message", onViewport); window.removeEventListener("keydown", onEscape, true); };
  }, []);
  useEffect(() => {
    const content = document.querySelector(".frame-preview");
    if (!content) return;
    let pending = 0;
    const report = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        window.parent.postMessage({ type: "style-preview-size", height: Math.ceil(content.getBoundingClientRect().height) }, window.location.origin);
      });
    };
    const observer = new ResizeObserver(report);
    observer.observe(content);
    report();
    return () => { observer.disconnect(); cancelAnimationFrame(pending); };
  }, []);
  const a = theme.advanced;
  return <LucideProvider size={iconPixels[a.iconSize]} strokeWidth={iconStrokes[a.iconStroke]}>
    <MotionConfig reducedMotion={theme.motion ? "user" : "always"}>
      <InterfaceOptionsProvider options={a}><TooltipProvider delayDuration={tooltipDelays[a.tooltipDelay]}><PreviewBoundary><div className="frame-preview">
        {demo === "app" ? <ApplicationPreview navigation={theme.navigation} view={view} onViewChange={(id) => setView(id as typeof view)} options={a} />
          : <motion.div key={demo} className="frame-demo" initial={a.viewTransition === "fade" ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.12 }}>
            {demo === "cards" ? <Cards /> : demo === "details" ? <div className="flex flex-col gap-6">{example && <DetailOptionPreview key={`${example.id}-${example.revision}`} id={example.id} />}<InterfaceDetailsDemo /></div> : demo === "icons" ? <IconsDemo /> : demo === "motion" ? <MotionDemo key={`${theme.motion}-${a.motionStyle}-${a.motionSpeed}-${a.motionEase}`} enabled={theme.motion} options={a} />
              : demo === "panels" ? <PanelsDemo key={`${a.panelDirection}-${a.panelRatio}-${a.rememberPanels}`} options={a} />
                : demo === "state" ? <PreferenceDemo key={a.preferenceStorage} options={a} />
                : <Board key={String(a.rememberBoard)} options={a} />}
          </motion.div>}
      </div></PreviewBoundary>
      <Toaster theme={theme.mode} position={a.toastPosition} duration={toastDurations[a.toastDuration]} closeButton={a.toastCloseButton} /></TooltipProvider></InterfaceOptionsProvider>
    </MotionConfig>
  </LucideProvider>;
}
