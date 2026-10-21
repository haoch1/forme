import { PresetButton as Button, PresetInput as Input } from "@/components/preset-controls";
import { useState } from "react";
import {
  useDefaultLayout,
  useGroupRef,
  usePanelRef,
} from "react-resizable-panels";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

import {
  File,
  Folder,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Search,
  Settings,
} from "lucide-react";

const files = [
  "app.tsx",
  "theme.css",
  "components.json",
  "AGENTS.md",
  "package.json",
];
const content: Record<string, string> = {
  "app.tsx":
    '\n\nexport function App() {\n  return (\n    <main className="p-6">\n      <h1>我的项目</h1>\n      <Button>开始使用</Button>\n    </main>\n  )\n}',
  "theme.css":
    ":root {\n  --background: oklch(1 0 0);\n  --primary: oklch(0.205 0 0);\n  --radius: 0.625rem;\n}",
  "components.json":
    '{\n  "style": "radix-vega",\n  "iconLibrary": "lucide"\n}',
  "AGENTS.md":
    "# 开发规则\n\n复用 shadcn/ui 组件。\n通过语义变量设置颜色。\n优先组合成熟库。",
  "package.json":
    '{\n  "name": "my-project",\n  "private": true,\n  "type": "module"\n}',
};
export function WorkspaceDemo() {
  const group = useGroupRef();
  const nav = usePanelRef();
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(files[0]);
  const [q, setQ] = useState("");
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "style-workspace-v1",
    panelIds: ["files", "editor", "inspector"],
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          分隔线支持拖动与方向键。尺寸自动保存，刷新后恢复。
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (collapsed) nav.current?.expand();
              else nav.current?.collapse();
              setCollapsed(!collapsed);
            }}
          >
            {collapsed ? (
              <PanelLeftOpen data-icon="inline-start" />
            ) : (
              <PanelLeftClose data-icon="inline-start" />
            )}
            文件栏
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              group.current?.setLayout({
                files: 22,
                editor: 53,
                inspector: 25,
              });
              setCollapsed(false);
            }}
          >
            <RotateCcw data-icon="inline-start" />
            恢复布局
          </Button>
        </div>
      </div>
      <div className="workspace-demo">
        <ResizablePanelGroup
          groupRef={group}
          orientation="horizontal"
          defaultLayout={defaultLayout}
          onLayoutChanged={onLayoutChanged}
        >
          <ResizablePanel
            id="files"
            panelRef={nav}
            defaultSize="22%"
            minSize="12%"
            collapsible
            collapsedSize="0%"
          >
            <div className="panel-heading">
              <Folder className="size-4" />
              项目文件
            </div>
            <div className="flex flex-col gap-3 p-3">
              <Input
                aria-label="筛选文件"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="筛选文件…"
              />
              {files
                .filter((f) => f.includes(q))
                .map((file) => (
                  <Button
                    key={file}
                    variant={active === file ? "secondary" : "ghost"}
                    className="justify-start"
                    size="sm"
                    onClick={() => setActive(file)}
                  >
                    <File data-icon="inline-start" />
                    {file}
                  </Button>
                ))}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="editor" defaultSize="53%" minSize="25%">
            <div className="panel-heading">
              <File className="size-4" />
              {active}
              <span className="ml-auto text-xs text-muted-foreground">
                只读示例
              </span>
            </div>
            <pre className="code-block border-0">{content[active]}</pre>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel id="inspector" defaultSize="25%" minSize="15%">
            <div className="panel-heading">
              <Settings className="size-4" />
              属性
            </div>
            <dl className="flex flex-col gap-5 p-5 text-xs">
              <div>
                <dt className="text-muted-foreground">当前文件</dt>
                <dd className="mt-1 font-mono">{active}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">布局引擎</dt>
                <dd className="mt-1">react-resizable-panels</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">持久化</dt>
                <dd className="mt-1">localStorage</dd>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Search className="size-3.5" />
                左侧支持筛选与切换文件。
              </div>
            </dl>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
