import { ConfiguredButton as Button } from "@/components/configured-components";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
// Adapted from tweakcn CardsCookieSettings, CardsReportIssue and CardsTeamMembers.
import { memo, useState } from "react";
import { toast } from "sonner";
import { Bell, Copy, RefreshCw, Plus, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/action-button";

import { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Field, FieldContent, FieldDescription } from "@/components/ui/field";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Choice } from "@/components/common";
import { ProfileForm } from "./project-form";
import { readLocal, saveLocal } from "@/lib/files";
import { InterfaceDetailsDemo } from "./details-demo";
import { DetailCopy } from "@/design-system/interface-context";
import { ActivityCard, ChecklistCard, MessagesCard, SliderCard, TypographyCard } from "./more-cards";
import { ProjectTable } from "./project-table";
export function Preferences() {
  const [value, setValue] = useState(() =>
    readLocal("style-preferences-v1", {
      email: true,
      desktop: false,
      weekly: true,
    }),
  );
  return (
    <FieldGroup>
      {[
        {
          key: "email",
          title: "邮件通知",
          description: "项目更新和重要操作提醒。",
        },
        {
          key: "desktop",
          title: "桌面通知",
          description: "仅保存偏好，不申请系统通知权限。",
        },
        {
          key: "weekly",
          title: "每周摘要",
          description: "汇总本周的项目和团队动态。",
        },
      ].map((item) => (
        <Field key={item.key} orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor={`pref-${item.key}`}>{item.title}</FieldLabel>
            <FieldDescription id={`pref-${item.key}-description`}>{item.description}</FieldDescription>
          </FieldContent>
          <Switch
            id={`pref-${item.key}`}
            aria-describedby={`pref-${item.key}-description`}
            checked={value[item.key as keyof typeof value]}
            onCheckedChange={(checked) =>
              setValue({ ...value, [item.key]: checked })
            }
          />
        </Field>
      ))}
      <Button
        variant="outline"
        onClick={() => {
          saveLocal("style-preferences-v1", value);
          toast.success("通知偏好已保存");
        }}
      >
        保存偏好
      </Button>
    </FieldGroup>
  );
}
export const ComponentCards = memo(function ComponentCards() {
  const [roles, setRoles] = useState(() =>
    readLocal<Record<string, string>>("style-roles-v1", {
      林晓: "owner",
      陈一: "developer",
      周宁: "viewer",
    }),
  );
  const [loading, setLoading] = useState(false);
  return (
    <div className="cards-demo">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>个人资料</CardTitle>
            <CardDescription><DetailCopy short="表单校验与保存" full="填写基本信息并保存，检查输入校验、错误提示与成功状态。" /></CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>通知偏好</CardTitle>
            <CardDescription><DetailCopy short="通知开关与本地保存" full="选择需要的通知方式，保存后刷新仍可保留设置。" /></CardDescription>
          </CardHeader>
          <CardContent>
            <Preferences />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        <ActivityCard />
        <Card>
          <CardHeader>
            <CardTitle>团队成员</CardTitle>
            <CardDescription>头像与成员角色</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {Object.entries(roles).map(([name, role]) => (
              <div
                key={name}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      {role === "owner" ? "项目负责人" : "团队成员"}
                    </p>
                  </div>
                </div>
                <div className="w-28">
                  <Choice
                    label={`${name}的角色`}
                    value={role}
                    onChange={(v) => {
                      const next = { ...roles, [name]: v };
                      setRoles(next);
                      saveLocal("style-roles-v1", next);
                      toast.success("角色已更新");
                    }}
                    options={[
                      { value: "owner", label: "负责人" },
                      { value: "developer", label: "开发者" },
                      { value: "viewer", label: "查看者" },
                    ]}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>操作与反馈</CardTitle>
            <CardDescription>按钮与交互状态</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => toast.success("操作已完成")}>
                <Plus data-icon="inline-start" />
                主要操作
              </Button>
              <Button variant="outline" onClick={() => toast("这是次要操作")}>
                次要操作
              </Button>
              <Button variant="secondary" onClick={() => toast("辅助操作")}>
                辅助操作
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button disabled>禁用状态</Button>
              <ActionButton
                icon={RefreshCw}
                variant="outline"
                pending={loading}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    toast.success("异步示例已完成");
                  }, 850);
                }}
              >
                {loading ? "处理中…" : "加载示例"}
              </ActionButton>
              <Button
                variant="destructive"
                onClick={() => toast.error("这是危险操作的反馈示例")}
              >
                <Trash2 data-icon="inline-start" />
                危险操作
              </Button>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Badge>默认</Badge>
              <Badge variant="secondary">次要</Badge>
              <Badge variant="outline">描边</Badge>
              <Badge variant="destructive">错误</Badge>
            </div>
            <Alert>
              <Bell />
              <AlertTitle>保持统一的交互反馈</AlertTitle>
              <AlertDescription>
                当前预览直接使用项目内的 shadcn/ui 组件。
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                void navigator.clipboard
                  .writeText('')
                  .then(() => toast.success("导入代码已复制"))
                  .catch(() => toast.error("复制失败，可下载模板获取源码"));
              }}
            >
              <Copy data-icon="inline-start" />
              复制组件导入
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="cards-extra flex flex-col gap-4"><ChecklistCard /><MessagesCard /><SliderCard /><TypographyCard /></div>
      <Card className="cards-table"><CardHeader><CardTitle>数据与操作</CardTitle><CardDescription>搜索、筛选、排序、分页与详情。数据仅用于演示。</CardDescription></CardHeader><CardContent><ProjectTable compact /></CardContent></Card>
      <div className="cards-details"><InterfaceDetailsDemo /></div>
    </div>
  );
});
