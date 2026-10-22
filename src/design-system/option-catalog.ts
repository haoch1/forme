import { chooseStyle, type ThemeConfig } from "./theme";
import { paletteCatalog } from "./palette-catalog";

export type OptionDefinition = {
  id: string;
  label: string;
  description?: string;
  scope: "base" | "advanced" | "radius";
  group?: string;
  options: readonly { id: string; label: string }[];
};
const options = (...pairs: [string, string][]) => pairs.map(([id, label]) => ({ id, label }));
const base = (id: string, label: string, values: [string, string][]): OptionDefinition => ({ id, label, scope: "base", options: options(...values) });
const advanced = (id: string, label: string, values: [string, string][], description?: string): OptionDefinition => ({ id, label, scope: "advanced", options: options(...values), description });

export const optionSections: { id: string; label: string; preview: string; library: string; fields: OptionDefinition[] }[] = [
  { id: "appearance", label: "外观", preview: "cards", library: "shadcn/ui", fields: [
    base("preset", "主题配色", paletteCatalog.map((palette) => [palette.id, palette.label])),
    base("mode", "明暗模式", [["light", "浅色"], ["dark", "深色"]]),
    base("font", "字体", [["geist", "现代无衬线"], ["system", "中文系统"], ["mono", "等宽"]]),
    base("textSize", "文字大小", [["compact", "紧凑"], ["standard", "标准"], ["large", "较大"]]),
    base("density", "布局间距", [["standard", "标准"], ["compact", "紧凑"], ["spacious", "宽松"]]),
    { id: "radius", label: "边角形状", scope: "radius", options: options(["0rem", "直角"], ["0.25rem", "微圆"], ["0.5rem", "适中"], ["0.625rem", "柔和"], ["1rem", "圆润"]) },
    advanced("surface", "页面底色", [["plain", "纯净"], ["muted", "柔和底色"]]),
  ] },
  { id: "layout", label: "布局", preview: "app", library: "CSS Grid / Flex", fields: [
    base("navigation", "导航位置", [["sidebar", "左侧"], ["top", "顶部"]]),
    advanced("sidebarWidth", "侧栏宽度", [["narrow", "窄"], ["standard", "标准"], ["wide", "宽"]], "左侧导航时生效。"),
    advanced("contentWidth", "内容宽度", [["full", "铺满"], ["wide", "居中宽版"], ["reading", "居中阅读版"]], "应用于右侧示例和导出项目；工作台自身始终全宽。"),
    advanced("pagePadding", "页面留白", [["compact", "紧凑"], ["standard", "标准"], ["generous", "充裕"]]),
  ] },
  { id: "icons", label: "图标", preview: "icons", library: "Lucide", fields: [
    advanced("iconSize", "图标大小", [["small", "精细"], ["standard", "标准"], ["large", "醒目"]]),
    advanced("iconStroke", "图标线条", [["thin", "纤细"], ["standard", "标准"], ["bold", "清晰"]]),
  ] },
  { id: "motion", label: "动效", preview: "motion", library: "Motion", fields: [
    base("motion", "动态效果", [["true", "开启"], ["false", "关闭"]]),
    advanced("motionStyle", "出现方式", [["fade", "淡入淡出"], ["slide", "轻移出现"], ["scale", "轻微缩放"]]),
    advanced("motionSpeed", "动画速度", [["fast", "利落"], ["standard", "标准"], ["relaxed", "舒缓"]]),
    advanced("motionEase", "运动节奏", [["easeOut", "自然收尾"], ["easeInOut", "平滑过渡"]]),
  ] },
  { id: "interaction", label: "交互", preview: "panels", library: "react-resizable-panels · dnd-kit · Zustand", fields: [
    advanced("panelDirection", "分栏方向", [["horizontal", "左右"], ["vertical", "上下"]]),
    advanced("panelRatio", "分栏初始比例", [["equal", "均分"], ["focus-left", "编辑区更宽"], ["focus-right", "预览区更宽"]]),
    advanced("rememberPanels", "记住分栏尺寸", [["true", "记住"], ["false", "每次恢复预设"]]),
    advanced("dragMode", "任务拖动方式", [["handle", "拖动手柄"], ["card", "整张卡片"]]),
    advanced("dragFeedback", "拖放区域提示", [["subtle", "轻提示"], ["clear", "清晰提示"]]),
    advanced("rememberBoard", "任务顺序保存", [["true", "自动保留"], ["false", "本次体验"]]),
    advanced("preferenceStorage", "应用偏好保存", [["local", "长期记住"], ["session", "当前会话"]], "控制导出应用的外观偏好；工作台的标准配置始终自动保留。"),
  ] },
  { id: "details", label: "细节", preview: "details", library: "shadcn/ui · Radix · Motion · Sonner", fields: [
    ...[
      advanced("toggleVariant", "选项组样式", [["default", "浅底"], ["outline", "描边"]], "直接对应 shadcn ToggleGroup 的 default / outline 变体。"),
      advanced("tabsStyle", "页签样式", [["default", "分段"], ["line", "下划线"]], "直接对应 shadcn Tabs 的 default / line 变体。"),
    ].map((field) => ({ ...field, group: "控件状态" })),
    ...[
      advanced("buttonStyle", "主按钮样式", [["default", "实底"], ["secondary", "次要"], ["outline", "描边"]]),
      advanced("requiredIndicator", "必填标记", [["none", "不显示"], ["asterisk", "星号"], ["label", "文字"]]),
      advanced("validationMode", "校验时机", [["submit", "提交时"], ["blur", "离开输入框"], ["change", "输入时"]]),
    ].map((field) => ({ ...field, group: "按钮与表单" })),
    ...[
      advanced("copyStyle", "提示文案", [["concise", "简洁"], ["complete", "完整说明"]]),
      advanced("controlSize", "按钮尺寸", [["sm", "小号"], ["default", "标准"], ["lg", "大号"]], "对应 Button 和 ToggleGroup 原生 size；输入框保留自身默认尺寸。"),
    ].map((field) => ({ ...field, group: "排版与间距" })),
    ...[
      advanced("viewTransition", "内容切换", [["none", "直接切换"], ["fade", "轻淡入"]], "沿用已载入内容，切换时不重新加载页面。"),
      advanced("loadingStyle", "加载反馈", [["skeleton", "骨架占位"], ["inline", "行内状态"]]),
      advanced("errorPlacement", "表单错误", [["inline", "字段下方"], ["summary", "顶部汇总"]]),
      advanced("toastPosition", "消息位置", [["bottom-right", "右下"], ["top-right", "右上"], ["bottom-center", "底部居中"], ["top-center", "顶部居中"], ["top-left", "左上"], ["bottom-left", "左下"]]),
      advanced("toastDuration", "消息停留", [["short", "短暂"], ["standard", "标准"], ["long", "更久"]]),
      advanced("toastCloseButton", "消息关闭按钮", [["true", "显示"], ["false", "隐藏"]]),
    ].map((field) => ({ ...field, group: "切换与反馈" })),
    ...[
      advanced("emptyStyle", "空状态", [["plain", "简洁文字"], ["icon", "带图标"]]),
    ].map((field) => ({ ...field, group: "列表与空状态" })),
    ...[
      advanced("dialogDismiss", "点击遮罩", [["outside", "关闭弹窗"], ["explicit", "保持打开"]], "始终支持关闭按钮与 Esc。"),
      advanced("tooltipDelay", "提示出现", [["instant", "立即"], ["standard", "稍作停留"], ["relaxed", "停留更久"]]),
      advanced("tooltipSide", "提示方向", [["top", "上方"], ["right", "右侧"], ["bottom", "下方"], ["left", "左侧"]]),
    ].map((field) => ({ ...field, group: "弹窗与提示" })),
  ] },
];

export const detailOptionIds = [...optionSections.find((section) => section.id === "details")!.fields.map((field) => field.id)];

const commonFields = (...ids: string[]) => ids.map((id) => optionSections.flatMap((section) => section.fields).find((field) => field.id === id)!);
export const basicOptionGroups = [
  { id: "typography", label: "字体与排版", defaultOpen: true, fields: commonFields("font", "textSize", "density") },
  { id: "layout", label: "布局与外观", defaultOpen: true, fields: commonFields("radius", "navigation", "pagePadding") },
  { id: "motion", label: "动效", defaultOpen: true, fields: commonFields("motion", "motionStyle", "motionSpeed") },
];
export const basicOptions = basicOptionGroups.flatMap((group) => group.fields);
export const optionCount = optionSections.reduce((sum, section) => sum + section.fields.length, 0);

export function optionValue(theme: ThemeConfig, field: OptionDefinition): string {
  if (field.scope === "radius") return theme.styles.light.radius;
  const source = field.scope === "advanced" ? theme.advanced : theme;
  return String((source as unknown as Record<string, unknown>)[field.id]);
}

export function setOption(theme: ThemeConfig, field: OptionDefinition, value: string): ThemeConfig {
  if (!field.options.some((option) => option.id === value)) return theme;
  if (field.scope === "radius") return { ...theme, styles: { light: { ...theme.styles.light, radius: value }, dark: { ...theme.styles.dark, radius: value } } };
  if (field.id === "preset") return chooseStyle(theme, value);
  const parsed = value === "true" ? true : value === "false" ? false : value;
  return field.scope === "advanced"
    ? { ...theme, advanced: { ...theme.advanced, [field.id]: parsed } }
    : { ...theme, [field.id]: parsed };
}

