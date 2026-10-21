import { PresetButton as Button, PresetTableBody as TableBody, PresetTableCell as TableCell, PresetTableHead as TableHead, PresetTableHeader as TableHeader, PresetTableRow as TableRow, PresetDialogContent as DialogContent, PresetTabsList as TabsList, PresetTabsTrigger as TabsTrigger } from "@/components/preset-controls";
import { useState } from "react";
import { ExternalLink, Download, ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Table } from "@/components/ui/table";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useTextDownload } from "@/lib/files";
import stack from "@/design-system/stack.json";
import rules from "@/design-system/generation-rules.md?raw";

const coreStack = [
  ["UI 组件", "shadcn/ui"], ["图标", "Lucide"], ["动画", "Motion"],
  ["可调分栏", "react-resizable-panels"], ["拖拽", "dnd-kit"], ["客户端状态", "Zustand"],
];

export function SourcesDialog({ open, onOpenChange, returnFocus }: { open: boolean; onOpenChange: (open: boolean) => void; returnFocus?: () => void }) {
  const [tab, setTab] = useState("stack");
  const rulesUrl = useTextDownload(rules);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent onCloseAutoFocus={(event) => { if (returnFocus) { event.preventDefault(); returnFocus(); } }} className="bounded-dialog sm:max-w-4xl"><DialogHeader className="shrink-0 pr-8"><DialogTitle>固定技术栈与开发规则</DialogTitle><DialogDescription>每类职责只用一套成熟库，源码和精确版本随模板一起提供。</DialogDescription></DialogHeader>
    <Tabs value={tab} onValueChange={setTab} className="resources-tabs"><TabsList className="shrink-0"><TabsTrigger value="stack">技术栈</TabsTrigger><TabsTrigger value="rules">AI 规则</TabsTrigger><TabsTrigger value="sources">参考来源</TabsTrigger></TabsList>
      <TabsContent value="stack"><div className="resources-scroll py-3">
        <div className="stack-core">{coreStack.map(([role, name]) => <div className="stack-core-row" key={role}><span className="text-muted-foreground">{role}</span><span className="font-medium">{name}</span></div>)}</div>
        <p className="my-5 text-xs leading-6 text-muted-foreground">基础框架：React · TypeScript · Vite · Tailwind CSS。每类能力固定一个方案，所有配色共用同一技术栈。</p>
        <Collapsible className="stack-dependencies"><CollapsibleTrigger asChild><Button variant="ghost" className="stack-expand-trigger"><span className="flex flex-wrap items-center gap-3">完整依赖与版本<Badge variant="secondary">{stack.length} 项</Badge></span><ChevronDown aria-hidden="true" /></Button></CollapsibleTrigger>
          <CollapsibleContent className="stack-dependency-content"><Table><TableHeader><TableRow><TableHead>用途</TableHead><TableHead>依赖</TableHead><TableHead>版本</TableHead></TableRow></TableHeader><TableBody>{stack.map((row) => <TableRow key={row.name}><TableCell>{row.role}</TableCell><TableCell><code>{row.name}</code></TableCell><TableCell><code>{row.version}</code></TableCell></TableRow>)}</TableBody></Table></CollapsibleContent>
        </Collapsible>
      </div></TabsContent>
      <TabsContent value="rules"><pre className="brief-preview mt-4">{rules}</pre></TabsContent>
      <TabsContent value="sources"><div className="resources-scroll flex flex-col gap-5 py-5 text-sm leading-7">{[
        ["shadcn/ui", "https://ui.shadcn.com/docs", "使用官方 Radix 组件源码，MIT。沿用统一的组件语言。"],
        ["shadcn Create", "https://ui.shadcn.com/create", "参数侧栏、预览工具与组件示例组织参考，保留原生组件与实际交互。"],
        ["Tailwind CSS", "https://tailwindcss.com/docs/colors", "新增十二套色系使用官方色阶，浅暗主题共用语义映射，MIT。"],
        ["Radix Colors", "https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale", "经典黑白的暗色使用官方 Gray 色阶，分别映射底色、控件、边框与文字，MIT。"],
        ["tweakcn", "https://github.com/jnsahaj/tweakcn", "主题预设与编辑器组织参考，Apache-2.0。预设、来源提交与许可证随模板保留。"],
        ["shadcn-admin", "https://github.com/satnaing/shadcn-admin", "应用导航、表格和表单结构参考，MIT。"],
        ["Lucide", "https://lucide.dev", "全部通用图标使用 Lucide，保留 ISC 许可证。"],
      ].map(([name, url, description]) => <section key={name}><a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-medium underline underline-offset-4">{name}<ExternalLink className="size-3.5" /></a><p className="text-muted-foreground">{description}</p></section>)}</div></TabsContent>
    </Tabs><DialogFooter className="shrink-0">{tab === "rules" && <Button variant="outline" asChild><a href={rulesUrl} download="AGENTS.md"><Download data-icon="inline-start" />保存 AI 规则</a></Button>}<Button variant="outline" onClick={() => onOpenChange(false)}>关闭</Button></DialogFooter>
  </DialogContent></Dialog>;
}
