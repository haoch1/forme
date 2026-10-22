import { readFileSync, writeFileSync } from "node:fs";
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
for (const section of ["dependencies", "devDependencies"])
  for (const name of Object.keys(pkg[section]))
    pkg[section][name] = JSON.parse(
      readFileSync(`node_modules/${name}/package.json`, "utf8"),
    ).version;
if (pkg.dependencies.shadcn) {
  pkg.devDependencies.shadcn = pkg.dependencies.shadcn;
  delete pkg.dependencies.shadcn;
}
writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
writeFileSync(
  "stack-policy.json",
  JSON.stringify(
    { dependencies: pkg.dependencies, devDependencies: pkg.devDependencies },
    null,
    2,
  ) + "\n",
);
const roles = {
  react: "UI 框架",
  typescript: "类型系统",
  vite: "构建",
  tailwindcss: "样式",
  "radix-ui": "基础交互",
  "lucide-react": "图标",
  motion: "动画",
  "react-resizable-panels": "可调分栏",
  "@dnd-kit/react": "拖拽",
  zustand: "客户端状态",
  "@tanstack/react-query": "异步数据",
  "@tanstack/react-router": "路由",
  "@tanstack/react-table": "表格",
  "react-hook-form": "表单",
  zod: "数据校验",
  sonner: "消息反馈",
  recharts: "图表",
  cn: "类名合并",
  fflate: "模板归档",
};
writeFileSync(
  "src/design-system/stack.json",
  JSON.stringify(
    Object.entries(roles).map(([name, role]) => ({
      name,
      role,
      version: pkg.dependencies[name] ?? pkg.devDependencies[name],
    })),
    null,
    2,
  ) + "\n",
);
console.log("Pinned every direct dependency and generated stack snapshot; design defaults preserved.");
