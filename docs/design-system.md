# 设计系统

统一基线为官方 shadcn/ui Vega / Neutral / Geist。Vega 在官方 Create 文档中被描述为经典 shadcn 外观；没有公开的风格使用量排名。具体来源、默认值与组件对应关系见 default-profile.md。

## 原生组件与配置

基础组件位于 src/components/ui，由固定版本 shadcn CLI 生成。所有控件保留原生变体、尺寸、语义和状态；不再维护独立的 preset-controls.css，也不再覆盖焦点、字重、悬停、阴影、输入框填充或表格边线。

configured-components.tsx 只负责六类原生参数映射：Button 的 variant / size、ToggleGroup 的 variant / size、TabsList 的 variant、SelectContent 的定位、Dialog 的外部交互策略和 Tooltip 的 side。明确传入的参数优先。Card、Input、Field、Checkbox、Switch、Slider、Table 等直接引用 registry 组件。

工作台配置区、顶部按钮、Accordion 分组、Tabs 页签、配色色卡、Dialog 弹窗与右侧示例共用这些基础组件。工作台 Card 容器使用 gap-0 / py-0 组织工具布局；CSS 只承担排列、滚动、响应式和示例画布布局。左侧不显示额外实现说明。

## 默认值与可调整项

唯一基线为 default-config.json。首次进入、旧数据补齐、恢复默认、复制标准和模板共用它；index.css 的首屏颜色逐项接受 check:defaults 校验。旧版配置 v8 迁移后丢弃已取消的外观覆盖，原生参数和主题值保留兼容映射；用户仍可手动调整现有选项。

41 组选项分为：外观 7、布局 4、图标 2、动效 4、交互 7、细节 17。细节仅保留真实的原生变体、参数或组件组合：选项组、页签、按钮、表单校验与必填、文案、按钮尺寸、内容切换、加载、错误位置、消息位置/时长/关闭按钮、空状态、弹窗关闭与提示延迟/方向。

默认根字号 16px、圆角 0.625rem；Card 原生 24px 内边距、shadow-xs 与 ring；Button 默认 36px；FieldGroup 原生 28px；输入文本 400，Button/Label/Tabs 原生 500；原生 focus-visible 焦点、悬停与禁用。Tooltip 默认 0ms；Sonner 默认右下、4 秒、无关闭按钮。明暗两套均使用 Neutral 语义分层。

布局间距只映射容器 gap 为 12 / 16 / 24px，不调整原生卡片和表格的留白。按钮与 ToggleGroup 使用 sm / default / lg；其他组件保留自身原值。图标尺寸和线宽仅通过 Lucide 原生 Provider 调整，控件内部图标尺寸由控件决定。--spacing 始终为 4px。

## 预览与导出

桌面两栏各自滚动，稳定预留滚动条，避免串滚与切换宽度抖动。工作台宽度、工具栏排列是编辑器布局，不作为业务项目的强制布局。iframe 沿用已加载文档，通过受来源校验的消息切换示例并报告内容高度；颜色变量只更新变化项。字号与间距不插值几何，图表关闭重复入场动画。

表单由 RHF + Zod 管理，表格由 TanStack Table 管理；图表、消息、分栏与拖拽分别复用 Recharts、Sonner、react-resizable-panels 和 dnd-kit。shadcn 已有的部分不另写替代组件。不存在对应组件的业务布局和拖放区域使用语义变量与成熟库组合。

generation-rules.md 是复制标准、规则弹窗和模板 AGENTS.md 的共同来源。frontend-standard.ts 从实际配置和 option-catalog.ts 生成说明与完整 JSON。浏览器 ZIP 与命令行模板共用同一生成器和组件源码。
