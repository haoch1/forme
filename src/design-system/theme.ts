import baseline from "./default-config.json";
import importedPresets from "./presets.json";
import accentPresets from "./accent-presets.json";
import { officialPalettes } from "./official-palettes";
import type { CSSProperties } from "react";
import { defaultInterface, textPixels, uiVariables, type InterfaceOptions } from "./interface-options";
export type Mode = "light" | "dark";
export type Tokens = Record<string, string>;
export type ThemeConfig = {
  /** Legacy imports may contain a name; standards do not retain business information. */
  name?: string;
  preset: string;
  mode: Mode;
  styles: Record<Mode, Tokens>;
  density: "standard" | "compact" | "spacious";
  font: "geist" | "system" | "mono";
  motion: boolean;
  textSize: "compact" | "standard" | "large";
  navigation: "sidebar" | "top";
  startPage: "projects" | "board" | "profile";
  advanced: InterfaceOptions;
};
export const fonts = {
  geist: '"Geist Variable", "Microsoft YaHei", sans-serif',
  system: 'system-ui, "Microsoft YaHei", sans-serif',
  mono: 'ui-monospace, "Microsoft YaHei", monospace',
};
const baseStyles = {
  light: baseline.styles.light,
  dark: baseline.styles.dark,
};
export const initialTheme: ThemeConfig = {
  ...baseline as ThemeConfig,
  styles: structuredClone(baseStyles),
  advanced: { ...defaultInterface },
};
export const presets: Record<
  string,
  { label: string; styles: Record<Mode, Tokens> }
> = {
  neutral: { label: "经典黑白", styles: baseStyles },
  ...importedPresets,
  ...accentPresets,
  ...officialPalettes,
};
export function normalizeTheme(theme: ThemeConfig): ThemeConfig {
  const legacy = theme.advanced as unknown as Record<string, unknown> | undefined;
  const advanced = { ...legacy };
  advanced.tabsStyle = legacy?.tabsStyle === "line" ? "line" : "default";
  advanced.toggleVariant = legacy?.toggleVariant ?? (legacy?.selectionStyle === "outline" ? "outline" : "default");
  advanced.buttonStyle = legacy?.buttonStyle === "solid" ? "default" : legacy?.buttonStyle ?? "default";
  advanced.controlSize = legacy?.controlSize ?? ({ compact: "sm", standard: "default", comfortable: "lg" } as Record<string,string>)[String(legacy?.controlHeight)] ?? "default";
  const next = { ...initialTheme, ...theme };
  delete next.name;
  if ((next.density as string) === "comfortable") next.density = "standard";
  return {
    ...next,
    preset: presets[next.preset] ? next.preset : "neutral",
    advanced: Object.fromEntries(Object.entries(defaultInterface).map(([key, fallback]) => [key, advanced[key] ?? fallback])) as InterfaceOptions,
    styles: {
      light: { ...baseStyles.light, ...theme.styles?.light },
      dark: {
        ...baseStyles.dark,
        ...theme.styles?.dark,
        radius:
          theme.styles?.dark?.radius ??
          theme.styles?.light?.radius ??
          baseStyles.light.radius,
      },
    },
  };
}
export function resolvedTokens(theme: ThemeConfig, mode: Mode): Tokens {
  const tokens = { ...theme.styles[mode] };
  if (/^[\d.]+rem$/.test(tokens.radius)) tokens.radius = `${parseFloat(tokens.radius) * 16}px`;
  return tokens;
}

export function applyThemeToDocument(config: ThemeConfig, mode = config.mode) {
  const theme = normalizeTheme(config);
  const html = document.documentElement;
  html.classList.toggle("dark", mode === "dark");
  const update = (key: string, value: string) => { if (html.style.getPropertyValue(key) !== value) html.style.setProperty(key, value); };
  for (const [key, value] of Object.entries(resolvedTokens(theme, mode))) update(`--${key}`, value);
  for (const [key, value] of Object.entries(uiVariables(theme))) update(key, value);
  update("--ui-font-family", fonts[theme.font]);
  update("font-size", `${textPixels[theme.textSize]}px`);
  update("color-scheme", mode);
  const motion = theme.motion ? "full" : "reduced";
  if (html.dataset.motion !== motion) html.dataset.motion = motion;
}
export function presetTheme(id: string): ThemeConfig {
  const preset = presets[id] ?? presets.neutral;
  return {
    ...structuredClone(initialTheme),
    preset: id,
    styles: {
      light: { ...baseStyles.light, ...preset.styles.light },
      dark: {
        ...baseStyles.dark,
        radius: preset.styles.light.radius ?? baseStyles.light.radius,
        ...preset.styles.dark,
      },
    },
  };
}
export function chooseStyle(current: ThemeConfig, id: string): ThemeConfig {
  const next = presetTheme(id);
  return { ...current, preset: id, styles: {
    light: { ...next.styles.light, radius: current.styles.light.radius },
    dark: { ...next.styles.dark, radius: current.styles.dark.radius },
  } };
}
export const tokenGroups = [
  { title: "Primary", keys: ["primary", "primary-foreground"], open: true },
  {
    title: "Secondary",
    keys: ["secondary", "secondary-foreground"],
    open: true,
  },
  { title: "Accent", keys: ["accent", "accent-foreground"] },
  { title: "Base", keys: ["background", "foreground"] },
  { title: "Card", keys: ["card", "card-foreground"] },
  { title: "Popover", keys: ["popover", "popover-foreground"] },
  { title: "Muted", keys: ["muted", "muted-foreground"] },
  { title: "Destructive", keys: ["destructive"] },
  { title: "Border & Input", keys: ["border", "input", "ring"] },
  {
    title: "Chart",
    keys: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    title: "Sidebar",
    keys: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
];
const colorKeys = new Set(tokenGroups.flatMap((g) => g.keys));
export function isSafeValue(key: string, value: string) {
  if (key === "radius")
    return /^(?:\d*\.)?\d+(?:px|rem)$/.test(value) && parseFloat(value) <= 40;
  return (
    colorKeys.has(key) &&
    value.length < 100 &&
    CSS.supports("color", value) &&
    !/(?:url|var|env|attr|expression)\s*\(/i.test(value)
  );
}
export function themeStyle(theme: ThemeConfig): CSSProperties {
  const vars: Record<string, string | number> = {
    ...Object.fromEntries(
      Object.entries(resolvedTokens(theme, theme.mode)).map(([k, v]) => [`--${k}`, v]),
    ),
    "--font-sans": fonts[theme.font],
    fontFamily: fonts[theme.font],
    ...uiVariables(theme),
    colorScheme: theme.mode,
  };
  return vars as CSSProperties;
}
export function exportCSS(theme: ThemeConfig) {
  const block = (mode: Mode) =>
    `${mode === "light" ? ":root" : ".dark"} {\n${Object.entries(
      resolvedTokens(theme, mode),
    )
      .filter(([key]) => colorKeys.has(key) || key === "radius")
      .map(([k, v]) => `  --${k}: ${v};`)
      .join(
        "\n",
      )}\n  --font-sans: ${fonts[theme.font]};\n  --ui-font-family: ${fonts[theme.font]};\n${Object.entries(uiVariables(theme)).map(([key, value]) => `  ${key}: ${value};`).join("\n")}\n}`;
  return `/* 前端风格工作台 · shadcn/ui · Tailwind CSS v4\n * 将这些变量合并到项目已有的主题样式中。\n * 外观模式：${theme.mode}；动画：${theme.motion ? "开启" : "减少"}。\n */\n\n${block("light")}\n\n${block("dark")}\n\nhtml { font-size: ${textPixels[theme.textSize]}px; }\n\n${!theme.motion ? "*, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }\n\n" : ""}@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }\n}\n`;
}
export function parseCSS(css: string, current: ThemeConfig) {
  const next = structuredClone(current);
  let count = 0;
  for (const mode of ["light", "dark"] as const) {
    const body = css.match(
      mode === "light" ? /:root\s*\{([^}]+)\}/ : /\.dark\s*\{([^}]+)\}/,
    )?.[1];
    if (!body) continue;
    for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
      if (!colorKeys.has(m[1]) && m[1] !== "radius") continue;
      if (!isSafeValue(m[1], m[2].trim()))
        throw new Error(`无效变量：--${m[1]}`);
      next.styles[mode][m[1]] = m[2].trim();
      count++;
    }
  }
  if (!count) throw new Error("没有找到可导入的 :root 或 .dark 主题变量。");
  next.preset = "custom";
  return next;
}
