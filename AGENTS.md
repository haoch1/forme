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
- 产品面向中文用户，采用预设优先的方式。通过整套方案、选择器、切换组提供自定义能力，不要求用户输入颜色值、数字或代码参数。
- 前端风格工作台 只有一个工作台：左侧“常用 / 进阶”配置，右侧组件与交互预览，并可切换电脑、平板和手机。能合并的功能合并；不要再新增独立的主题、能力、导出或规则页面。
- 编辑器组织参考 shadcn Create：紧凑的参数侧栏与宽预览画布，页头集中导出操作，预览工具收为两行。桌面左右两栏在视口内各自滚动，不能互相带动或向外层串滚；两栏使用 scrollbar-gutter: stable 固定预留滚动条宽度。预览根据实际内容报告高度，禁止写死内容高度留下空白。默认展示丰富的组件总览；移动端切换配置与预览。
- 编辑器外壳固定字体、字号和间距；选中的主题只影响预览和导出项目。手机列表改为卡片，平板收起宽侧栏，导航不依赖横向滚动。嵌入预览的弹窗按父页面可见区域定位。
- 工作台统一全宽，页头与正文使用一致的左右边距。导出业务项目的布局按选项与聊天需求执行。
- 不在工作台收集项目名称、项目说明或业务需求；agent 根据聊天自动填充这些信息。导出“前端标准.md”只包含视觉、交互、技术栈和可复现配置，不夹带历史业务信息。
- 所有选项必须在预览、前端标准和独立模板中一致生效。新配置字段提供旧数据默认值；选项目录位于 option-catalog.ts，运行时应用位于 theme.ts / interface-options.ts，不能只保存 JSON 而不实现效果。
- 进阶“细节”共 28 项，覆盖焦点、选项组、标签分页、字重、悬停、禁用、主按钮、输入框、必填标记、文案、分组、分隔、切换、加载、校验、表格、空状态、消息、弹窗、遮罩、提示与控件高度。使用 InterfaceOptionsProvider 与共享变量落实配置；消息位置、停留与关闭按钮用 Sonner 原生参数，提示延迟/方向用 Radix，表单用 RHF mode + Zod，过渡用 Motion。
- 所有默认选项统一读取 default-config.json，初次进入、旧配置补齐、恢复默认和导出模板不能各自维护不同基线。可调整项保留用户的本机选择。默认柔和圆角 0.625rem、卡片轻阴影、控件字重 400、高度 36px、键盘焦点细线、分段浮起选中态、直接切换、简洁文案和 24px 分组间距。选项不添加装饰勾；鼠标点击不显示持久焦点圈。分段浮起仅给少量相关选项组使用共用底板与白底轻阴影；内容分页单独用 tabsStyle 配置，不改写独立操作按钮、复选框、开关、下拉框与表格行。
- 更改细节选项时，右侧立即展示对应的实际组件状态；焦点和悬停提供明确标注的静态状态示例，加载状态只在明确的演示区域展示；弹窗与消息提供局部布局示意及原生组件操作。无需强制打开弹窗、抢走左侧焦点或重新加载 iframe。
- 优先查找既有组件和示例，再组合成熟库；同一控件不能重新手写另一套样式。
- 使用语义变量：background、foreground、primary、muted、border、destructive。页面不得硬编码普通 UI 颜色。
- 经典黑白暗色沿用 Radix Colors grayDark 的语义分层，页面、侧栏/卡片、控件与边框需要清晰区分；色值统一维护在默认主题并同步导出，不能在页面另写暗色覆盖。
- className 主要控制布局。按钮尺寸、变体、字体和颜色由公共组件/设计变量管理。
- 公共外观变化在组件或主题中修改；不得在各页面复制覆盖同一组件。
- 基础组件维持官方 shadcn/ui 结构、语义和原生变体；已有可调整外观是项目主题扩展，不冒称官方变体。不添加宣传大标题、无意义渐变、发光、装饰卡片或虚构业务指标。
- 工作台导航使用 shadcn 分段切换样式，不使用下划线标签。常用设置分组默认展开，以标题、分隔线与留白区分层级。
- 短标题、按钮与简短提示不加句末标点；完整说明使用中文标点。选中状态用控件表达，不重复写“当前：某项”。配色选择附带真实色卡，不只列名称。
- 切换示例沿用已加载的预览文档和组件，不通过重建 iframe 或刷新页面切换，不为本地示例人为添加加载等待。
- 公共控件仅过渡颜色、背景、边框、阴影、透明度或 transform，禁止 transition-all 导致字号与密度调整时尺寸逐帧变化。主题只更新发生变化的 CSS 变量；表格列依赖稳定的 mutation 方法，配置变化不能重建全部单元格。
- Tailwind 的基础 --spacing 固定为 4px，不能用它实现内容密度。密度只调整卡片内边距、布局间距与表格行留白；字号只改变文字尺度。图标尺寸、开关滑块、复选框、头像、图表高度与控件高度分别使用各自的尺寸，不随密度一起缩放。修改这些预设必须检查所有开关的滑块是否完整位于轨道内。
- 预览 iframe 内的 html 同样使用 scrollbar-gutter: stable，并在首次布局前启用。内容高度同步期间出现或消失的内部滚动条不能改变可用宽度，尤其要在三列/两列断点附近逐帧检查，避免列数和图表宽度来回切换。
- 长下拉使用 Radix Select 的 popper 定位，左边对齐选择框，默认向下展开，空间不足由原生碰撞检测调整。列表最高 320px 并在内部滚动，宽度跟随选择框；不能让二十四套配色铺满侧栏。配色包含真实色卡，新增色系只使用有出处的成熟色阶，不安装配色库。
- 表单使用 Field/FieldGroup；错误使用 data-invalid 和 aria-invalid。
- 图标按钮必须有 aria-label；Dialog 必须包含标题；Avatar 必须有 fallback。
- 内容较长的弹窗固定在视口范围内，标题和关闭按钮不随列表滚动；技术栈与标准弹窗统一采用 bounded-dialog，保留明确的“关闭”按钮和 Esc 关闭。
- 原组件更新先用 shadcn CLI 的 --dry-run/--diff 查看变化，保留本地修改。基础组件不导入 design-system；项目预设通过 components/preset-controls.tsx 组合原生参数，外观扩展只在 design-system/preset-controls.css 的 preset-* 类中维护，不恢复全局 data-slot 状态覆盖。明确传入的原生 variant 优先于预设。
- 新增或更新基础组件后记录 third-party/shadcn-components.json 的 registry 来源、源码摘要和小范围补丁；运行 pnpm check:ui 防止未经核对的组件改动。Chart、Spinner、Avatar、Field、TabsContent 等已有组件能满足时不手写替代。

## 状态归属
- 组件内部临时状态使用 useState/useReducer。
- 跨组件客户端状态使用 Zustand，按功能拆分；使用 selector，避免订阅整个 store。
- 远端数据使用 TanStack Query；不得复制到 Zustand 或另写请求缓存。
- 可分享的搜索、分页、视图选择使用路由 URL 状态。
- 表单状态由 React Hook Form 持有。
- 本地演示数据明确标记，不伪装成后端服务。localStorage key 必须带版本。

## 交互
- 动画默认 160ms ease-out；可选利落 100ms、舒缓 280ms 及淡入、轻移、缩放预设；遵循 prefers-reduced-motion。
- 刷新、重播、恢复和重试复用 ActionButton，只动画图标。支持点击、悬停或关闭；等待时旋转仅跟随真实 pending，不能为了播放动画给操作加延迟。系统减少动态效果的更改需即时生效。
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
运行 pnpm typecheck、pnpm lint、pnpm check:stack、pnpm check:ui、pnpm build。验证相关真实交互和桌面/移动布局。修改完成后说明结果与实际限制，不用构建成功代替浏览器验证。
