import { PresetCard as Card, PresetButton as Button, PresetCheckbox as Checkbox, PresetInput as Input, PresetFieldLabel as FieldLabel, PresetToggleGroup as ToggleGroup, PresetToggleGroupItem as ToggleGroupItem } from "@/components/preset-controls";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bell, Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card";

import { Slider } from "@/components/ui/slider";
import { Field, FieldSet, FieldLegend, FieldGroup } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

import { InterfaceEmpty } from "@/components/interface-empty";

const series = {
  week: [3, 5, 4, 8, 6, 9, 7].map((count, index) => ({ label: ["一", "二", "三", "四", "五", "六", "日"][index], count })),
  month: [12, 19, 16, 24].map((count, index) => ({ label: `第 ${index + 1} 周`, count })),
};

const activityConfig = { count: { label: "活动数量", color: "var(--primary)" } } satisfies ChartConfig;

export function ActivityCard() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  return <Card>
    <CardHeader><CardTitle>活动趋势</CardTitle><CardDescription>查看主题色在图表中的效果</CardDescription><CardAction>
      <ToggleGroup type="single" value={period} onValueChange={(v) => { if (v) setPeriod(v as typeof period); }} size="sm" variant="outline" aria-label="活动周期"><ToggleGroupItem value="week">本周</ToggleGroupItem><ToggleGroupItem value="month">本月</ToggleGroupItem></ToggleGroup>
    </CardAction></CardHeader>
    <CardContent>
      <ChartContainer config={activityConfig} className="h-52 w-full min-w-0 aspect-auto" aria-label={`${period === "week" ? "本周" : "本月"}活动图表`}>
        <AreaChart accessibilityLayer data={series[period]} margin={{ top: 16, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <YAxis width={28} axisLine={false} tickLine={false} allowDecimals={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={12} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area type="monotone" dataKey="count" stroke="var(--color-count)" fill="var(--color-count)" fillOpacity={0.08} strokeWidth={2} isAnimationActive={false} />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>;
}

export function ChecklistCard() {
  const [tasks, setTasks] = useState([{ id: 1, title: "整理本周计划", done: true }, { id: 2, title: "确认页面内容", done: false }, { id: 3, title: "检查手机显示", done: false }, { id: 4, title: "检查键盘焦点", done: false }, { id: 5, title: "确认暗色对比", done: false }]);
  const [draft, setDraft] = useState("");
  const done = tasks.filter((t) => t.done).length;
  return <Card><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle>今天的清单</CardTitle><Badge variant="secondary">{done} / {tasks.length}</Badge></div><CardDescription>勾选完成，或添加新任务</CardDescription></CardHeader><CardContent><FieldSet><FieldLegend className="sr-only">任务清单</FieldLegend><FieldGroup className="gap-4">{tasks.map((task) => <Field orientation="horizontal" key={task.id}><Checkbox id={`checklist-${task.id}`} checked={task.done} onCheckedChange={(value) => setTasks((items) => items.map((t) => t.id === task.id ? { ...t, done: !!value } : t))} /><FieldLabel htmlFor={`checklist-${task.id}`} className={task.done ? "text-muted-foreground line-through" : undefined}>{task.title}</FieldLabel></Field>)}</FieldGroup></FieldSet></CardContent><CardFooter><form className="flex w-full items-end gap-2" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setTasks((items) => [...items, { id: Date.now(), title: draft.trim(), done: false }]); setDraft(""); }}><Field><FieldLabel className="sr-only" htmlFor="checklist-new">新任务</FieldLabel><Input id="checklist-new" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={40} placeholder="添加一项任务…" /></Field><Button type="submit" size="icon" aria-label="添加清单任务" disabled={!draft.trim()}><Plus /></Button></form></CardFooter></Card>;
}

export function MessagesCard() {
  const [unread, setUnread] = useState(true);
  return <Card><CardHeader><div className="flex items-center justify-between gap-3"><CardTitle>消息收件箱</CardTitle><Badge variant="secondary">{unread ? "2 条未读" : "已读完"}</Badge></div><CardDescription>未读提醒与空状态</CardDescription></CardHeader><CardContent>{unread ? <div className="flex flex-col gap-5">{[["资料已更新", "你的个人资料已保存到本机。"], ["可以开始预览了", "试试不同配色与设备尺寸。"]].map(([title, description]) => <div key={title} className="flex gap-3"><Bell className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><div className="flex flex-col gap-1"><p className="text-sm font-medium">{title}</p><p className="text-xs leading-6 text-muted-foreground">{description}</p></div></div>)}<Button variant="outline" onClick={() => { setUnread(false); toast.success("消息已标为已读"); }}><Check data-icon="inline-start" />全部标为已读</Button></div> : <InterfaceEmpty title="没有新消息" description="所有消息都已处理完"><Button variant="outline" size="sm" onClick={() => setUnread(true)}>恢复消息示例</Button></InterfaceEmpty>}</CardContent></Card>;
}

export function TypographyCard() {
  return <Card><CardHeader><CardTitle>内容排版</CardTitle><CardDescription>标题、正文、引用与链接</CardDescription></CardHeader><CardContent className="gap-5"><div className="flex flex-col gap-2"><h2 className="text-2xl font-semibold tracking-tight">让内容清晰呈现</h2><p className="text-sm leading-7 text-muted-foreground">用合适的字号和留白，区分信息的轻重。中文与 English 123 都应自然、易读。</p></div><blockquote className="border-l-2 pl-4 text-sm leading-7 text-muted-foreground">好的界面，让人把注意力放在内容本身。</blockquote><a href="https://ui.shadcn.com/docs" target="_blank" rel="noreferrer" className="text-sm underline underline-offset-4">查看组件文档</a></CardContent></Card>;
}

export function SliderCard() {
  const [value,setValue] = useState([65]);
  const [range,setRange] = useState([25,75]);
  return <Card><CardHeader><CardTitle>数值调节</CardTitle><CardDescription>滑块、范围与键盘操作</CardDescription></CardHeader><CardContent className="gap-6"><Field><div className="flex items-center justify-between gap-3"><FieldLabel id="sample-scale-label">预览比例</FieldLabel><Badge variant="secondary">{value[0]}%</Badge></div><Slider aria-labelledby="sample-scale-label" value={value} onValueChange={setValue} step={5} /></Field><Field><div className="flex items-center justify-between gap-3"><FieldLabel id="sample-range-label">取值范围</FieldLabel><Badge variant="outline">{range[0]}–{range[1]}</Badge></div><Slider aria-labelledby="sample-range-label" value={range} onValueChange={setRange} step={5} minStepsBetweenThumbs={1} /></Field></CardContent></Card>;
}
