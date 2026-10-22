# 工程结构

独立模板由 src/main.tsx 启动，使用 TanStack Router 的 Hash 路由。示例包含项目列表、任务看板、分栏、图标、表单与通知设置，可按业务需求增减。所有演示数据均保存在浏览器本地。

## 组件与配置

src/components/ui 保存 shadcn/ui registry 组件。configured-components.tsx 只传递原生 variant、size、side、定位和弹窗外部交互参数，不维护另一套外观 CSS。没有对应 shadcn 组件的能力使用固定技术栈中的成熟库。

src/selected-theme.json 是生成时选择的完整配置，src/selected-theme.css 提供相同主题变量。缺失字段才从 src/design-system/default-config.json 补齐。字体、明暗模式、语义色、圆角、布局间距和原生组件参数由这条统一管线落实；不要以工作台初始值覆盖已导出的实际选择。

src/design-system/option-catalog.ts 记录预设及中文名称；interface-options.ts 将配置映射为运行时变量或成熟库参数。字号、布局间距、图标、控件和图表尺寸各自控制；Tailwind --spacing 固定 4px，避免预设切换连带缩放。

## 状态与路由

组件临时状态使用 React；表单由 React Hook Form + Zod 持有，表格由 TanStack Table 管理。跨组件客户端偏好使用 Zustand，远端异步数据使用 TanStack Query。应用外观偏好按导出配置使用本地或会话存储，key 带版本。路由、可分享的筛选和分页由 TanStack Router 管理。

## 后续开发

AGENTS.md、前端标准.md 与 selected-theme.json 共同定义后续页面与组件的默认配置。业务名称、文案、数据和布局根据聊天需求生成，不继承工作台专用的双栏编辑器。第三方来源、源码摘要和许可证位于 third-party/；更新组件后执行 check:ui。

验收运行类型、Lint、依赖、源码和构建检查，并在浏览器验证真实操作、明暗模式、移动布局及选项效果。
