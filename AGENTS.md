# 前端风格工作台 开发约束

本文件约束工作台自身的开发。先阅读本文件、README.md、docs/design-system.md、docs/component-policy.md、docs/architecture.md 和 components.json，再修改代码。面向后续业务网页的可复用规范统一维护在 src/design-system/generation-rules.md；复制标准、规则弹窗和下载模板的 AGENTS.md 都从该文件生成，不能把工作台专用的左右布局约束套入所有业务项目。

## 固定技术栈
- 一类能力只采用一套既定实现；不向用户提供库切换，不因为预设配色增加依赖，不为尚未使用的能力预装新库。
- React + TypeScript + Vite + pnpm。版本以 package.json 和 pnpm-lock.yaml 为准；不得自行升级主版本。
- UI 只使用 src/components/ui 内的 shadcn/ui radix-vega；基础交互只使用 Radix UI。
- 图标只使用 lucide-react。不得再安装其他通用图标包；品牌标志使用有来源的本地资产。
- 普通布局使用 CSS Grid/Flex，可调分栏使用 react-resizable-panels v4。
- 拖拽使用 @dnd-kit/react 新 API；不得混入 @dnd-kit/core、旧 SortableContext 或 react-dnd。
- 动画只使用 motion/react；简单状态变化可用 CSS。不得直接安装 framer-motion、GSAP 或第二套动画引擎。
- 路由只使用 TanStack Router；接口/异步数据缓存只使用 TanStack Query。
- 表格只使用 TanStack Table v8；表单只使用 React Hook Form + Zod；通知只使用 Sonner；图表只使用 Recharts。
- 类名合并使用官方生成的 cn 工具。不要并行增加 clsx/tailwind-merge 的直接实现。

## 组件和样式
- 产品是面向中文小白的 shadcn 选配工具：直白的中文预设、开箱即用的默认值、真实预览与可复用导出。保留 shadcn 的组件语言，不另建控件外观系统，不让用户输入颜色值或代码参数。
- 采用官方 shadcn/ui Vega / Neutral / Geist 默认组合。shadcn 有对应组件就直接复用源码、原生变体和参数，删除重复实现；缺少对应能力时才使用固定栈中的成熟库。
- 基础组件位于 src/components/ui，不读取设计配置。configured-components.tsx 只映射原生参数；不得恢复 preset-controls.css、全局 data-slot 状态覆盖或手写焦点、字重、悬停、禁用与阴影系统。
- 默认值唯一来源为 default-config.json。初次进入、旧配置补齐、恢复默认和模板共用同一基线。默认 Card、Button、Input、Field、Tabs、ToggleGroup 等各自沿用原生样式；不把所有控件强制做成同一选中样式。
- 外观、布局、图标、Motion 与库参数由 option-catalog.ts 定义；所有选项必须在预览、复制标准和模板中一致生效。新字段提供兼容映射，取消的覆盖不再混入导出 JSON。
- 工作台只有一页，左侧常用/进阶，右侧实时预览；配置侧栏只留名称与控件。不要新增独立主题、导出或规则页面，不收集业务名称与说明。
- 桌面两栏各自滚动，overscroll-behavior: contain、scrollbar-gutter: stable；工具栏两行，移动端切换配置与预览。业务模板布局按聊天决定，不强制采用工作台双栏。
- className 主要控制布局。配色使用语义变量；不硬编码普通 UI 颜色。按钮与选项组尺寸调用原生 sm/default/lg；其他组件保留自身几何。
- 布局间距只调整容器 gap；--spacing 固定为 4px。字号、图标、开关、滑块、头像和图表不重复缩放，开关滑块必须完整位于轨道内。
- 切换沿用已挂载的组件和 iframe；主题只更新变化变量。本地示例不加假等待，图表不重播进场，公共控件不以 transition-all 插值尺寸。
- 表单用 Field/FieldGroup 与 RHF/Zod，保留 data-invalid、aria-invalid、说明关联。图表用 ChartContainer，加载用 Spinner/Skeleton，消息用 shadcn Sonner。
- Dialog 必须有 Title，Avatar 有 Fallback，图标按钮有可访问名称；保持原生 focus-visible、Esc、焦点圈定与返回。长弹窗受视口约束，标题与关闭区固定，内容内部滚动。
- 长 Select 使用 popper、原生碰撞检测和内部滚动，最高 320px，宽度跟随触发器；配色显示真实色卡。
- 先用 CLI --dry-run / --diff 核对基础组件更新，保留有理由的可访问性、中文文案和尺寸稳定补丁；维护 third-party/shadcn-components.json 并运行 check:ui。
- 中文短标题与按钮不加句末标点；完整说明使用中文标点。不加入无意义渐变、发光、宣传标题或虚构指标。

## 状态归属
- 组件内部临时状态使用 useState/useReducer。
- 跨组件客户端状态使用 Zustand，按功能拆分；使用 selector，避免订阅整个 store。
- 远端数据使用 TanStack Query；不得复制到 Zustand 或另写请求缓存。
- 可分享的搜索、分页、视图选择使用路由 URL 状态。
- 表单状态由 React Hook Form 持有。
- 本地演示数据明确标记，不伪装成后端服务。localStorage key 必须带版本。

## 交互
- 动画默认 160ms ease-out；可选利落 100ms、舒缓 280ms 及淡入、轻移、缩放预设；遵循 prefers-reduced-motion。
- 异步按钮复用原生 Button + Spinner 组合，pending 只对应真实等待；普通点击不额外旋转图标或添加延迟。
- 同一元素的 transform 仅由一个机制控制。拖拽交给 dnd-kit，动画作用于不同容器。
- 拖拽必须提供可聚焦手柄、键盘操作与移动菜单；取消拖拽恢复快照。
- 分栏尺寸使用明确单位（例如 "25%"）；保存布局使用稳定面板 ID。
- 显示加载、错误、空结果、禁用与成功反馈，所有可点击控件有真实结果。

## 依赖和来源
- 新增依赖先检查现有栈和成熟组件是否已覆盖。每类职责维持单一直接依赖实现。
- 所有直接依赖必须固定精确版本，提交 lockfile，用 pnpm install --frozen-lockfile 重现。
- 新增库确有必要时，先说明职责及替代关系，再更新 docs 和 stack-policy.json。
- 引入开源代码必须保留来源、提交号、许可证和修改说明；查看 third-party/。
- 不以消除所有传递依赖的多版本为目标，不为“去重”破坏兼容性。

## 交付检查
运行 pnpm typecheck、pnpm lint、pnpm check:stack、pnpm check:ui、pnpm check:defaults、pnpm check:template、pnpm build。验证相关真实交互和桌面/移动布局。修改完成后说明结果与实际限制，不用构建成功代替浏览器验证。
