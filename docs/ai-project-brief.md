# 与 agent 协作

将项目根目录“前端标准.md”或工作台复制的标准交给 agent。项目名称、说明、文案、路由与业务字段由 agent 根据当前聊天的需求生成；这里不需要另填一份需求表。

开发前阅读 AGENTS.md、前端标准.md、components.json、docs/design-system.md、docs/component-policy.md、docs/architecture.md 和 src/selected-theme.json。统一使用 React/Vite/TypeScript、shadcn/ui、Lucide、Motion、react-resizable-panels、dnd-kit、Zustand 与 TanStack。版本以 lockfile 为准，每类职责只用一套库。

导出的实际配置就是后续页面、组件与样式修改的默认设置；未明确修改的部分持续继承。规则源是 src/design-system/generation-rules.md，已同步到模板 AGENTS.md 和复制标准。业务布局按需求实现，不要求复制工作台配置栏。

按选择的预设实现所有视觉与交互，直接复用现有组件。预览中的项目列表、资料和任务只是示例，不固定业务领域。所有主要控件有真实结果，包含加载、错误、空结果与成功反馈；适配电脑、平板和手机。

完成后运行类型、Lint、依赖与构建检查，在浏览器验证主要流程，并用中文说明如何预览。
