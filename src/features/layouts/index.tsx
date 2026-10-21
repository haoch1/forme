import { PresetTabsList as TabsList, PresetTabsTrigger as TabsTrigger, PresetButton as Button } from "@/components/preset-controls";
import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PageIntro } from "@/components/common";
import { WorkspaceDemo } from "./workspace";
import { ProjectTable } from "@/features/examples/project-table";
import { ProfileForm } from "@/features/examples/project-form";

export default function LayoutsPage() {
  const [section, setSection] = useState("资料");
  return (
    <div className="page-content">
      <PageIntro
        title="布局模板"
        description="沿用成熟应用的内容结构。普通布局使用 Grid / Flex，可调分栏使用 react-resizable-panels。"
      />
      <Tabs defaultValue="workspace">
        <TabsList variant="line">
          <TabsTrigger value="workspace">三栏工作台</TabsTrigger>
          <TabsTrigger value="list">列表页面</TabsTrigger>
          <TabsTrigger value="settings">设置页面</TabsTrigger>
        </TabsList>
        <TabsContent value="workspace" className="pt-5">
          <WorkspaceDemo />
        </TabsContent>
        <TabsContent value="list" className="pt-5">
          <ProjectTable />
        </TabsContent>
        <TabsContent value="settings" className="pt-5">
          <div className="settings-layout">
            <nav aria-label="设置分类">
              {["资料", "说明"].map((item) => (
                <Button
                  key={item}
                  className="w-full justify-start"
                  variant={section === item ? "secondary" : "ghost"}
                  onClick={() => setSection(item)}
                >
                  {item}
                </Button>
              ))}
            </nav>
            <section className="max-w-xl">
              {section === "资料" ? (
                <ProfileForm />
              ) : (
                <div className="text-sm leading-7 text-muted-foreground">
                  设置页沿用 shadcn-admin
                  的分类导航与内容区结构。窄屏时上下排列，宽屏时左右分栏。
                </div>
              )}
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
