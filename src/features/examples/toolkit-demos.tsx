import { ConfiguredButton as Button } from "@/components/configured-components";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import { AnimatePresence, motion } from "motion/react";
import { useDefaultLayout, useGroupRef } from "react-resizable-panels";
import { Search, Plus, Settings, Home, Folder, Users, Bell, ArrowRight, Check, X, Download, Copy, Trash2, Calendar, Heart, Star, RotateCcw, type LucideIcon } from "lucide-react";

import { ActionButton } from "@/components/action-button";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { InterfaceEmpty } from "@/components/interface-empty";
import { copyText } from "@/lib/files";
import { defaultInterface, motionPreset, type InterfaceOptions } from "@/design-system/interface-options";
const icons: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "Search", label: "搜索", icon: Search }, { name: "Plus", label: "添加", icon: Plus },
  { name: "Settings", label: "设置", icon: Settings }, { name: "Home", label: "首页", icon: Home },
  { name: "Folder", label: "文件夹", icon: Folder }, { name: "Users", label: "用户", icon: Users },
  { name: "Bell", label: "通知", icon: Bell }, { name: "ArrowRight", label: "下一步", icon: ArrowRight },
  { name: "Check", label: "完成", icon: Check }, { name: "X", label: "关闭", icon: X },
  { name: "Download", label: "下载", icon: Download }, { name: "Copy", label: "复制", icon: Copy },
  { name: "Trash2", label: "删除", icon: Trash2 }, { name: "Calendar", label: "日历", icon: Calendar },
  { name: "Heart", label: "喜欢", icon: Heart }, { name: "Star", label: "收藏", icon: Star },
];
export function IconsDemo() {
  const [query, setQuery] = useState("");
  const filtered = icons.filter((i) => `${i.name} ${i.label}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="flex flex-col gap-5"><Field className="max-w-sm"><FieldLabel htmlFor="icon-query">找个图标</FieldLabel><Input id="icon-query" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索名称，如设置、收藏" /></Field><div className="practical-icon-grid">{filtered.map(({ name, label, icon: Icon }) => <Card key={name} size="sm" className="practical-icon-item"><CardContent className="items-center text-center"><div className="flex h-5 items-center justify-center"><Icon aria-hidden="true" /></div><span>{label}</span><code className="text-xs text-muted-foreground">{name}</code></CardContent><CardFooter><Button className="w-full" variant="outline" size="sm" aria-label={`复制${label}图标引用`} onClick={() => void copyText(`请使用 lucide-react 的 ${name} 图标表达“${label}”，沿用项目内统一的图标尺寸和线宽，不再安装其他图标库。`)}><Copy data-icon="inline-start" />复制</Button></CardFooter></Card>)}</div>{filtered.length === 0 && <InterfaceEmpty title="暂时没找到" description="试试搜索、设置这样的中文，或输入英文名称" />}</div>;
}

export function MotionDemo({ enabled, onToggle, options = defaultInterface }: { enabled: boolean; onToggle?: () => void; options?: InterfaceOptions }) {
  const [visible, setVisible] = useState(true);
  return <div className="flex flex-col gap-6"><div className="flex flex-wrap items-center gap-3"><Button variant="outline" onClick={() => setVisible(!visible)}>{visible ? "收起这条提示" : "显示这条提示"}</Button>{onToggle && <Button variant="ghost" onClick={onToggle}>{enabled ? "减少动效" : "开启动效"}</Button>}</div><div className="min-h-40"><AnimatePresence>{visible && <motion.div key="tip" {...motionPreset(options, enabled)}><Card><CardHeader><CardTitle>内容已整理好</CardTitle><CardDescription>用一点动效提示变化，阅读和操作仍然是重点。</CardDescription></CardHeader></Card></motion.div>}</AnimatePresence></div></div>;
}

export function PanelsDemo({ options = defaultInterface }: { options?: InterfaceOptions }) {
  const [note, setNote] = useState("今天的计划\n把页面调到自己喜欢的样子。");
  const group = useGroupRef();
  const ratio = options.panelRatio === "focus-left" ? { write: 65, read: 35 } : options.panelRatio === "focus-right" ? { write: 35, read: 65 } : { write: 50, read: 50 };
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ id: `style-simple-panels-v2-${options.panelDirection}-${options.panelRatio}`, panelIds: ["write", "read"] });
  return <div className="flex flex-col gap-4"><div className="flex justify-end"><ActionButton icon={RotateCcw} variant="outline" size="sm" onClick={() => group.current?.setLayout(ratio)}>恢复预设比例</ActionButton></div><div className="practical-panels"><ResizablePanelGroup groupRef={group} orientation={options.panelDirection} defaultLayout={options.rememberPanels ? defaultLayout ?? ratio : ratio} onLayoutChanged={options.rememberPanels ? onLayoutChanged : undefined}>
    <ResizablePanel id="write" defaultSize={`${ratio.write}%`} minSize="25%"><div className="p-4"><Field><FieldLabel htmlFor="panel-note">随手写几句</FieldLabel><Textarea id="panel-note" value={note} rows={7} onChange={(e) => setNote(e.target.value)} /></Field></div></ResizablePanel><ResizableHandle withHandle aria-label="调整分栏尺寸" /><ResizablePanel id="read" defaultSize={`${ratio.read}%`} minSize="25%"><div className="p-4 flex flex-col gap-4"><h3 className="text-sm font-medium">右边同步看到</h3><p className="whitespace-pre-wrap text-sm leading-7 break-words">{note || "左边写一点内容，这里就会出现。"}</p></div></ResizablePanel>
  </ResizablePanelGroup></div><p className="text-xs text-muted-foreground">{options.rememberPanels ? "分栏尺寸自动保留" : "每次打开恢复所选比例"}；随手写的内容只用于本次演示。</p></div>;
}

type DemoPreferences = { tips: boolean; setTips: (tips: boolean) => void };
export function PreferenceDemo({ options = defaultInterface }: { options?: InterfaceOptions }) {
  const [store] = useState(() => createStore<DemoPreferences>()(persist(
    (set) => ({ tips: true, setTips: (tips) => set({ tips }) }),
    { name: "style-preference-demo-v1", storage: createJSONStorage(() => options.preferenceStorage === "session" ? sessionStorage : localStorage) },
  )));
  const tips = useStore(store, (s) => s.tips);
  const setTips = useStore(store, (s) => s.setTips);
  return <Card><CardHeader><CardTitle>偏好设置会被记住</CardTitle><CardDescription>切换设置，再刷新预览验证保存结果。由 Zustand 管理。</CardDescription></CardHeader><CardContent className="flex flex-col gap-5"><Field orientation="horizontal"><FieldContent><FieldLabel htmlFor="demo-tips">显示操作提示</FieldLabel><FieldDescription>多个组件读取同一份状态</FieldDescription></FieldContent><Switch id="demo-tips" checked={tips} onCheckedChange={setTips} /></Field><p className="text-sm">当前状态：{tips ? "显示提示" : "隐藏提示"}</p><p className="text-xs leading-6 text-muted-foreground">{options.preferenceStorage === "session" ? "当前会话：刷新仍保留，关闭这个浏览器标签页后结束。" : "长期记住：下次打开仍可读取这台设备的设置。"}</p></CardContent></Card>;
}
