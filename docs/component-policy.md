# 组件来源与预设适配

基础组件采用官方 shadcn CLI 4.22.1、radix-vega / Radix。28 个组件均已逐文件通过 CLI 的 --view 与 --diff 核对；Chart 与 Spinner 为本次从同一 registry 增加的源码，沿用现有 Recharts 和 Lucide 依赖，没有升级或重复安装库。

## 分层约定

- src/components/ui：官方 registry 组件及下表列明的小范围补丁。这里不读取 InterfaceOptionsProvider，也不导入项目设计配置。Button 的 default / outline / secondary / ghost / destructive / link、Tabs 的原生 variant 和 Select 的定位接口保持原义。
- src/components/preset-controls.tsx：预设组合层，调用上述组件与其原生参数。明确传入的 Button variant 优先于预设；未指定时将主按钮预设映射到原生 default / secondary / outline。此层不直接实现 Radix 的焦点、菜单、键盘或选中逻辑。
- src/design-system/preset-controls.css：只作用于显式添加的 preset-* 类，负责已有预设需要的字号、控件高度、填充、间距、阴影、悬停、禁用和选中外观。禁止在 workbench.css 增加针对全部 data-slot 控件的状态覆盖。
- workbench.css：应用布局、响应式、独立滚动与演示场景布局。嵌入式弹窗定位、稳定滚动条占位、色卡和拖放目标是本项目的工作台行为。

## 与官方源码的差异

20 个组件与本次 CLI 返回的源码一致（忽略换行符和末尾空白）。其余 8 个组件只保留以下明确补丁：

| 组件 | 差异与理由 |
| --- | --- |
| Button、Badge、Switch | 将 transition-all 改为明确的颜色、边框、阴影、透明度与 transform，防止字号和密度变化时插值宽高 |
| Tabs | 同上；将文档中的 orientation 参数实际转发给 Radix，保持竖向样式与键盘方向一致 |
| ToggleGroup | 将 orientation 参数转发给 Radix；没有增加自定义 variant 或预设参数 |
| Slider | 将可访问名称转发到各个 Thumb，给实际可聚焦的滑块命名 |
| Dialog | 关闭文案中文化；遮罩透明度接入语义变量，以保留遮罩预设 |
| Spinner | 可访问名称中文化 |

逐文件 registry URL、官方源码摘要与本地源码摘要位于 third-party/shadcn-components.json。更新组件前运行 shadcn add <组件> --dry-run 和 --diff，按上述边界合并，再更新来源记录。pnpm check:ui 会拒绝未经记录的基础组件修改、基础组件读取项目预设和 transition-all；它不是官方认证，也不代替浏览器交互与可访问性验证。

## 现有预设的实现方式

57 组选项的 ID、中文文案、默认值、存储及导出格式不变。

| 能力 | 实现 |
| --- | --- |
| 配色、字体、圆角、间距、密度 | shadcn 语义主题变量与独立的项目尺寸变量；Tailwind --spacing 固定为 4px |
| 主按钮 | 原生 Button variant；明确指定的 variant 不被预设覆盖 |
| 分段浮起、柔和描边、清晰描边 | 原生 ToggleGroup 的外观组合，键盘与选择交给 Radix；这些中文名称是产品描述，不是 shadcn 官方 variant 名称 |
| 内容分页 | 原生 Tabs / TabsList / TabsTrigger / TabsContent；保留分段与描边两种外观 |
| 表单 | Field / FieldGroup / FieldContent、RHF + Zod；data-invalid、aria-invalid 与描述、错误信息关联 |
| 下拉与提示 | Select 的 popper、align、sideOffset、碰撞检测；Tooltip 的 delayDuration 与 side |
| 弹窗 | Dialog 的受控状态、原生 Esc、焦点圈定与返回；通过 onInteractOutside 实现可选遮罩关闭策略 |
| 消息 | Sonner 原生 position / duration / closeButton |
| 图表 | ChartContainer / ChartTooltipContent 包装现有 Recharts，颜色来自 ChartConfig，启用 accessibilityLayer |
| 加载 | 原生 Spinner / Skeleton；操作图标的 Motion 动效是项目组合，不改变 Button 的原生接口 |
| 表格 | TanStack Table + shadcn Table / Checkbox / DropdownMenu / Avatar；密度与行分隔为主题扩展 |
| 分栏、拖拽、状态 | react-resizable-panels v4 原生布局接口、dnd-kit 新 API 的 move / PointerSensor / KeyboardSensor、Zustand persist |

不能因为页面使用这些库就宣称所有外观都是官方默认。既有可调整外观是明确的项目主题扩展；优先保留原生结构、交互、语义和变体，再在组合层实现这些扩展。
