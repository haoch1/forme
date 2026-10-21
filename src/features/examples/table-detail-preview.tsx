import { PresetCheckbox as Checkbox, PresetTableBody as TableBody, PresetTableCell as TableCell, PresetTableHead as TableHead, PresetTableHeader as TableHeader, PresetTableRow as TableRow } from "@/components/preset-controls";
import { useState } from "react";

import { Table } from "@/components/ui/table";

export function TableDetailPreview() {
  const [selected, setSelected] = useState<string[]>([]);
  return <Table><TableHeader><TableRow><TableHead className="w-10"><span className="sr-only">选择</span></TableHead><TableHead>项目</TableHead><TableHead>状态</TableHead></TableRow></TableHeader><TableBody>{[["页面布局", "已完成"], ["组件整理", "进行中"], ["检查手机显示", "待处理"]].map(([name, status]) => <TableRow key={name} data-state={selected.includes(name) ? "selected" : undefined}><TableCell><Checkbox aria-label={`选择示例${name}`} checked={selected.includes(name)} onCheckedChange={(checked) => setSelected((previous) => checked ? [...previous, name] : previous.filter((item) => item !== name))} /></TableCell><TableCell>{name}</TableCell><TableCell>{status}</TableCell></TableRow>)}</TableBody></Table>;
}
