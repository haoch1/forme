import { Spinner } from "@/components/ui/spinner";
import { PresetButton as Button, PresetCard as Card, PresetFieldGroup as FieldGroup, PresetFieldLabel as FieldLabel, PresetInput as Input, PresetSeparator as Separator, PresetToggleGroup as ToggleGroup, PresetToggleGroupItem as ToggleGroupItem, PresetTabsList as TabsList, PresetTabsTrigger as TabsTrigger, PresetDialogContent as DialogContent, PresetTooltipContent as TooltipContent } from "@/components/preset-controls";
import { useState } from "react";
import { motion } from "motion/react";
import { Check, Info } from "lucide-react";
import { toast } from "sonner";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription } from "@/components/ui/field";

import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { DetailCopy, useInterfaceOptions } from "@/design-system/interface-context";
import { ProfileForm } from "./project-form";
import { TableDetailPreview } from "./table-detail-preview";
import { InterfaceEmpty } from "@/components/interface-empty";

export function InterfaceDetailsDemo() {
  const options = useInterfaceOptions();
  const [priority, setPriority] = useState("normal");
  const [showDialog, setShowDialog] = useState(false);
  const [pending, setPending] = useState(false);
  const [tab, setTab] = useState("overview");
  return <div className="details-grid">
    <Card>
      <CardHeader><CardTitle>控件与状态</CardTitle><CardDescription><DetailCopy short="选中、悬停、焦点与禁用" full="切换选项、悬停按钮或使用 Tab 键，检查不同操作状态。" /></CardDescription></CardHeader>
      <CardContent>
        <FieldGroup>
          <Field><FieldLabel id="detail-priority">优先级</FieldLabel><ToggleGroup type="single" variant="outline" value={priority} onValueChange={(value) => { if (value) setPriority(value); }} aria-labelledby="detail-priority"><ToggleGroupItem value="low">低</ToggleGroupItem><ToggleGroupItem value="normal">普通</ToggleGroupItem><ToggleGroupItem value="high">高</ToggleGroupItem></ToggleGroup></Field>
          <Field><FieldLabel htmlFor="detail-note">备注</FieldLabel><Input id="detail-note" placeholder="点击输入，或使用 Tab 键聚焦" /><FieldDescription><DetailCopy short="鼠标点击与键盘聚焦分别反馈" full="鼠标操作保持轻量反馈；使用键盘导航时显示所选的焦点边框。" /></FieldDescription></Field>
          <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => toast.success("操作已完成")}>悬停与点击</Button><Button disabled>禁用按钮</Button></div>
          <Separator />
          <div className="flex flex-wrap gap-2"><Badge><Check data-icon="inline-start" />已完成</Badge><Badge variant="secondary">进行中</Badge><Badge variant="outline">待处理</Badge><Badge variant="destructive">需处理</Badge></div>
        </FieldGroup>
      </CardContent>
    </Card>
    <Card>
      <CardHeader><CardTitle>表单与校验</CardTitle><CardDescription><DetailCopy short="字段错误、错误汇总与保存反馈" full="尝试提交无效邮箱，查看字段下方提示或表单顶部的错误汇总。" /></CardDescription></CardHeader>
      <CardContent><ProfileForm idPrefix="detail-profile" /></CardContent>
    </Card>
    <Card><Dialog open={showDialog} onOpenChange={setShowDialog}>
      <CardHeader><CardTitle>弹窗与消息</CardTitle><CardDescription><DetailCopy short="宽度、遮罩、提示与消息位置" full="打开弹窗或显示消息，检查不同容器宽度、遮罩强度和消息出现位置。" /></CardDescription></CardHeader>
      <CardContent><FieldGroup>
        <div className="flex flex-wrap gap-2"><DialogTrigger asChild><Button variant="outline">打开示例弹窗</Button></DialogTrigger><Button variant="outline" onClick={() => toast.success("设置已保存", { description: "这条消息使用所选的位置" })}>显示示例消息</Button></div>
        <div className="flex items-center gap-2 text-sm"><span>停留在图标上查看提示</span><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="查看提示示例"><Info /></Button></TooltipTrigger><TooltipContent>提示遵循所选的出现延迟</TooltipContent></Tooltip></div>
        <Separator />
        <p className="text-sm leading-7 text-muted-foreground"><DetailCopy short="弹窗支持 Esc 关闭，焦点返回触发按钮" full="按 Esc 或点击关闭按钮收起弹窗。关闭后焦点会回到原来的触发按钮，键盘操作可以继续。" /></p>
      </FieldGroup></CardContent>
      <DialogContent><DialogHeader><DialogTitle>通知偏好</DialogTitle><DialogDescription>弹窗采用所选的宽度和遮罩，窄屏始终适应可用空间。</DialogDescription></DialogHeader><Field><FieldLabel htmlFor="dialog-note">说明</FieldLabel><Input id="dialog-note" placeholder="输入一条备注" /></Field><DialogFooter><Button variant="outline" onClick={() => setShowDialog(false)}>关闭</Button><Button onClick={() => { setShowDialog(false); toast.success("偏好已保存"); }}>保存偏好</Button></DialogFooter></DialogContent></Dialog>
    </Card>
    <Card>
      <CardHeader><CardTitle>切换与加载反馈</CardTitle><CardDescription><DetailCopy short="内容切换与真实的反馈组件" full="切换内容检查直接切换或淡入效果；加载状态可手动展开，便于比较骨架与行内反馈。" /></CardDescription></CardHeader>
      <CardContent><FieldGroup>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList aria-label="内容切换示例"><TabsTrigger value="overview">概览</TabsTrigger><TabsTrigger value="activity">活动</TabsTrigger></TabsList>
          {(["overview", "activity"] as const).map((value) => <TabsContent key={value} value={value} className="detail-tab-content"><motion.div initial={options.viewTransition === "fade" ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.12 }}><p className="text-sm font-medium">{value === "overview" ? "本周概览" : "最近活动"}</p><p className="text-sm leading-7 text-muted-foreground">{value === "overview" ? "3 项任务已完成，2 项正在进行" : "成员刚刚更新了项目资料"}</p></motion.div></TabsContent>)}
        </Tabs>
        <Separator />
        <div><Button variant="outline" onClick={() => setPending((value) => !value)}>{pending ? "收起加载状态" : "查看加载状态"}</Button></div>
        <div className="detail-loading-sample" aria-live="polite">{pending ? options.loadingStyle === "skeleton" ? <div className="flex flex-col gap-3" aria-label="骨架占位示例"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></div> : <div role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner  />正在获取内容</div> : <div className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="size-4" />内容已就绪</div>}</div>
      </FieldGroup></CardContent>
    </Card>
    <Card className="detail-list-card"><CardHeader><CardTitle>列表与空状态</CardTitle><CardDescription>悬停、选中、分隔线与空内容</CardDescription></CardHeader><CardContent><TableDetailPreview /><Separator /><InterfaceEmpty title="没有待处理内容" description="新内容会显示在这里" /></CardContent></Card>
  </div>;
}
