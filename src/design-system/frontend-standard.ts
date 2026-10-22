import { normalizeTheme, type ThemeConfig } from "./theme";
import { optionSections, optionValue } from "./option-catalog";
import { textPixels, iconPixels, iconStrokes, motionSeconds } from "./interface-options";
import baseline from "./default-config.json";
import stack from "./stack.json";
import generationRules from "./generation-rules.md?raw";

export function frontendStandard(config: ThemeConfig): string {
  const theme = normalizeTheme(config);
  const describe = (config: ThemeConfig) => optionSections.map((section) => `### ${section.label}\n${section.fields.map((field) => `- ${field.label}：${field.options.find((option) => option.id === optionValue(config, field))?.label ?? "已导入的自定义值"}`).join("\n")}`).join("\n\n");
  const versions = stack.map((item) => `- ${item.role}：${item.name} ${item.version}`).join("\n");
  return `# 可复用前端标准

将本标准应用于聊天要开发的项目。业务名称、内容、数据和路由根据需求生成；示例不代表业务范围。

${generationRules.replace(/^# /, "## ")}

## 原生组件基线

UI 统一为 shadcn/ui Vega / Radix，Neutral 配色、Geist 字体。组件的字重、焦点、悬停、禁用、选中态、卡片轮廓和输入框由原生源码决定，不再增加第二套控件外观系统。

优先使用 Button、Card、Field、Input、Checkbox、Switch、Slider、Tabs、ToggleGroup、Select、Dialog、Tooltip、Sidebar、Pagination、Chart、Spinner、Empty 与 Sonner。configured-components.tsx 只传递原生参数，明确指定的 variant / size 优先。

## 本次实际配置

以下选项和可复现 JSON 是后续页面与组件的默认值。未明确修改的部分持续继承，缺失字段才补齐统一基线。

${describe(theme)}

## 运行时映射

- 根字号 ${textPixels[theme.textSize]}px；Lucide 默认图标 ${iconPixels[theme.advanced.iconSize]}px、线宽 ${iconStrokes[theme.advanced.iconStroke]}。控件内部图标由组件原生尺寸决定。
- ToggleGroup variant：${theme.advanced.toggleVariant}；TabsList variant：${theme.advanced.tabsStyle}；主按钮 variant：${theme.advanced.buttonStyle}；Button / ToggleGroup size：${theme.advanced.controlSize}。
- 布局间距仅影响容器 gap；Tailwind --spacing 固定 4px，Card、FieldGroup、表格和开关均保留自身原生几何。
- Motion 演示时长 ${theme.motion ? Math.round(motionSeconds[theme.advanced.motionSpeed] * 1000) : 0}ms，缓动 ${theme.advanced.motionEase}；系统减少动态效果优先。本地页面不额外等待。
- 原生 Button + Spinner 处理真实 pending；消息使用 shadcn Sonner 的 position / duration / closeButton，提示使用 Radix delayDuration / side。

## 固定技术栈

${versions}

每类职责维持一套既定实现。普通布局使用 Grid/Flex，分栏使用 react-resizable-panels v4，拖拽使用 dnd-kit 新 API；没有对应 shadcn 组件时才组合其他成熟库。不自行升级依赖主版本，保留精确版本、lockfile、来源与许可证。

## 工作台初始默认

工作台首次进入和恢复默认使用 src/design-system/default-config.json。以下是完整初始选择；本次实际配置与它不同时，以本次实际配置为准。

${describe(baseline as ThemeConfig)}

## 可复现配置

使用模板时读取 src/selected-theme.json、src/selected-theme.css 和 AGENTS.md；直接从聊天开发时将下列 JSON 落实为公共主题和原生组件参数。

\`\`\`json
${JSON.stringify(theme, null, 2)}
\`\`\`

## 验收

运行类型、Lint、依赖、源码来源、默认值一致性与构建检查，并在浏览器验证桌面、平板、手机、原生组件状态、字号和布局间距切换、独立滚动、导出及主要操作。
`;
}
