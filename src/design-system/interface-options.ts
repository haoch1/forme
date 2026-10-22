import type { ThemeConfig } from "./theme";
import baseline from "./default-config.json";

export type InterfaceOptions = {
  surface: "plain" | "muted";
  contentWidth: "full" | "wide" | "reading";
  sidebarWidth: "narrow" | "standard" | "wide";
  pagePadding: "compact" | "standard" | "generous";
  iconSize: "small" | "standard" | "large";
  iconStroke: "thin" | "standard" | "bold";
  motionStyle: "fade" | "slide" | "scale";
  motionSpeed: "fast" | "standard" | "relaxed";
  motionEase: "easeOut" | "easeInOut";
  panelDirection: "horizontal" | "vertical";
  panelRatio: "equal" | "focus-left" | "focus-right";
  rememberPanels: boolean;
  dragMode: "handle" | "card";
  dragFeedback: "subtle" | "clear";
  rememberBoard: boolean;
  preferenceStorage: "local" | "session";
  toggleVariant: "default" | "outline";
  tabsStyle: "default" | "line";
  buttonStyle: "default" | "secondary" | "outline";
  validationMode: "submit" | "blur" | "change";
  requiredIndicator: "none" | "asterisk" | "label";
  dialogDismiss: "outside" | "explicit";
  toastDuration: "short" | "standard" | "long";
  toastCloseButton: boolean;
  tooltipSide: "top" | "right" | "bottom" | "left";
  emptyStyle: "plain" | "icon";
  copyStyle: "concise" | "complete";
  viewTransition: "none" | "fade";
  loadingStyle: "skeleton" | "inline";
  errorPlacement: "inline" | "summary";
  toastPosition: "bottom-right" | "top-right" | "bottom-center" | "top-center" | "top-left" | "bottom-left";
  tooltipDelay: "instant" | "standard" | "relaxed";
  controlSize: "sm" | "default" | "lg";
};

// One baseline for fresh sessions, missing legacy fields, reset, and exported templates.
export const defaultInterface = baseline.advanced as InterfaceOptions;

export const textPixels = { compact: 14, standard: 16, large: 18 } as const;
export const iconPixels = { small: 14, standard: 16, large: 20 } as const;
export const iconStrokes = { thin: 1.5, standard: 2, bold: 2.5 } as const;
export const motionSeconds = { fast: 0.1, standard: 0.16, relaxed: 0.28 } as const;
export const tooltipDelays = { instant: 0, standard: 300, relaxed: 700 } as const;
export const toastDurations = { short: 2000, standard: 4000, long: 6000 } as const;
export const validationModes = { submit: "onSubmit", blur: "onBlur", change: "onChange" } as const;

export function uiVariables(theme: ThemeConfig): Record<string, string> {
  const a = { ...defaultInterface, ...theme.advanced };
  const gap = { standard: "16px", compact: "12px", spacious: "24px" }[theme.density];
  return {
    "--spacing": "4px", "--row-padding": "8px", "--ui-stack-gap": gap,
    "--ui-content-width": { full: "none", wide: "1080px", reading: "720px" }[a.contentWidth],
    "--ui-sidebar-width": { narrow: "160px", standard: "216px", wide: "256px" }[a.sidebarWidth],
    "--ui-page-padding": { compact: "16px", standard: "24px", generous: "36px" }[a.pagePadding],
    "--ui-page-surface": a.surface === "muted" ? "var(--muted)" : "var(--background)",
    "--ui-icon-size": `${iconPixels[a.iconSize]}px`, "--ui-icon-stroke": String(iconStrokes[a.iconStroke]),
    "--ui-motion-duration": `${theme.motion ? motionSeconds[a.motionSpeed] : 0}s`,
    "--ui-drop-width": a.dragFeedback === "clear" ? "3px" : "1px",
    "--ui-drop-color": a.dragFeedback === "clear" ? "var(--primary)" : "var(--border)",
  };
}

export function motionPreset(options: InterfaceOptions, enabled: boolean) {
  const offset = enabled ? 8 : 0;
  return {
    initial: { opacity: 0, y: options.motionStyle === "slide" ? offset : 0, scale: enabled && options.motionStyle === "scale" ? 0.95 : 1 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: options.motionStyle === "slide" ? -offset / 2 : 0, scale: enabled && options.motionStyle === "scale" ? 0.95 : 1 },
    transition: { duration: enabled ? motionSeconds[options.motionSpeed] : 0, ease: options.motionEase },
  };
}
