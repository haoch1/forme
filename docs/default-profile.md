# 默认风格：Vega / Neutral / Geist

统一采用 shadcn 官方称为经典外观的 Vega，搭配 Neutral 语义配色与 Geist 字体。官方没有公布风格使用量排名，不将任何方案宣传为使用量第一。

来源：[Create 风格说明](https://ui.shadcn.com/docs/changelog/2025-12-shadcn-create)、[主题规范](https://ui.shadcn.com/docs/theming)、[官方安装的语义颜色](https://ui.shadcn.com/docs/installation/manual)。实际组件来源与摘要保存在 third-party/shadcn-components.json，CLI 固定为 4.22.1。

| 项目 | 默认行为 |
| --- | --- |
| Button | 原生 default / outline / secondary / ghost / destructive / link；标准高度 36px |
| 字重 | 保留各组件原值，Button、Label、Tabs、ToggleGroup 为 500，输入内容为 400 |
| Card | 原生 shadow-xs 与 foreground/10 轮廓，不叠加第二圈边框；24px 内边距 |
| 选项组 | ToggleGroup 原生选中背景；有边框的选项组直接传 outline |
| 内容分页 | Tabs 原生 default 变体，共用底板与选中项轻阴影 |
| 输入、复选框、开关、滑块 | 原生 Input / Checkbox / Switch / Slider，分别保留自身尺寸和状态 |
| 表单 | Field / FieldGroup，默认 28px 字段分组间距；RHF + Zod 处理校验 |
| 焦点、悬停、禁用 | 原生状态；键盘使用 3px、ring/50 焦点，遵循组件原生 focus-visible 行为 |
| 导航、表格分页 | Sidebar / SidebarMenuButton、Pagination / PaginationPrevious / PaginationNext |
| 消息 | shadcn Sonner 语义外观；默认右下、4 秒、无关闭按钮 |
| 弹窗、提示 | Dialog 原生 28rem 宽度、10% 遮罩；Tooltip 原生 0ms 延迟 |
| 主题尺寸 | 16px 根字号、基础圆角 0.625rem、Tailwind 基础尺寸单位 4px |

default-config.json 是唯一运行时默认源。index.css 的首屏回退值由 check:defaults 与它逐项核对。工作台、预览、恢复默认、复制标准、浏览器 ZIP 和命令行模板读取同一基线。

41 组选项允许手动修改主题、布局与成熟库参数。旧的自定义焦点、字重、悬停、禁用、阴影、输入填充、边线和遮罩选项已移除；不再存在 CSS 控件外观适配层。选项组只对应原生 default/outline，页签只对应 default/line，按钮和尺寸同样直接传给组件。

shadcn 存在对应组件时使用该组件并删除重复实现；没有对应能力时才使用固定栈中的成熟库。业务布局与容器间距是项目设置，不冒称 shadcn 有统一的业务布局规定。保留中文可访问名称、方向转发和尺寸稳定等必要补丁。
