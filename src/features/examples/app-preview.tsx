import type { CSSProperties } from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { Folder, LayoutDashboard, User, Settings, PanelsTopLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { defaultInterface, type InterfaceOptions } from "@/design-system/interface-options";

import { ProjectTable } from "./project-table";
import { ProfileForm } from "./project-form";
import { Preferences } from "./cards";
import { BoardDemo as Board } from "@/features/interactions/board";
const views = [
  { id: "projects", label: "项目列表", description: "把事情整理清楚，找到你要的项目。", icon: Folder },
  { id: "board", label: "任务看板", description: "按住任务左侧的手柄，拖到另一个阶段。", icon: LayoutDashboard },
  { id: "profile", label: "个人资料", description: "填写和保存你的基本信息。", icon: User },
  { id: "settings", label: "通知设置", description: "选择你希望接收的消息。", icon: Settings },
];

export function ApplicationPreview({ name = "应用示例", navigation, view, onViewChange, filter = "", onFilterChange, embedded = false, options = defaultInterface }: {
  name?: string;
  navigation: "sidebar" | "top";
  view: string;
  onViewChange: (id: string) => void;
  filter?: string;
  onFilterChange?: (q: string) => void;
  embedded?: boolean;
  options?: InterfaceOptions;
}) {
  const selected = views.find((v) => v.id === view) ?? views[0];
  return (
    <SidebarProvider className={cn("example-shell min-h-0", navigation === "top" && "top-navigation", embedded && "embedded-app")} style={{ "--sidebar-width": "var(--ui-sidebar-width,216px)" } as CSSProperties}>
      <Sidebar collapsible="none" className="example-sidebar">
        <SidebarHeader className="preview-app-name"><PanelsTopLeft className="size-4 shrink-0" /><span className="truncate">{name || "我的项目"}</span></SidebarHeader>
        <SidebarContent><nav aria-label="示例应用导航"><SidebarMenu>
          {views.filter((v) => !embedded || v.id !== "settings").map(({ id, label, icon: Icon }) => (
            <SidebarMenuItem key={id}><SidebarMenuButton isActive={selected.id === id} aria-current={selected.id === id ? "page" : undefined} onClick={() => onViewChange(id)}>
              <Icon data-icon="inline-start" />{label}
            </SidebarMenuButton></SidebarMenuItem>
          ))}
        </SidebarMenu></nav></SidebarContent>
        <SidebarFooter><p className="text-xs leading-6 text-muted-foreground">演示内容保存在本机</p></SidebarFooter>
      </Sidebar>
      <div className="example-main">
        <div className="example-content">
        <div className="mb-6 flex flex-col gap-1.5">
          <h2 className="text-xl font-semibold tracking-tight">{selected.label}</h2>
          <p className="text-sm text-muted-foreground">{selected.description}</p>
        </div>
          {selected.id === "projects" ? <ProjectTable compact={embedded} initialFilter={filter} onFilterChange={onFilterChange} />
            : selected.id === "board" ? <Board key={String(options.rememberBoard)} options={options} />
              : <div className="max-w-xl">{selected.id === "profile" ? <ProfileForm /> : <Preferences />}</div>}
        </div>
      </div>
    </SidebarProvider>
  );
}
