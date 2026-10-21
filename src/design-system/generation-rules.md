# 后续网页开发规范

将本规范和本次导出的配置作为后续生成网页、新增页面与组件、修改样式的默认基线。后续聊天明确要求修改的部分按新要求执行，其他部分继续继承，不随意重新设计。

- 当前项目的配置以“前端标准.md”中的可复现配置和 src/selected-theme.json 为准；缺少的字段从 src/design-system/default-config.json 补齐。工作台导出时保留当前选择，不能擅自恢复默认。项目名称、文案、数据和业务路由根据聊天需求生成，示例内容不限制业务领域。
- 开发前阅读 AGENTS.md、前端标准.md、components.json、docs/design-system.md、docs/component-policy.md、docs/architecture.md 和 src/selected-theme.json。只收到复制的标准时，也要按其中的完整配置和以下规范实现。
- 固定使用 React、TypeScript、Vite、pnpm、shadcn/ui radix-vega 和 Radix。优先复用项目已有组件、原生变体和接口，再组合；能用 Chart、Spinner、Avatar、Field、TabsContent、Alert、Empty、Skeleton 等现有组件时，不手写另一套替代实现。
- 原生组件放在 src/components/ui，不读取项目设计配置。主按钮、输入框、选项组等预设通过 src/components/preset-controls.tsx 调用原生组件；主题扩展集中放在 src/design-system/preset-controls.css 的 preset-* 类中。明确传入的原生 variant 和 size 优先于预设，不恢复全局 data-slot 状态覆盖。
- 按钮高度优先映射原生 sm / default / lg。图标卡片、含多行文案的按钮、可展开内容按实际内容自适应，不能用全局固定高度挤压；图标、中文名称和辅助文字必须完整位于控件内部。
- 配色使用 background、foreground、primary、muted、border、destructive 等语义变量。普通 UI 不在各页面硬编码颜色；统一配置明暗模式。保留已有配色、圆角、阴影、字号、密度和细节选项，不擅自用近似值替换。
- “分段浮起”等名称是产品外观描述，不冒称 shadcn 官方同名变体。选项组沿用 ToggleGroup，内容分页使用 Tabs / TabsList / TabsTrigger / TabsContent，选择与键盘语义交给 Radix。独立操作按钮、复选框、开关和下拉项使用各自的原生组件；选项不加装饰勾。
- 鼠标点击不保留抢眼的焦点圈，键盘操作必须保留清晰焦点，不用强制 blur 隐藏。表单采用 Field / FieldGroup / FieldContent，相关复选项用 FieldSet / FieldLegend；错误使用 data-invalid、aria-invalid，并将说明和错误关联到输入控件。
- 图标仅用 Lucide；图标按钮提供可访问名称。SelectItem 和菜单项放进对应 Group，Dialog 包含 Title 并保留关闭按钮、Esc、焦点圈定和焦点返回，Avatar 包含 Fallback。长下拉用 Select 原生 popper 定位、碰撞检测和内部滚动，最高 320px，宽度跟随选择框。
- 图表组合 shadcn ChartContainer / ChartTooltipContent 与 Recharts，颜色来自 ChartConfig；加载使用 Spinner / Skeleton，消息使用 Sonner 原生 position / duration / closeButton，提示使用 Radix 原生 delayDuration / side。保持图表、提示和消息在明暗模式下可读。
- Tailwind --spacing 固定为 4px。内容密度只改变卡片内边距、布局间距和表格行留白；字号只改变文字尺度。图标、头像、复选框、开关轨道及滑块、图表高度和控件高度分别控制，不能随密度一起缩放。检查开关滑块完整位于轨道内。
- 公共控件只过渡颜色、背景、边框、阴影、透明度或 transform，禁止 transition-all 插值宽高、字号和间距。配置变化复用已挂载的组件，主题只更新发生变化的变量；本地内容切换不刷新页面、不重建 iframe、不加假等待。图表不因字号或密度变化重播入场动画。
- 有独立滚动区域时各自滚动，使用 overscroll-behavior: contain 与 scrollbar-gutter: stable；嵌入预览在首次布局前预留滚动条空间。检查临界宽度，避免滚动条出现导致列数、图表宽度反复跳动。
- 适配电脑、平板和手机，统一边缘、标签、输入框与操作区的对齐线。工具栏宽度不足时换行，不能互相遮挡；多行内容、弹窗、表格和图标卡片不能裁切或横向撑破屏幕。业务布局依聊天需求决定，不把工作台的双栏配置界面套到所有项目。
- 短标题、按钮与简短提示不加句末标点，完整说明使用中文标点。默认中文，保留原来易懂的描述；不增加无意义渐变、发光、装饰卡片、宣传大标题或虚构业务指标。
- 普通布局用 CSS Grid/Flex，可调分栏用 react-resizable-panels v4 原生接口和明确单位、稳定面板 ID。拖拽用 @dnd-kit/react 新 API，提供可聚焦手柄、键盘和菜单替代，Esc 取消恢复快照；关闭长期保存时，撤销操作也不能写入长期存储。
- 动画仅用 motion/react 或简单 CSS 状态变化，遵循全局动效和 prefers-reduced-motion。刷新、重播、恢复与重试复用 ActionButton，只动画图标；持续旋转跟随真实 pending，不为播放动画延长等待。
- 路由用 TanStack Router，异步数据用 TanStack Query，表格用 TanStack Table，表单用 React Hook Form + Zod，跨组件客户端状态用 Zustand selector。本地临时状态用 React；不把 Query 数据复制进 Zustand，不另写重复缓存。存储键带版本，按所选 localStorage / sessionStorage 与记忆选项执行。
- 每类职责只保留一套既定库。依赖维持 package.json 和 lockfile 的精确版本，不为配色、样式或尚未使用的能力新增依赖，不擅自升级主版本。保留第三方来源与许可证。
- 更新基础组件前用 shadcn CLI 的 --dry-run / --diff 核对；仅保留有理由的可访问性、中文文案、尺寸稳定和预设接入补丁，并更新 third-party/shadcn-components.json。pnpm check:ui 检查已审查源码和分层边界，不把它当作官方认证。
- 交付前运行 pnpm typecheck、pnpm lint、pnpm check:stack、pnpm check:ui、pnpm build，并在浏览器验证主要流程及加载、错误、空结果、禁用和成功反馈。重点检查 320 / 390 / 768 / 1024 / 1600px、字号/密度/控件高度组合、图标内容边界、工具栏遮挡、滚动和切换闪烁；不能只用构建通过代替实际验证。
