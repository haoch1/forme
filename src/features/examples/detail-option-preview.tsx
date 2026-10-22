import { Spinner } from "@/components/ui/spinner";
import { ConfiguredButton as Button, ConfiguredDialogContent as DialogContent, ConfiguredTabsList as TabsList, ConfiguredToggleGroup as ToggleGroup, ConfiguredTooltipContent as TooltipContent } from "@/components/configured-components";
import { Card } from "@/components/ui/card";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "motion/react";
import { Check, Info, RotateCcw, X } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { toast } from "sonner";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { InterfaceEmpty } from "@/components/interface-empty";

import { Skeleton } from "@/components/ui/skeleton";

import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { DetailCopy, RequiredMark, useInterfaceOptions } from "@/design-system/interface-context";
import { optionSections } from "@/design-system/option-catalog";
import { tooltipDelays, toastDurations, validationModes } from "@/design-system/interface-options";

const emailSchema = z.object({ email: z.email("请输入有效的邮箱地址") });

function ValidationExample({ automatic = true }: { automatic?: boolean }) {
  const options = useInterfaceOptions();
  const { register, trigger, handleSubmit, formState: { errors } } = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema), defaultValues: { email: automatic ? "hello@" : "hello@example.com" }, mode: validationModes[options.validationMode], reValidateMode: validationModes[options.validationMode] });
  useEffect(() => { if (automatic) void trigger(); }, [trigger, automatic]);
  return <form noValidate onSubmit={handleSubmit(() => toast.success("邮箱格式正确"))} className="flex flex-col gap-4">
    {options.errorPlacement === "summary" && errors.email && <Alert variant="destructive"><AlertTitle>请检查以下内容</AlertTitle><AlertDescription>{errors.email.message}</AlertDescription></Alert>}
    <Field data-invalid={!!errors.email}><FieldLabel htmlFor="live-example-email">示例邮箱<RequiredMark /></FieldLabel><Input id="live-example-email" aria-required="true" aria-invalid={!!errors.email} {...register("email")} />{!automatic && <FieldDescription>{({ submit: "填写无效邮箱，提交时显示错误", blur: "填写无效邮箱，离开输入框时显示错误", change: "输入无效邮箱时立即显示错误" })[options.validationMode]}</FieldDescription>}{options.errorPlacement === "inline" && <FieldError>{errors.email?.message}</FieldError>}</Field>
    <div><Button variant="outline" type="submit">验证邮箱</Button></div>
  </form>;
}

function TooltipExample() {
  const options = useInterfaceOptions();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), tooltipDelays[options.tooltipDelay]);
    return () => window.clearTimeout(timer);
  }, [options.tooltipDelay]);
  return <div className="flex flex-wrap items-center justify-center gap-4 py-12"><Tooltip open={open} onOpenChange={setOpen}><TooltipTrigger asChild><Button variant="outline"><Info data-icon="inline-start" />提示示例</Button></TooltipTrigger><TooltipContent sideOffset={8}>按所选的停留时间和方向出现</TooltipContent></Tooltip><span className="text-xs text-muted-foreground">点“重播示例”再次查看</span></div>;
}

function DialogExample() {
  const options = useInterfaceOptions();
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}>
    <div className="option-dialog-stage"><div className="option-dialog-shade" /><Card className="option-dialog-model"><CardHeader><CardTitle>通知偏好</CardTitle><CardDescription>{options.dialogDismiss === "explicit" ? "点击遮罩保持打开，按钮或 Esc 关闭" : "点击遮罩、关闭按钮或按 Esc 关闭"}</CardDescription></CardHeader><CardContent><DialogTrigger asChild><Button variant="outline">打开实际弹窗</Button></DialogTrigger></CardContent></Card></div>
    <DialogContent><DialogHeader><DialogTitle>通知偏好示例</DialogTitle><DialogDescription>实际宽度受当前设备视口限制</DialogDescription></DialogHeader><Field><FieldLabel htmlFor="live-dialog-note">备注</FieldLabel><Input id="live-dialog-note" placeholder="输入一条备注" /></Field><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>关闭</Button><Button onClick={() => { setOpen(false); toast.success("偏好已保存"); }}>保存偏好</Button></DialogFooter></DialogContent>
  </Dialog>;
}

function ToastExample() {
  const options = useInterfaceOptions();
  const [visible, setVisible] = useState(true);
  return <div className="flex flex-col gap-4"><div className="option-toast-stage" data-position={options.toastPosition}>{visible && <Alert><Check /><AlertTitle>设置已保存</AlertTitle><AlertDescription>消息将出现在这个位置</AlertDescription>{options.toastCloseButton && <AlertAction><Button variant="ghost" size="icon-xs" aria-label="关闭消息示意" onClick={() => setVisible(false)}><X /></Button></AlertAction>}</Alert>}</div><div className="flex flex-wrap items-center gap-3"><Button variant="outline" onClick={() => { setVisible(true); toast.success("设置已保存", { description: "消息使用所选的位置与停留时间" }); }}>显示实际消息</Button><span className="text-xs text-muted-foreground">停留 {toastDurations[options.toastDuration] / 1000} 秒</span></div></div>;
}

function OptionScene({ id }: { id: string }) {
  const options = useInterfaceOptions();
  const [priority, setPriority] = useState("normal");
  if (id === "toggleVariant") return <Field><FieldLabel id="live-priority">优先级</FieldLabel><ToggleGroup type="single" value={priority} onValueChange={(value) => { if (value) setPriority(value); }} aria-labelledby="live-priority"><ToggleGroupItem value="low">低</ToggleGroupItem><ToggleGroupItem value="normal">普通</ToggleGroupItem><ToggleGroupItem value="high">高</ToggleGroupItem></ToggleGroup><FieldDescription>用于一组相关选项；操作按钮、复选框、开关和下拉框各用自身样式</FieldDescription></Field>;
  if (id === "tabsStyle") return <Tabs defaultValue="overview"><TabsList aria-label="标签样式示例"><TabsTrigger value="overview">概览</TabsTrigger><TabsTrigger value="activity">活动</TabsTrigger><TabsTrigger value="settings">设置</TabsTrigger></TabsList><TabsContent value="overview" className="pt-4">本周概览</TabsContent><TabsContent value="activity" className="pt-4">最近活动</TabsContent><TabsContent value="settings" className="pt-4">通知设置</TabsContent></Tabs>;
  if (id === "buttonStyle") return <div className="flex flex-wrap gap-3"><Button onClick={() => toast.success("操作已完成")}>主按钮示例</Button><Button variant="outline" onClick={() => toast("这是次要操作")}>次要操作</Button></div>;
  if (id === "requiredIndicator") return <Field><FieldLabel htmlFor="live-required">联系邮箱<RequiredMark /></FieldLabel><Input id="live-required" aria-required="true" defaultValue="hello@example.com" /></Field>;
  if (id === "validationMode") return <ValidationExample automatic={false} />;
  if (id === "emptyStyle") return <InterfaceEmpty title="没有待处理内容" description="新内容会显示在这里" />;
  if (id === "copyStyle") return <Field><FieldLabel htmlFor="live-copy">名称</FieldLabel><Input id="live-copy" defaultValue="小林" /><FieldDescription><DetailCopy short="让同伴知道怎么称呼你" full="填写你的名字或昵称，保存后会保留在当前浏览器中。" /></FieldDescription></Field>;
  if (id === "controlSize") return <FieldGroup><Field><FieldLabel htmlFor="live-height">输入框</FieldLabel><Input id="live-height" placeholder="输入内容" /></Field><div><Button variant="outline" onClick={() => toast.success("操作已完成")}>操作按钮</Button></div></FieldGroup>;
  if (id === "viewTransition") return <motion.div initial={options.viewTransition === "fade" ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.12 }} className="flex flex-col gap-2"><p className="text-sm">本周概览</p><p className="text-sm text-muted-foreground">3 项任务已完成，2 项正在进行</p></motion.div>;
  if (id === "loadingStyle") return <div className="flex flex-col gap-4"><p className="text-xs text-muted-foreground">等待状态示例，实际页面切换无需等待</p>{options.loadingStyle === "skeleton" ? <div className="flex flex-col gap-3" aria-label="即时骨架示例"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></div> : <div role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Spinner  />正在获取示例内容</div>}</div>;
  if (id === "errorPlacement") return <ValidationExample />;
  if (["toastPosition", "toastDuration", "toastCloseButton"].includes(id)) return <ToastExample />;
  if (id === "dialogDismiss") return <DialogExample />;
  if (id === "tooltipDelay" || id === "tooltipSide") return <TooltipExample />;
  return null;
}

export function DetailOptionPreview({ id }: { id: string }) {
  const options = useInterfaceOptions();
  const [iteration, setIteration] = useState(0);
  const field = optionSections.flatMap((section) => section.fields).find((item) => item.id === id);
  if (!field) return null;
  const value = options[id as keyof typeof options];
  return <Card className="option-live-preview" data-option={id}>
    <CardHeader><CardTitle>{field.label}<Badge variant="secondary" className="ml-3">{field.options.find((item) => item.id === String(value))?.label}</Badge></CardTitle><CardDescription>已应用到下方示例与导出项目</CardDescription><CardAction><ActionButton icon={RotateCcw} variant="outline" size="sm" onClick={() => setIteration((previous) => previous + 1)}>重播示例</ActionButton></CardAction></CardHeader>
    <CardContent><div className="option-live-scene" data-wide={id === "dialogDismiss"} key={iteration}><OptionScene id={id} /></div></CardContent>
  </Card>;
}
