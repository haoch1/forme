import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";
import { migrateDefaultAppearance } from "@/design-system/migrate-defaults";
import {
  initialTheme,
  normalizeTheme,
  type ThemeConfig,
} from "@/design-system/theme";
type ThemeStore = {
  theme: ThemeConfig;
  past: ThemeConfig[];
  future: ThemeConfig[];
  savedAt: string | null;
  setTheme: (next: ThemeConfig) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  save: () => void;
};
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: structuredClone(initialTheme),
      past: [],
      future: [],
      savedAt: null,
      setTheme: (theme) =>
        set((s) => ({
          theme: normalizeTheme(theme),
          past: [...s.past.slice(-29), structuredClone(s.theme)],
          future: [],
        })),
      undo: () => {
        const s = get();
        if (s.past.length)
          set({
            theme: normalizeTheme(s.past.at(-1)!),
            past: s.past.slice(0, -1),
            future: [s.theme, ...s.future],
          });
      },
      redo: () => {
        const s = get();
        if (s.future.length)
          set({
            theme: normalizeTheme(s.future[0]),
            past: [...s.past, s.theme],
            future: s.future.slice(1),
          });
      },
      reset: () => get().setTheme(structuredClone(initialTheme)),
      save: () => {
        localStorage.setItem(
          "style-theme-snapshot",
          JSON.stringify(get().theme),
        );
        set({ savedAt: new Date().toISOString() });
      },
    }),
    {
      name: "style-theme-v1",
      version: 8,
      migrate: (persisted, previousVersion) => {
        const saved = persisted as Partial<ThemeStore>;
        const theme = normalizeTheme(saved.theme ?? structuredClone(initialTheme));
        if (previousVersion < 4) {
          for (const mode of ["light", "dark"] as const) {
            if (["0.25rem", "0.5rem"].includes(theme.styles[mode].radius)) theme.styles[mode].radius = "0.625rem";
          }
        }
        if (previousVersion < 5 && theme.preset === "neutral" && theme.styles.dark.background === "oklch(0.145 0 0)") {
          theme.styles.dark = { ...initialTheme.styles.dark, radius: theme.styles.dark.radius };
        }
        return { theme: previousVersion < 8 ? migrateDefaultAppearance(theme) : theme, savedAt: saved.savedAt ?? null };
      },
      partialize: ({ theme, savedAt }) => ({ theme, savedAt }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<ThemeStore> | undefined;
        return {
          ...current,
          ...saved,
          theme: normalizeTheme(saved?.theme ?? current.theme),
        };
      },
    },
  ),
);

// Parent workbench and responsive preview share the same standard, each in its own document.
export function useThemeSync() {
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "style-theme-v1") void useThemeStore.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    // A user may change a preset while the iframe bundle is still mounting.
    // Read once after subscribing so no change between hydration and subscription is lost.
    void useThemeStore.persist.rehydrate();
    return () => window.removeEventListener("storage", onStorage);
  }, []);
}
