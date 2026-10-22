# 组件来源与配置边界

基础 UI 统一来自 shadcn CLI 4.22.1 / radix-vega，采用 Radix primitives。共 32 个组件，19 个源码与记录的 CLI 输出一致，其余仅有下述必要补丁；use-mobile hook 同样记录摘要。来源、许可证、registry URL 与 SHA-256 见 third-party/shadcn-components.json。

## 分层

- src/components/ui：registry 源码，不导入项目设计配置。
- src/components/configured-components.tsx：只传递原生 variant、size、side、定位和外部交互事件，不包含状态 CSS。
- workbench.css：布局、响应式、独立滚动与嵌入预览定位；不得改写组件默认字号、字重、焦点、悬停、选中、禁用和阴影。
- 删除了 preset-controls.css、旧的状态适配器、输入方式强制判断、点击旋转动效及未使用的 ScrollArea。没有并行保留另一套 UI 库。

## 必要源码补丁

| 组件 | 原因 |
| --- | --- |
| Button、Badge、Switch、Tabs、Sidebar、Accordion | 将广泛或几何过渡限制为视觉状态属性，避免预设切换时尺寸插值；不改变原生变体 |
| Tabs、ToggleGroup | orientation 转发给 Radix，保持键盘和视觉方向一致 |
| Slider | 可访问名称转发到可聚焦 Thumb |
| Dialog、Spinner、Sheet、Pagination、Sidebar | 中文可访问名称 |
| Sonner | 直接接收现有 theme prop，不引入 Next.js 专用 next-themes 或第二套主题状态 |

Dialog 遮罩已恢复原生 bg-black/10；其他焦点、悬停、字重与选中态直接由 registry 决定。需要新增 UI 时先查 shadcn 是否已有对应组件，有则直接使用；缺少对应能力时才组合固定技术栈中的成熟库。

## 可配置内容

41 项设置只提供主题、布局及成熟库原生参数。ToggleGroup 使用 default/outline，TabsList 使用 default/line，Button 使用 default/secondary/outline，Button/ToggleGroup 尺寸使用 sm/default/lg。明确传入的参数优先，Input、Card、Checkbox、Switch、Slider、Field、Table 等直接复用原生组件。

消息使用 shadcn Sonner，图表使用 ChartContainer 与 Recharts，异步按钮使用 Button + Spinner，应用导航使用 Sidebar，分页使用 Pagination。表单、路由、异步状态和拖拽分别沿用固定成熟库，不重复管理状态。

更新前用 shadcn add --dry-run / --diff 核对，再更新来源摘要。check:ui 拒绝未记录的源码、基础组件读取配置及 transition-all；这不是官方认证，也不代替浏览器验证。
