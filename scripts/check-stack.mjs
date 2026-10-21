import { readFileSync } from "node:fs";
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const policy = JSON.parse(readFileSync("stack-policy.json", "utf8"));
const config = JSON.parse(readFileSync("components.json", "utf8"));
const errors = [];
for (const [section, dependencies] of Object.entries({
  dependencies: pkg.dependencies,
  devDependencies: pkg.devDependencies,
}))
  for (const [name, version] of Object.entries(dependencies ?? {})) {
    if (!/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version))
      errors.push(`${name}: 必须使用精确版本`);
    if (policy[section]?.[name] !== version)
      errors.push(`${name}: 与固定技术栈快照不一致`);
  }
for (const section of ["dependencies", "devDependencies"])
  for (const name of Object.keys(policy[section] ?? {}))
    if (!pkg[section]?.[name]) errors.push(`${name}: 固定依赖缺失`);
if (config.style !== "radix-vega" || config.iconLibrary !== "lucide")
  errors.push("必须使用 radix-vega + lucide");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  "PASS: shadcn/ui / Lucide / all direct dependency versions match stack-policy.json.",
);
