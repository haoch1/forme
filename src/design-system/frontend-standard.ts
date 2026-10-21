import { normalizeTheme, type ThemeConfig } from "./theme";
import { optionSections, optionValue } from "./option-catalog";
import stack from "./stack.json";
import { textPixels, iconPixels, iconStrokes, motionSeconds } from "./interface-options";
import baseline from "./default-config.json";
import generationRules from "./generation-rules.md?raw";

export function frontendStandard(config: ThemeConfig): string {
  const theme = normalizeTheme(config);
  const choices = optionSections.map((section) => `### ${section.label}\n${section.fields.map((field) => `- ${field.label}：${field.options.find((option) => option.id === optionValue(theme, field))?.label ?? "已导入的自定义值"}`).join("\n")}`).join("\n\n");
  const versions = stack.map((item) => `- ${item.role}：${item.name} ${item.version}`).join("\n");
  const baselineIds = new Set(["preset", "mode", "font", "textSize", "density", "radius", "shadow", "focusStyle", "selectionStyle", "tabsStyle", "textWeight", "controlHeight", "groupSpacing", "viewTransition", "copyStyle"]);
  const baselineChoices = optionSections.flatMap((section) => section.fields).filter((field) => baselineIds.has(field.id)).map((field) => `${field.label}：${field.options.find((option) => option.id === optionValue(baseline as ThemeConfig, field))?.label}`).join("；");
  return `# 可复用前端标准

请将这份标准应用于本次聊天要开发的项目。项目名称、说明、界面文案、数据字段和业务路由，请根据聊天中的需求自动生成，不要求我在风格工作台中填写。
本标准只规定视觉、交互和技术栈。列表、资料、看板等预览内容都是样式示例，不代表业务需求。

${generationRules.replace(/^# /, "## ")}

## 默认设置与后续继承
工作台的统一初始默认设置为：${baselineChoices}。

下方“视觉与交互预设”和“可复现配置”记录本次导出的实际选择，作为后续网页、新页面和组件的默认配置；若与初始默认不同，以本次选择为准。未明确修改的部分持续继承，缺失字段从 default-config.json 补齐。除非后续聊天明确要求，不擅自改换风格、移除预设或换用另一套库。

## 视觉与交互预设
UI 固定为模板内的 shadcn/ui Radix 组件，优先原生接口与变体；可调整外观是独立的项目主题扩展；图标统一使用 Lucide。所有配置使用下列确定选项：

${choices}

### 实现映射（给 agent）
- 根字号：${textPixels[theme.textSize]}px；Lucide 图标：${iconPixels[theme.advanced.iconSize]}px，线宽 ${iconStrokes[theme.advanced.iconStroke]}。
- Tailwind 基础 --spacing 固定为 4px，密度只改变卡片内边距、布局间距和表格行留白；禁止同时缩放开关滑块、复选框、头像与图表。控件高度与图标大小按独立选项设置。
- 动画时长：${theme.motion ? Math.round(motionSeconds[theme.advanced.motionSpeed] * 1000) : 0}ms；缓动：${theme.advanced.motionEase}。减少动态效果偏好优先。
- 分栏初始比例：${theme.advanced.panelRatio === "focus-left" ? "65 / 35" : theme.advanced.panelRatio === "focus-right" ? "35 / 65" : "50 / 50"}。恢复按钮恢复所选比例。
- 窄屏以 760px 为切换点，页面容器随设备宽度响应；弹窗不超过视口高度，标题和关闭按钮固定，内容在内部滚动。

## 固定技术栈
${versions}

组件源码由项目持有，优先复用已有实现；原生组件不导入项目配置，预设通过 components/preset-controls.tsx 组合，外观扩展放入 design-system/preset-controls.css，来源与补丁见 docs/component-policy.md；使用语义颜色变量，保留依赖精确版本与 lockfile。同一职责不重复安装 UI、图标、动画、拖拽或状态库。普通布局使用 CSS Grid/Flex，可调分栏使用 react-resizable-panels v4；拖拽使用 @dnd-kit/react 新 API。
每类能力只采用上面固定的一套方案，不提供同类库切换，不为尚未出现的功能新增依赖。库的配套模块不作为额外方案；应用依赖与传递依赖不混为一谈。

## 响应式与操作要求
同时支持电脑、平板和手机。平板收起桌面宽侧栏；手机使用四列紧凑导航，普通数据列表改为卡片展示，表单使用单列。内容不能通过压缩字号或挤窄桌面表格适配手机。拖拽提供键盘手柄、菜单替代和 Esc 取消；分栏支持键盘调整。动效遵循系统减少动态效果设置。
跨组件客户端状态使用 Zustand；远端数据使用 TanStack Query；表单使用 React Hook Form + Zod。长期偏好使用 localStorage，当前会话偏好使用 sessionStorage，以本标准的选项为准。设计配置本身不包含账号或业务信息。

## 界面细节实现
上述“细节”预设全部落实到共享组件与布局，不能只保存在配置中：
- 焦点：鼠标点击不保留大面积焦点圈；键盘操作保留所选的 1px 或 2px 清晰提示，不通过强制 blur 移除键盘焦点。
- 选中与字重：柔和描边采用前景色 40% 混合底色，清晰描边采用前景色；分段浮起在原生 ToggleGroup 上组合 shadcn Tabs 的容器与选中项外观（项目描述名称，非官方同名变体），浅色用背景色，暗色用 input/30。分段用于少量、短标签、彼此相关的选项组，不改写操作按钮、复选框、开关、下拉框和表格行；选项中不添加装饰勾。Tabs 内容分页独立采用分段浮起或独立描边，不使用下划线。控件字重按选项使用 400 或 500；悬停、禁用、控件高度使用共享语义变量。
- 按钮与表单：主按钮复用 shadcn Button 的 default、secondary 或 outline 变体，明确指定的次要、危险和链接按钮不受主按钮样式覆盖。Input、Textarea 与 Select 同步采用描边或柔和填充；必填字段保留 aria-required，可选不显示、星号或文字标记。RHF mode 和 reValidateMode 同步使用 onSubmit、onBlur 或 onChange。
- 文案：简洁模式使用短标签和短提示，不加多余冒号或句末标点；完整说明模式使用完整中文句子。标题、按钮、数量信息保持一致。
- 分组：采用所选的 16px、24px 或 32px 间距，以细线或留白区分。标题、输入框、卡片边缘和操作区沿统一对齐线排列。
- 滚动：有独立滚动区域时各自处理滚动，使用 overscroll-behavior: contain 避免串滚，并以 scrollbar-gutter: stable 固定滚动条占位，切换内容不改变控件宽度。
- 切换：已载入内容直接复用，默认不重新加载、不闪白、不人为等待。所选淡入使用 Motion，遵循系统减少动态效果。骨架或行内反馈仅在真实异步等待时显示。
- 校验：React Hook Form + Zod 按所选时机处理字段下方错误或顶部汇总；保留无效字段标识和可理解的修正提示。列表使用所选的横线、网格或无分隔线，悬停高亮在隔行底色下仍生效；空状态复用 shadcn Empty，可选带图标。
- 弹窗与提示：宽度使用 24rem、28rem 或 40rem，始终受视口约束；遮罩使用 10% 或 40% 深度。Radix 处理焦点返回、Esc 关闭、点击遮罩是否关闭，以及提示延迟（0 / 300 / 700ms）与上下左右方向；提示接近屏幕边缘时由 Radix 自动避让。
- 消息：使用 Sonner 的原生 position、duration 与 closeButton，提供六个位置、2 / 4 / 6 秒停留和可选关闭按钮，工作台预览与独立项目使用同一组选项；确保消息在当前可见区域内。
- 操作图标：刷新、重播、恢复与重试使用共享 ActionButton，图标由 Motion 单独旋转，按钮文字和尺寸保持稳定。可关闭、点击转动或悬停转动，真实 pending 决定等待期间是否持续旋转，不能增加假等待；优先遵循全局关闭动效和系统减少动态效果。
模板中的 default-config.json 是统一默认基线，首次进入、补齐旧字段与恢复默认使用同一份配置，用户调整后自动保存。interface-options.ts、InterfaceOptionsProvider、useInputMethod 与共享组件是运行时实现来源。根据聊天中的业务需求替换示例，保留这些基础行为。

## 可复现配置
以此配置的语义颜色、圆角和选项为准，别用近似颜色或自行发挥。使用模板时读取 src/selected-theme.json、src/selected-theme.css 和 AGENTS.md；直接从聊天开发时将以下配置落实为公共主题和组件约束。

\`\`\`json
${JSON.stringify(theme, null, 2)}
\`\`\`

## 验收
实现真实的主要流程及加载、错误、空结果和成功反馈。保持中文表达清楚，不添加装饰渐变、发光、大幅宣传标题或虚构业务指标。运行 pnpm typecheck、pnpm lint、pnpm check:stack、pnpm check:ui、pnpm build，并在浏览器验证桌面和手机上的主要操作。
`;
}
