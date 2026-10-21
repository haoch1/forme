import { mkdirSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { templateFiles } from "./template-files.mjs";
const target = process.argv[2];
if (!target) {
  console.error("用法：pnpm template <新目录> [主题 JSON 文件]");
  process.exit(1);
}
const destination = path.resolve(target);
if (existsSync(destination)) {
  console.error("目标目录已存在，拒绝覆盖。请选择新目录。");
  process.exit(1);
}
const theme = process.argv[3]
  ? JSON.parse(readFileSync(path.resolve(process.argv[3]), "utf8"))
  : undefined;
for (const [file, content] of Object.entries(await templateFiles(theme))) {
  const absolute = path.join(destination, file);
  mkdirSync(path.dirname(absolute), { recursive: true });
  writeFileSync(absolute, content);
}
console.log(
  `已创建独立项目：${destination}\n进入目录后运行 pnpm install --frozen-lockfile 和 pnpm dev。`,
);
