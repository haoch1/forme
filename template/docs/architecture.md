# 独立模板结构

本目录是独立的 React + Vite 应用，复用 前端风格工作台 的组件源码和前端标准，不依赖工作台运行。项目名称、说明、文案与业务路由由 agent 根据聊天生成；当前入口的“应用示例”和演示数据可直接替换。

src/main.tsx 包含 TanStack Router、Query Provider、LucideProvider 和 Zustand 应用偏好。读取 src/selected-theme.json 后调用 applyThemeToDocument，配色、文字、密度、边框、阴影、内容宽度、侧栏、留白与图标选项直接生效。外观偏好根据选项使用 localStorage 或 sessionStorage。

src/design-system/interface-options.ts 是运行时映射，option-catalog.ts 记录合法预设，frontend-standard.ts 生成前端标准。normalizeTheme 补齐旧字段并剥离业务名称。不得在页面重新定义另一套主题或复制状态。

InterfaceOptionsProvider 将 57 项配置应用到共享组件：ToggleGroup 选项组与 Tabs 分页分别设置，Button/Input/Select 复用原生变体，RHF 使用所选校验时机，Sonner 接收位置、停留时间和关闭按钮。ActionButton 只动画图标并跟随真实 pending，遵循全局动效与系统减少动态效果。默认柔和圆角、轻阴影；经典黑白暗色采用 Radix Colors 的 Gray 分层，来源及许可随模板保留。

src/features/examples/toolkit-demos.tsx 提供 Lucide、Motion、可调分栏与 Zustand 保存示例，使用选中的动效、方向、比例和存储模式。board.tsx 提供选定的手柄/整卡拖拽、提示与记忆；支持键盘、菜单和 Esc 恢复。

列表通过 Query 读取本地 repository，表单使用 React Hook Form + Zod。后续接入 API 时替换 repository，不能把 Query 数据再复制进 Zustand。所有当前演示数据均在浏览器本地。

模板使用 Hash 路由，有明确 hash 时保留深链接；没有时打开默认示例。根目录“前端标准.md”与 selected-theme.json 是配置依据。当前选择持续作为后续页面和组件的默认设置，缺失字段才由 default-config.json 补齐。AGENTS.md 与 src/design-system/generation-rules.md 内容一致，复制标准和两种模板导出共用同一个标准生成器。业务布局根据需求组织。

开发前阅读 AGENTS.md、前端标准.md、docs/design-system.md、docs/component-policy.md 和 docs/ai-project-brief.md；来源与许可证见 third-party/。
