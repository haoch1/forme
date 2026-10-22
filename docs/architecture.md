# 工程结构

应用只有一个配置工作台。router.tsx 提供入口与搜索状态，旧路由重定向到工作台；删除未使用的独立布局、示例和交互页面。源文件按配置编辑、组件示例、拖拽、存储和导出组织。

AppShell 固定使用官方默认主题；StyleWorkbench 提供左侧常用/进阶与右侧预览。顶部集中规则、复制和下载，工具栏保留两行；左侧与右侧在视口内独立滚动。基础 UI 为 src/components/ui 中的 registry 源码，六个 configured-components 适配器只传递原生参数，不含外观 CSS。

同源 frame.tsx 是预览入口。父页面通过受来源校验的消息切换已挂载的示例，storage 事件同步主题；不重载 iframe，不加假等待。ResizeObserver 报告实际高度，内容根据实际设备宽度响应；父页面通知可见区域，原生弹窗与消息受可见区域约束。

src/design-system/default-config.json 是唯一默认基线。normalizeTheme 对旧字段映射为现有原生参数，并删除已经取消的外观覆盖；Zustand v8 保存配置，使用 selector、撤销和重做。恢复默认读取相同基线。主题只更新发生变化的 CSS 变量，Tailwind 基础尺寸始终为 4px。

option-catalog.ts 定义合法选项与中文名称。interface-options.ts 将布局和成熟库参数映射为运行时值。UI 状态和交互由 shadcn / Radix 管理；表单由 RHF + Zod、异步数据由 Query、表格由 Table、客户端偏好由 Zustand 分别持有。

frontend-standard.ts 生成完整规范、选项清单、版本与 JSON。generation-rules.md 同时用于规则弹窗、复制标准与模板 AGENTS.md。scripts/template-files.mjs 提取共享组件、hooks、示例与规则，render-standard.mjs 通过 Vite SSR 调用同一生成器；浏览器下载时写入当前配置，命令行生成时同样处理。

独立模板从 template/src/main.tsx 启动，采用 Hash 路由。业务名称、内容和布局按聊天需求生成，不继承工作台专用的双栏编辑器；示例不是业务范围。所有演示数据明确为浏览器本地数据，没有账号、数据库或模型服务。
