# 后续网页开发规范

本次导出的配置是后续页面与组件的默认基线。未明确改变的部分持续继承，业务名称、内容、数据与路由按聊天需求生成。

- 开发前阅读 AGENTS.md、前端标准.md、components.json、docs/design-system.md、docs/component-policy.md、docs/architecture.md 和 src/selected-theme.json。
- UI 统一使用项目内 shadcn/ui radix-vega / Radix。shadcn 有对应组件时直接使用其源码和原生变体，删除重复实现；没有对应能力时才使用既定成熟库。不安装第二套 UI、图标或交互库。
- 默认采用 Vega / Neutral / Geist。Button、Card、Input、Checkbox、Switch、Slider、Field、Tabs、ToggleGroup、Dialog、Tooltip、Sidebar、Pagination、Sonner 等直接沿用各自的尺寸、字重、焦点、悬停、选中与禁用状态，不按历史偏好另写覆盖。官方没有公布各风格使用量排名。
- src/components/ui 保留 registry 源码；src/components/configured-components.tsx 仅将配置映射为原生 variant、size、side、定位和交互事件。显式传入的参数优先；不增加 CSS 状态适配层，不把主题扩展冒称官方变体。
- 默认配置唯一来源为 src/design-system/default-config.json。导出时以 src/selected-theme.json 和 src/selected-theme.css 为实际配置；缺少的字段才补齐默认值。配色、字体、圆角使用 shadcn 语义变量，不在页面硬编码普通 UI 颜色。
- 布局间距只改变容器 gap，不同时缩放卡片、表格、图标、复选框、开关、滑块和图表。Tailwind --spacing 固定为 4px；按钮与选项组尺寸直接使用 sm / default / lg，其他组件保留其自身尺寸。
- 表单使用 Field / FieldGroup / FieldContent；相关复选项用 FieldSet / FieldLegend。错误由 RHF + Zod 处理，使用 data-invalid、aria-invalid 和说明关联，不重写表单状态管理。
- 内容分页用 Tabs，相关选项用 ToggleGroup；下拉项和菜单项放进对应 Group。Dialog 必须有 Title，保留 Esc、关闭按钮、焦点圈定与返回；Avatar 必须有 Fallback；图标按钮必须有可访问名称。
- 图表使用 ChartContainer / ChartTooltipContent + Recharts；通知使用 shadcn Sonner 及其原生 position / duration / closeButton，提示使用 Tooltip 的 delayDuration / side。异步按钮由 Button + Spinner 组合，pending 只对应真实等待，不额外播放点击旋转或添加假延迟。
- 已加载的本地内容直接切换，不刷新页面或重建 iframe。公共控件只过渡颜色、边框、阴影、透明度或 transform，避免 transition-all 插值字号、宽高和间距；图表不因预设变化重播入场动画。
- 普通布局用 CSS Grid/Flex，可调分栏用 react-resizable-panels v4；拖拽用 @dnd-kit/react 新 API。提供可聚焦手柄、键盘与移动菜单；Esc 取消恢复快照，关闭长期保存时撤销也不能写入长期存储。
- 路由使用 TanStack Router，异步数据使用 TanStack Query，表格使用 TanStack Table，表单使用 React Hook Form + Zod，跨组件客户端状态使用 Zustand selector。本地临时状态使用 React，不将 Query 数据复制到 Zustand，存储键带版本。
- 电脑、平板和手机均需适配；业务布局按需求设计，不强制继承工作台的配置侧栏。工具栏可换行，多行按钮和图标卡片按实际内容自适应；长弹窗限制在视口内，标题与关闭区固定，内容内部滚动。
- 独立滚动区域使用 overscroll-behavior: contain 和 scrollbar-gutter: stable，避免串滚与宽度抖动。嵌入预览首次布局前预留滚动条空间，检查临界断点，不产生列数反复变化。
- 默认中文，短标题与按钮不加句末标点；完整说明使用中文标点。配置侧栏只保留名称与控件，不堆叠实现说明。不增加无意义渐变、发光、宣传大标题或虚构指标。
- 每类职责只采用一套实现，所有直接依赖固定精确版本并提交 lockfile；不为配色、样式或未使用能力新增依赖。删除确认未引用的组件和包，保留第三方来源与许可证。
- 更新基础组件前用 shadcn CLI --dry-run / --diff 核对，保留有依据的中文可访问名称和尺寸稳定补丁，更新 third-party/shadcn-components.json；check:ui 是源码校验，不是官方认证。
- 交付前运行类型、Lint、依赖、组件来源、默认值一致性与构建检查，并在浏览器验证加载、错误、空结果、禁用和成功状态。检查桌面与手机、字号与间距切换、开关滑块边界、原生组件外观、滚动、导出和主要交互；不能用构建通过替代实际验证。
