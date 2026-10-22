import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";

const baseline = JSON.parse(readFileSync("src/design-system/default-config.json", "utf8"));
const css = readFileSync("src/index.css", "utf8");
for (const [mode, selector] of [["light", ":root"], ["dark", ".dark"]]) {
  const content = css.slice(css.indexOf(`${selector} {`)).split("}")[0];
  const tokens = Object.fromEntries([...content.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
  assert.deepEqual(tokens, baseline.styles[mode], `${mode}: first-paint CSS must match the canonical defaults`);
}

const server = await createServer({ server: { middlewareMode: true, hmr: false }, logLevel: "error" });
try {
  const { initialTheme, normalizeTheme } = await server.ssrLoadModule("/src/design-system/theme.ts");
  const { defaultInterface } = await server.ssrLoadModule("/src/design-system/interface-options.ts");
  const { optionSections, optionValue } = await server.ssrLoadModule("/src/design-system/option-catalog.ts");
  const { migrateDefaultAppearance } = await server.ssrLoadModule("/src/design-system/migrate-defaults.ts");
  assert.deepEqual(initialTheme, baseline);
  assert.deepEqual(defaultInterface, baseline.advanced);
  assert.deepEqual(normalizeTheme({}), baseline, "missing legacy fields receive the same baseline");
  for (const field of optionSections.flatMap((section) => section.fields)) {
    assert(field.options.some((option) => option.id === optionValue(initialTheme, field)), `${field.id}: default is a selectable option`);
  }
  const old = structuredClone(baseline);
  old.density = "compact";
  old.styles.dark.background = "#191919";
  Object.assign(old.advanced, { focusStyle: "subtle", selectionStyle: "segmented", textWeight: "regular", hoverStyle: "muted", groupSpacing: "standard", tooltipDelay: "standard", toastCloseButton: true, actionIconMotion: "click", motionStyle: "slide" });
  assert.deepEqual(migrateDefaultAppearance(old), baseline, "old defaults migrate to the complete official profile");
  const custom = structuredClone(baseline);
  custom.preset = "rose";
  custom.styles.dark.background = "#123456";
  custom.styles.light.radius = "1rem";
  custom.density = "spacious";
  Object.assign(custom.advanced, { toggleVariant: "outline", tabsStyle: "line", controlSize: "lg", buttonStyle: "outline" });
  assert.deepEqual(migrateDefaultAppearance(custom), custom, "explicit custom choices survive migration");
  console.log("PASS: default choices, first-paint tokens, normalization and legacy migration agree.");
} finally {
  await server.close();
}
