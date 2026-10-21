import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import ts from "typescript";
import vm from "node:vm";
const upstream = new URL("../references/upstream/tweakcn/", import.meta.url);
const root = new URL("../", import.meta.url);
const source = readFileSync(new URL("utils/theme-presets.ts", upstream), "utf8")
  .replace(/^import[^\n]*\n/, "")
  .replace("export const defaultPresets", "const defaultPresets");
const code = ts.transpile(source) + "\nresult = defaultPresets;";
const context = { result: null };
vm.runInNewContext(code, context);
const selected = Object.fromEntries(
  ["modern-minimal", "graphite", "supabase", "claude", "vercel", "mono"].map(
    (key) => [key, context.result[key]],
  ),
);
mkdirSync(new URL("src/design-system/", root), { recursive: true });
writeFileSync(
  new URL("src/design-system/presets.json", root),
  JSON.stringify(selected, null, 2) + "\n",
);
const css = readFileSync(new URL("src/index.css", root), "utf8");
const parse = (selector) =>
  Object.fromEntries(
    [...css.match(selector)[1].matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [
      m[1],
      m[2].trim(),
    ]),
  );
writeFileSync(
  new URL("src/design-system/default-tokens.json", root),
  JSON.stringify(
    {
      light: parse(/:root\s*\{([^}]+)\}/),
      dark: parse(/\.dark\s*\{([^}]+)\}/),
    },
    null,
    2,
  ) + "\n",
);
mkdirSync(new URL("third-party/", root), { recursive: true });
copyFileSync(
  new URL("LICENSE", upstream),
  new URL("third-party/tweakcn-LICENSE", root),
);
copyFileSync(
  new URL("../references/upstream/shadcn-admin/LICENSE", import.meta.url),
  new URL("third-party/shadcn-admin-LICENSE", root),
);
const rev = (dir) =>
  execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: dir,
    encoding: "utf8",
  }).trim();
writeFileSync(
  new URL("third-party/sources.json", root),
  JSON.stringify(
    {
      tweakcn: {
        repository: "https://github.com/jnsahaj/tweakcn",
        commit: rev(upstream),
        files: [
          "utils/theme-presets.ts",
          "components/editor/control-section.tsx",
          "components/editor/editor.tsx",
          "components/editor/colors-tab-content.tsx",
          "components/examples/cards/cookie-settings.tsx",
          "components/examples/cards/report-issue.tsx",
        ],
        usage:
          "主题预设直接抽取；编辑器、颜色分组及卡片结构移植并适配 shadcn/ui、中文和本地交互",
      },
      shadcnAdmin: {
        repository: "https://github.com/satnaing/shadcn-admin",
        commit: rev(
          new URL("../references/upstream/shadcn-admin/", import.meta.url),
        ),
        files: [
          "src/components/layout/main.tsx",
          "src/features/tasks/components/tasks-table.tsx",
          "src/features/settings/profile/profile-form.tsx",
        ],
        usage: "页面布局、任务表格和表单组织结构适配；交互逻辑为本地版本",
      },
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "Imported six upstream presets, neutral defaults, licenses and source commits.",
);
