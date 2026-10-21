import type { ThemeConfig } from "./theme";
import baseline from "./default-config.json";

export type InterfaceOptions = {
  surface: "plain" | "muted";
  border: "default" | "soft" | "strong";
  shadow: "none" | "subtle" | "raised";
  tableStyle: "plain" | "striped";
  contentWidth: "full" | "wide" | "reading";
  sidebarWidth: "narrow" | "standard" | "wide";
  pagePadding: "compact" | "standard" | "generous";
  iconSize: "small" | "standard" | "large";
  iconStroke: "thin" | "standard" | "bold";
  motionStyle: "fade" | "slide" | "scale";
  motionSpeed: "fast" | "standard" | "relaxed";
  motionEase: "easeOut" | "easeInOut";
  actionIconMotion: "off" | "click" | "hover";
  actionIconLoading: "spin" | "static";
  panelDirection: "horizontal" | "vertical";
  panelRatio: "equal" | "focus-left" | "focus-right";
  rememberPanels: boolean;
  dragMode: "handle" | "card";
  dragFeedback: "subtle" | "clear";
  rememberBoard: boolean;
  preferenceStorage: "local" | "session";
  focusStyle: "subtle" | "clear";
  selectionStyle: "soft" | "outline" | "segmented";
  tabsStyle: "segmented" | "outline";
  buttonStyle: "solid" | "secondary" | "outline";
  inputStyle: "outline" | "filled";
  validationMode: "submit" | "blur" | "change";
  requiredIndicator: "none" | "asterisk" | "label";
  tableHover: "muted" | "none";
  tableDividers: "rows" | "grid" | "none";
  dialogDismiss: "outside" | "explicit";
  toastDuration: "short" | "standard" | "long";
  toastCloseButton: boolean;
  tooltipSide: "top" | "right" | "bottom" | "left";
  emptyStyle: "plain" | "icon";
  textWeight: "regular" | "medium";
  hoverStyle: "muted" | "border";
  disabledStyle: "standard" | "soft";
  copyStyle: "concise" | "complete";
  groupSpacing: "compact" | "standard" | "relaxed";
  separatorStyle: "line" | "space";
  viewTransition: "none" | "fade";
  loadingStyle: "skeleton" | "inline";
  errorPlacement: "inline" | "summary";
  toastPosition: "bottom-right" | "top-right" | "bottom-center" | "top-center" | "top-left" | "bottom-left";
  dialogSize: "compact" | "standard" | "wide";
  overlayStyle: "subtle" | "dim";
  tooltipDelay: "instant" | "standard" | "relaxed";
  controlHeight: "compact" | "standard" | "comfortable";
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
  const density = { compact: ["24px", "16px", "9.6px"], comfortable: ["28px", "20px", "15.2px"], spacious: ["32px", "24px", "18.4px"] }[theme.density];
  return {
    // Tailwind's spacing unit also sizes thumbs, avatars, charts and icons.
    // Density changes layout spacing, never the primitive geometry.
    "--spacing": "4px", "--row-padding": density[2],
    "--ui-card-spacing": density[0], "--ui-stack-gap": density[1],
    "--ui-content-width": { full: "none", wide: "1080px", reading: "720px" }[a.contentWidth],
    "--ui-sidebar-width": { narrow: "160px", standard: "216px", wide: "256px" }[a.sidebarWidth],
    "--ui-page-padding": { compact: "16px", standard: "24px", generous: "36px" }[a.pagePadding],
    "--ui-page-surface": a.surface === "muted" ? "var(--muted)" : "var(--background)",
    "--ui-row-stripe": a.tableStyle === "striped" ? "var(--muted)" : "transparent",
    "--ui-card-shadow": { none: "0 0 0 0 transparent", subtle: "0 1px 3px color-mix(in oklab, var(--foreground) 8%, transparent)", raised: "0 4px 14px color-mix(in oklab, var(--foreground) 12%, transparent)" }[a.shadow],
    "--ui-icon-size": `${iconPixels[a.iconSize]}px`, "--ui-icon-stroke": String(iconStrokes[a.iconStroke]),
    "--ui-motion-duration": `${theme.motion ? motionSeconds[a.motionSpeed] : 0}s`,
    "--ui-loading-animation": theme.motion && a.actionIconLoading === "spin" ? "spin 1s linear infinite" : "none",
    "--ui-drop-width": a.dragFeedback === "clear" ? "3px" : "1px",
    "--ui-drop-color": a.dragFeedback === "clear" ? "var(--primary)" : "var(--border)",
    "--ui-focus-width": a.focusStyle === "clear" ? "2px" : "1px",
    "--ui-selected-bg": "var(--background)",
    "--ui-selected-border": a.selectionStyle === "outline" ? "var(--foreground)" : "color-mix(in oklab,var(--foreground) 40%,var(--background))",
    "--ui-row-hover": a.tableHover === "muted" ? "color-mix(in oklab,var(--muted) 70%,var(--background))" : "var(--ui-row-rest,transparent)",
    "--ui-table-row-border": a.tableDividers === "none" ? "0px" : "1px",
    "--ui-table-cell-border": a.tableDividers === "grid" ? "1px" : "0px",
    "--ui-control-weight": a.textWeight === "regular" ? "400" : "500",
    "--ui-hover-bg": a.hoverStyle === "muted" ? "var(--muted)" : "transparent",
    "--ui-hover-border": a.hoverStyle === "muted" ? "var(--border)" : "var(--ring)",
    "--ui-disabled-opacity": a.disabledStyle === "soft" ? "0.35" : "0.5",
    "--ui-group-gap": { compact: "16px", standard: "24px", relaxed: "32px" }[a.groupSpacing],
    "--ui-separator-opacity": a.separatorStyle === "line" ? "1" : "0",
    "--ui-dialog-width": { compact: "24rem", standard: "28rem", wide: "40rem" }[a.dialogSize],
    "--ui-overlay-opacity": a.overlayStyle === "dim" ? "0.4" : "0.1",
    "--ui-control-height": { compact: "32px", standard: "36px", comfortable: "40px" }[a.controlHeight],
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
