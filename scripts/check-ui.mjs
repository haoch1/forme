import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const receipt = JSON.parse(readFileSync("third-party/shadcn-components.json", "utf8"));
const normalize = (source) => source.replaceAll("\r", "").trim() + "\n";
const hash = (source) => createHash("sha256").update(normalize(source)).digest("hex");
const errors = [];
const files = readdirSync("src/components/ui").filter((name) => name.endsWith(".tsx"));
for (const name of files) {
  const record = receipt.components[name];
  const source = readFileSync(path.join("src/components/ui", name), "utf8");
  if (!record) errors.push(`${name}: 未记录官方 CLI 来源，添加组件后请先核对 registry`);
  else if (hash(source) !== record.localSha256) errors.push(`${name}: 源码与已审查记录不一致，请用 shadcn add --diff 核对并更新来源记录`);
  if (/from\s*["']@\/design-system\//.test(source)) errors.push(`${name}: 基础组件不能读取本项目预设，请在 preset-controls.tsx 组合原生接口`);
  if (/\btransition-all\b/.test(source)) errors.push(`${name}: 不允许对字号、宽高和间距做统一过渡`);
}
for (const name of Object.keys(receipt.components)) {
  if (!files.includes(name)) errors.push(`${name}: 已审查的基础组件缺失`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`PASS: ${files.length} shadcn registry sources match the reviewed receipt; no project preset hooks or transition-all in primitives.`);
