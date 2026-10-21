import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { renderStandard } from "./render-standard.mjs";
const root = path.resolve(import.meta.dirname, "..");
export async function templateFiles(theme) {
  const output = {};
  const copy = (source, target = source) => {
    const absolute = path.join(root, source);
    for (const entry of readdirSync(absolute, { withFileTypes: true })) {
      const src = path.join(source, entry.name),
        dst = path.join(target, entry.name);
      if (entry.isDirectory()) copy(src, dst);
      else
        output[dst.replaceAll("\\", "/")] = readFileSync(path.join(root, src));
    }
  };
  for (const dir of [
    "src/components",
    "src/lib",
    "src/design-system",
    "src/features/examples",
    "src/features/layouts",
    "src/features/interactions",
    "third-party",
    "docs",
  ])
    copy(dir);
  delete output["docs/deployment.md"];
  // Exclude workbench-only route compositions while keeping the actual shared feature modules.
  for (const name of [
    "src/features/examples/pages.tsx",
    "src/features/layouts/index.tsx",
    "src/features/interactions/index.tsx",
    "src/lib/export-project.ts",
  ])
    delete output[name];
  const keys = [
    "src/index.css",
    "src/vite-env.d.ts",
    "src/workbench.css",
    "index.html",
    "public/favicon.svg",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "vite.config.ts",
    "components.json",
    "stack-policy.json",
    "pnpm-lock.yaml",
    ".npmrc",
    ".gitignore",
    "eslint.config.js",
    "scripts/check-stack.mjs",
    "scripts/check-ui.mjs",
  ];
  for (const file of keys) output[file] = readFileSync(path.join(root, file));
  output["src/main.tsx"] = readFileSync(
    path.join(root, "template/src/main.tsx"),
  );
  output["public/favicon.svg"] = readFileSync(path.join(root, "template/public/favicon.svg"));
  output["docs/architecture.md"] = readFileSync(path.join(root,"template/docs/architecture.md"));
  output["index.html"] = Buffer.from(output["index.html"].toString().replace(/<title>[^<]*<\/title>/,"<title>应用示例</title>").replace(/<meta name="description" content="[^"]*" \/>/, '<meta name="description" content="基于 shadcn/ui 的可复用项目模板。" />').replace('/favicon.svg?v=forme', '/favicon.svg'));
  const defaults = JSON.parse(
      readFileSync(
        path.join(root, "src/design-system/default-config.json"),
        "utf8",
      ),
    );
  const { config, standard, css } = await renderStandard({ ...defaults, ...theme, advanced: { ...defaults.advanced, ...theme?.advanced } });
  output["AGENTS.md"] = readFileSync(path.join(root, "src/design-system/generation-rules.md"));
  output["src/selected-theme.json"] = Buffer.from(
    JSON.stringify(config, null, 2) + "\n",
  );
  output["src/selected-theme.css"] = Buffer.from(
    css,
  );
  output["前端标准.md"] = Buffer.from(
    standard,
  );
  const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  pkg.name = "frontend-starter";
  pkg.scripts = {
    dev: "vite --host 127.0.0.1 --port 5174 --strictPort",
    build: "tsc -b && vite build",
    preview: "vite preview --host 127.0.0.1 --port 4174 --strictPort",
    typecheck: "tsc -b",
    lint: "eslint .",
    "check:stack": "node scripts/check-stack.mjs",
    "check:ui": "node scripts/check-ui.mjs",
  };
  output["package.json"] = Buffer.from(JSON.stringify(pkg, null, 2) + "\n");
  output["README.md"] = Buffer.from(
    "# 前端项目模板\n\n使用 前端风格工作台 的同一份组件、布局、表格、表单和交互源码。\n\n要求 Node.js 24+ 与 pnpm 11.25.0。\n\n```sh\npnpm install --frozen-lockfile\npnpm dev\n```\n\n启动地址 http://127.0.0.1:5174。修改 src/main.tsx 中的路由与页面组成。主题来自 src/selected-theme.json，可在 前端风格工作台 编辑后替换。所有示例数据仅保存在本机浏览器。\n\n新任务先阅读 AGENTS.md、前端标准.md、docs/design-system.md、docs/component-policy.md、docs/architecture.md；任务输入模板见 docs/ai-project-brief.md。导出的实际配置持续作为后续网页、页面与组件的默认设置，缺失字段才补齐 default-config.json。规则统一来自 src/design-system/generation-rules.md，业务布局按需求组织。\n\n验收：pnpm typecheck、pnpm lint、pnpm check:stack、pnpm check:ui、pnpm build。第三方来源与许可证见 third-party/。\n\n使用 hash 路由，静态托管无需额外服务端路由规则。\n",
  );
  return output;
}
