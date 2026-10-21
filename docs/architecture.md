# 工程结构与数据边界

src/features/guide/index.tsx 是唯一工作台页面，组合常用/进阶选项、三种设备预览、导出和规则弹窗。旧路由仅重定向到对应工作区，不再维护重复页面。

src/features/guide/frame.tsx 是同源 iframe 预览入口。main.tsx 根据 __preview 查询标记进入预览，不渲染工作台外壳。预览文档保持挂载，通过受来源校验的 postMessage 立即切换示例；常用组件一起载入，切换时不重新请求页面或展示加载转圈。预览使用同一组 Query / Tooltip Provider、shadcn/ui 组件和成熟库；storage 事件同步 Zustand 设计配置，所有尺寸媒体查询与弹窗基于真实 iframe 视口。

桌面外壳限制在视口内，左右两栏各自滚动并固定预留滚动条宽度。右栏滚动通知 iframe 更新可见区域，弹窗和消息定位在实际可见区域。细节选项通过来源校验后的 style-preview-example 消息指明演示字段，detail-option-preview.tsx 使用共享组件提供即时示例，既不重载预览，也不改变左侧滚动与焦点位置。

src/design-system 保存默认色板、tweakcn 预设、57 组选项、默认值、运行时映射与前端标准生成器。normalizeTheme 对旧配置补齐 advanced，并剥离旧 name 字段，避免复用标准时夹带业务信息。

default-config.json 是默认选项的唯一基线；theme.ts 的 initialTheme、interface-options.ts 的 defaultInterface 和导出脚本共同读取它。用户已保存的配置优先于默认值，恢复默认重新应用同一份基线。

InterfaceOptionsProvider 为预览与独立模板提供相同选项。components/ui 维持原生接口，components/preset-controls.tsx 将选项映射到原生参数，design-system/preset-controls.css 仅调整显式 preset-* 组合的外观。来源摘要与小范围补丁见 docs/component-policy.md。ActionButton 管理操作图标 Motion 动效与真实 pending；系统减少动态效果通过 useSyncExternalStore 订阅媒体查询变化。InterfaceEmpty 组合原生 Empty，TableDetailPreview 复用语义 Table。选项组的 selectionStyle 与内容分页的 tabsStyle 分开，保留 ToggleGroup 与 Tabs 原生键盘语义。表单校验时机映射 RHF mode，消息选项统一传给 Sonner；模板入口与预览入口必须使用相同配置。

src/features/examples 是可复用的表格、表单、设置和组件组合；toolkit-demos.tsx 包括 Lucide 图标、Motion 动画、可调两栏与 Zustand 偏好保存。src/features/interactions/board.tsx 提供 dnd-kit 拖动、菜单、键盘、取消恢复与可选记忆。普通业务数据使用本地 repository，由 TanStack Query 管理；接入 API 时替换 repository，不能另建重复缓存。

src/lib/export-project.ts 在浏览器下载 ZIP 时写入当前 JSON、CSS 和“前端标准.md”。scripts/template-files.mjs 为命令行与打包共用源码提取器，通过 scripts/render-standard.mjs 的 Vite SSR 模块加载器执行同一个 frontendStandard / exportCSS / normalizeTheme，不再维护简版说明。src/design-system/generation-rules.md 是后续业务网页规则的唯一来源，同时用于复制标准、规则弹窗与模板 AGENTS.md；本仓库根 AGENTS.md 另行保留工作台开发约束。导出的实际配置是后续页面与组件的默认值，缺失字段才补齐统一基线。

template/src/main.tsx 是独立业务模板入口，直接使用同样的运行时主题、图标 Provider、动效、分栏、拖拽和存储选项。业务网页按需求布局，不继承工作台专用的配置侧栏。

项目名称、说明、文案及路由根据 agent 聊天需求生成；预览中的示例不代表业务范围。独立模板默认 Hash 路由，已有深链接不会被默认预览入口覆盖。工作台是 browser history，部署需 SPA fallback。所有当前数据均在浏览器本地，工作台未连接账号、数据库或模型服务。
