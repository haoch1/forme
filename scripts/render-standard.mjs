import { createServer } from "vite";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

// Reuse the browser's TypeScript generator, including raw Markdown and JSON imports.
// Middleware mode does not open a page or bind the application's dev-server port.
export async function renderStandard(theme) {
  const vite = await createServer({
    root,
    configFile: false,
    appType: "custom",
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    const [{ frontendStandard }, { normalizeTheme, exportCSS }] = await Promise.all([
      vite.ssrLoadModule("/src/design-system/frontend-standard.ts"),
      vite.ssrLoadModule("/src/design-system/theme.ts"),
    ]);
    const config = normalizeTheme(theme);
    return { config, standard: frontendStandard(config), css: exportCSS(config) };
  } finally {
    await vite.close();
  }
}
