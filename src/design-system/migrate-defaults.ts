import { initialTheme, normalizeTheme, type ThemeConfig } from "./theme";

export function migrateDefaultAppearance(saved: ThemeConfig): ThemeConfig {
  const theme = normalizeTheme(saved);
  if (theme.density === "compact") theme.density = initialTheme.density;
  if (theme.preset === "neutral" && ["#191919", "oklch(0.145 0 0)"].includes(theme.styles.dark.background)) {
    theme.styles.dark = { ...initialTheme.styles.dark, radius: theme.styles.dark.radius };
  }
  // Previous stock values move to the native defaults; future manual changes persist normally.
  if (theme.advanced.tooltipDelay === "standard") theme.advanced.tooltipDelay = initialTheme.advanced.tooltipDelay;
  if (theme.advanced.toastCloseButton === true) theme.advanced.toastCloseButton = initialTheme.advanced.toastCloseButton;
  if (theme.advanced.motionStyle === "slide") theme.advanced.motionStyle = initialTheme.advanced.motionStyle;
  return theme;
}
