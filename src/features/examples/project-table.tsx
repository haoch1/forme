import { Spinner } from "@/components/ui/spinner";
import { ConfiguredButton as Button, ConfiguredDialogContent as DialogContent } from "@/components/configured-components";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
// Table composition adapted from shadcn-admin tasks-table; local Query repository replaces API integration.
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreHorizontal,
  Plus,
  Download,
  Check,
  Clock,
  Layers,
  RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ActionButton } from "@/components/action-button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Skeleton } from "@/components/ui/skeleton";
import { Table } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ProjectDetailsForm } from "./project-details-form";
import { useInterfaceOptions } from "@/design-system/interface-context";
import { InterfaceEmpty } from "@/components/interface-empty";
import { Choice } from "@/components/common";
import { downloadFile } from "@/lib/files";
import {
  projectsOptions,
  putProject,
  deleteProject,
  type Project } from "./project-data";
export function ProjectTable({
  compact = false,
  initialFilter = "",
  onFilterChange }: {
  compact?: boolean;
  initialFilter?: string;
  onFilterChange?: (q: string) => void;
}) {
  const options = useInterfaceOptions();
  const { data = [], isPending, isError, isFetching, refetch } = useQuery(projectsOptions);
  const client = useQueryClient();
  const [filter, setFilter] = useState(initialFilter);
  const [status, setStatus] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selection, setSelection] = useState({});
  const [draft, setDraft] = useState<Project | null>(null);
  const mutation = useMutation({
    mutationFn: putProject,
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["projects"] });
      setDraft(null);
      toast.success("项目已保存");
    },
    onError: () => toast.error("保存失败，请检查浏览器存储空间后重试") });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const previous = data.find((project) => project.id === id);
      await deleteProject(id);
      return previous;
    },
    onSuccess: (previous) => {
      void client.invalidateQueries({ queryKey: ["projects"] });
      toast.success("项目已移除", {
        action: previous ? { label: "撤销", onClick: () => mutation.mutate(previous) } : undefined });
    },
    onError: () => toast.error("移除失败，请稍后重试") });
  const updateProject = mutation.mutate;
  const removeProject = remove.mutate;
  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            aria-label="选择本页全部项目"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
            }
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label={`选择${row.original.name}`}
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        ) },
      {
        accessorKey: "id",
        header: "编号",
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground">
            {String(getValue())}
          </span>
        ) },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            项目名称
            {column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : (
              <ArrowUpDown />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Badge variant="outline">{row.original.category}</Badge>
            <Button
              variant="link"
              size="sm"
              className="h-auto justify-start px-0 whitespace-normal text-left"
              onClick={() => setDraft(row.original)}
            >
              {row.original.name}
            </Button>
          </div>
        ) },
      {
        accessorKey: "status",
        header: "状态",
        cell: ({ getValue }) => {
          const value = String(getValue());
          const Icon =
            value === "已完成" ? Check : value === "进行中" ? Clock : Layers;
          return (
            <span className="inline-flex items-center gap-2 text-xs">
              <Icon className="size-3.5 text-muted-foreground" />
              {value}
            </span>
          );
        } },
      {
        accessorKey: "owner",
        header: "负责人",
        cell: ({ getValue }) => (
          <Avatar size="sm"><AvatarFallback>{String(getValue())}</AvatarFallback></Avatar>
        ) },
      { accessorKey: "updated", header: "更新日期" },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`${row.original.name}操作`}
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setDraft(row.original)}>
                  编辑项目
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    updateProject({ ...row.original, status: "已完成" })
                  }
                >
                  标记完成
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => removeProject(row.original.id)}
                >
                  移除项目
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) },
    ],
    [updateProject, removeProject],
  );
  const visible = useMemo(
    () => (status === "all" ? data : data.filter((p) => p.status === status)),
    [data, status],
  );
  const table = useReactTable({
    data: visible,
    columns,
    state: { sorting, globalFilter: filter, rowSelection: selection },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    onRowSelectionChange: setSelection,
    enableRowSelection: true,
    getRowId: (p) => p.id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: compact ? 5 : 8 } },
    autoResetPageIndex: true });
  const csv = () => {
    const rows = table.getFilteredRowModel().rows.map((r) => r.original);
    downloadFile(
      "projects.csv",
      "\uFEFF" +
        [
          ["编号", "项目", "分类", "状态", "负责人", "更新日期"],
          ...rows.map((p) => [
            p.id,
            p.name,
            p.category,
            p.status,
            p.owner,
            p.updated,
          ]),
        ]
          .map((row) =>
            row.map((v) => `"${v.replaceAll('"', '""')}"`).join(","),
          )
          .join("\r\n"),
      "text/csv",
    );
  };
  if (isPending && options.loadingStyle === "inline") return <div role="status" className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><Spinner  />正在获取项目</div>;
  if (isPending)
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  if (isError)
    return (
      <div className="p-6">
        数据加载失败。
        <ActionButton icon={RefreshCw} variant="outline" pending={isFetching} onClick={() => void refetch()}>
          重试
        </ActionButton>
      </div>
    );
  return (
    <div className="flex flex-col gap-4">
      <div className="project-toolbar flex flex-wrap items-center justify-between gap-2">
        <div className="project-filters flex flex-wrap items-center gap-2">
          <Input
            aria-label="搜索项目"
            placeholder="按项目名称或编号筛选…"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              onFilterChange?.(e.target.value);
            }}
            className="w-56"
          />
          <div className="project-status-filter w-32">
            <Choice
              label="按状态筛选"
              value={status}
              onChange={setStatus}
              options={["all", "规划中", "进行中", "已完成"].map((s) => ({
                value: s,
                label: s === "all" ? "全部状态" : s }))}
            />
          </div>
        </div>
        <div className="project-toolbar-actions flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={csv}>
            <Download data-icon="inline-start" />
            导出
          </Button>
          <Button
            size="sm"
            onClick={() =>
              setDraft({
                id: `PRJ-${Date.now().toString(36).toUpperCase()}`,
                name: "",
                category: "日常",
                status: "规划中",
                owner: "我",
                updated: new Date().toLocaleDateString("sv-SE") })
            }
          >
            <Plus data-icon="inline-start" />
            新建项目
          </Button>
        </div>
      </div>
      <div className="project-results overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} data-column={h.column.id}>
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="project-cell" data-column={cell.column.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-36 text-center text-muted-foreground"
                >
                  <InterfaceEmpty title="没有找到项目" description="试试其他关键词" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span aria-live="polite">
          {table.getSelectedRowModel().rows.length
            ? `已选择 ${table.getSelectedRowModel().rows.length} 项 · `
            : ""}
          共 {table.getFilteredRowModel().rows.length} 个项目 · 本地示例数据
        </span>
        <div className="flex items-center gap-2">
          <span>
            第 {table.getState().pagination.pageIndex + 1} /{" "}
            {Math.max(1, table.getPageCount())} 页
          </span>
          <Pagination className="mx-0 w-auto" aria-label="项目分页"><PaginationContent><PaginationItem><PaginationPrevious
            size={options.controlSize}
            aria-label="上一页"
            href="#"
            aria-disabled={!table.getCanPreviousPage()}
            tabIndex={table.getCanPreviousPage() ? 0 : -1}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            onClick={(event) => { event.preventDefault(); if (table.getCanPreviousPage()) table.previousPage(); }}
          /></PaginationItem><PaginationItem><PaginationNext
            size={options.controlSize}
            aria-label="下一页"
            href="#"
            aria-disabled={!table.getCanNextPage()}
            tabIndex={table.getCanNextPage() ? 0 : -1}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            onClick={(event) => { event.preventDefault(); if (table.getCanNextPage()) table.nextPage(); }}
          /></PaginationItem></PaginationContent></Pagination>
        </div>
      </div>
      <Dialog
        open={!!draft}
        onOpenChange={(open) => {
          if (!open) setDraft(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>项目详情</DialogTitle>
            <DialogDescription>
              更改保存于当前浏览器，可在示例页面中继续使用。
            </DialogDescription>
          </DialogHeader>
          {draft && <ProjectDetailsForm key={draft.id} project={draft} pending={mutation.isPending} onSave={(project) => mutation.mutate(project)} onCancel={() => setDraft(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
