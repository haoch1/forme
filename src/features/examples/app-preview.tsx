import { PresetButton as Button } from "@/components/preset-controls";
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
    <div className={cn("example-shell", navigation === "top" && "top-navigation", embedded && "embedded-app")}>
      <aside className="example-sidebar">
        <div className="preview-app-name"><PanelsTopLeft className="size-4 shrink-0" /><span className="truncate">{name || "我的项目"}</span></div>
        <nav className="flex flex-col gap-1" aria-label="示例应用导航">
          {views.filter((v) => !embedded || v.id !== "settings").map(({ id, label, icon: Icon }) => (
            <Button variant={selected.id === id ? "secondary" : "ghost"} key={id} className="justify-start" aria-current={selected.id === id ? "page" : undefined} onClick={() => onViewChange(id)}>
              <Icon data-icon="inline-start" />{label}
            </Button>
          ))}
        </nav>
        <p className="mt-auto pt-8 text-xs leading-6 text-muted-foreground">演示内容保存在本机</p>
      </aside>
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
    </div>
  );
}
