import { ConfiguredButton as Button, ConfiguredDialogContent as DialogContent } from "@/components/configured-components";
import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";
import { useCallback, useRef, useState } from "react";
import { defaultInterface, type InterfaceOptions } from "@/design-system/interface-options";
import { DragDropProvider, useDroppable, PointerSensor, KeyboardSensor } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import { move } from "@dnd-kit/helpers";
import {
  GripVertical,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Undo2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { toast } from "sonner";
import { readLocal, saveLocal } from "@/lib/files";
type Board = Record<string, string[]>;
const initial: Board = {
  planned: ["整理客户资料", "确认活动时间"],
  building: ["制作活动海报", "更新商品信息"],
  done: ["列好本周计划", "收集参考图片"],
};
const names: Record<string, string> = {
  planned: "待开始",
  building: "进行中",
  done: "已完成",
};
// A whole-card handle must still leave its menu clickable. React bubbling is too late
// because the library binds native pointer listeners directly to the handle.
const boardSensors = [PointerSensor.configure({ preventActivation: (event) => Boolean((event.target as Element | null)?.closest("[data-no-drag]")) }), KeyboardSensor];
function Task({
  id,
  index,
  group,
  onMove,
  onDelete,
  options,
}: {
  id: string;
  index: number;
  group: string;
  onMove: (id: string, to: string) => void;
  onDelete: (id: string) => void;
  options: InterfaceOptions;
}) {
  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
    group,
    type: "task",
    accept: "task",
  });
  const rootRef = useCallback((node: HTMLDivElement | null) => {
    ref(node);
    if (options.dragMode === "card") handleRef(node);
  }, [ref, handleRef, options.dragMode]);
  return (
    <Card
      ref={rootRef}
      size="sm"
      className="board-task flex-row items-center gap-2 px-3"
      data-card-drag={options.dragMode === "card"}
      tabIndex={options.dragMode === "card" ? 0 : undefined}
      role={options.dragMode === "card" ? "group" : undefined}
      aria-label={options.dragMode === "card" ? `拖动${id}` : undefined}
      style={{ opacity: isDragging ? options.dragFeedback === "clear" ? 0.4 : 0.75 : 1 }}
    >
      <Button
        ref={options.dragMode === "handle" ? handleRef : undefined}
        type="button"
        variant="ghost"
        size="icon-xs"
        className="drag-handle"
        aria-label={`拖动${id}`}
        tabIndex={options.dragMode === "card" ? -1 : undefined}
        aria-hidden={options.dragMode === "card" ? true : undefined}
      >
        <GripVertical />
      </Button>
      <span className="min-w-0 flex-1 text-sm">{id}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-xs" aria-label={`${id}菜单`} data-no-drag>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {Object.entries(names)
              .filter(([key]) => key !== group)
              .map(([key, name]) => (
                <DropdownMenuItem key={key} onSelect={() => onMove(id, key)}>
                  移至{name}
                </DropdownMenuItem>
              ))}
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDelete(id)}
            >
              移除任务
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
function Column({
  id,
  tasks,
  onMove,
  onDelete,
  options,
}: {
  id: string;
  tasks: string[];
  onMove: (id: string, to: string) => void;
  onDelete: (id: string) => void;
  options: InterfaceOptions;
}) {
  const { ref, isDropTarget } = useDroppable({
    id,
    accept: "task",
    collisionPriority: CollisionPriority.Low,
  });
  return (
    <Card
      ref={ref}
      size="sm"
      role="region"
      aria-labelledby={`board-column-${id}`}
      className="board-column"
      data-drop-target={isDropTarget || undefined}
    >
      <CardHeader><CardTitle id={`board-column-${id}`}>{names[id]}</CardTitle><CardAction><Badge variant="secondary">{tasks.length}</Badge></CardAction></CardHeader>
      <CardContent className="min-h-36 gap-2">
        {tasks.map((task, index) => (
          <Task
            key={task}
            id={task}
            index={index}
            group={id}
            onMove={onMove}
            onDelete={onDelete}
            options={options}
          />
        ))}
        {!tasks.length && (
          <p className="p-5 text-center text-xs text-muted-foreground">
            拖到这里，或使用任务菜单移动。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
export function BoardDemo({ options = defaultInterface }: { options?: InterfaceOptions }) {
  const [board, setBoard] = useState(() =>
    options.rememberBoard ? readLocal<Board>("style-board-v1", initial) : structuredClone(initial),
  );
  const snapshot = useRef(board);
  const [previous, setPrevious] = useState<Board | null>(null);
  const [dialog, setDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const commit = (next: Board) => {
    setPrevious(board);
    setBoard(next);
    if (options.rememberBoard) saveLocal("style-board-v1", next);
  };
  const moveTask = (id: string, to: string) => {
    const next = Object.fromEntries(
      Object.entries(board).map(([key, items]) => [
        key,
        items.filter((t) => t !== id),
      ]),
    );
    next[to].push(id);
    commit(next);
    setAnnouncement(`${id}已移至${names[to]}`);
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {options.dragMode === "handle" ? "拖动手柄排序或跨列移动。" : "拖动整张卡片排序或跨列移动。"}键盘：空格开始，方向键移动，Esc 取消。
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!previous}
            onClick={() => {
              if (previous) {
                setBoard(previous);
                if (options.rememberBoard) saveLocal("style-board-v1", previous);
                setPrevious(null);
              }
            }}
          >
            <Undo2 data-icon="inline-start" />
            撤销
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => commit(structuredClone(initial))}
          >
            <RotateCcw data-icon="inline-start" />
            重置
          </Button>
          <Button size="sm" onClick={() => setDialog(true)}>
            <Plus data-icon="inline-start" />
            添加任务
          </Button>
        </div>
      </div>
      <DragDropProvider
        sensors={boardSensors}
        onDragStart={() => {
          snapshot.current = structuredClone(board);
        }}
        onDragOver={(event) => setBoard((current) => move(current, event))}
        onDragEnd={(event) => {
          if (event.canceled) {
            setBoard(snapshot.current);
            return;
          }
          setPrevious(snapshot.current);
          if (options.rememberBoard) saveLocal("style-board-v1", board);
          setAnnouncement(options.rememberBoard ? "任务顺序已保存" : "任务已移动，本次体验有效");
        }}
      >
        <div className="board-grid">
          {Object.entries(board).map(([id, tasks]) => (
            <Column
              key={id}
              id={id}
              tasks={tasks}
              options={options}
              onMove={moveTask}
              onDelete={(id) =>
                commit(
                  Object.fromEntries(
                    Object.entries(board).map(([key, tasks]) => [
                      key,
                      tasks.filter((t) => t !== id),
                    ]),
                  ),
                )
              }
            />
          ))}
        </div>
      </DragDropProvider>
      <span role="status" className="sr-only">
        {announcement}
      </span>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加任务</DialogTitle>
            <DialogDescription>
              {options.rememberBoard ? "任务保存在本机" : "任务仅用于本次体验"}，可拖拽到任意列。
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) return;
              if (Object.values(board).flat().includes(title.trim())) {
                toast.error("任务名称已存在");
                return;
              }
              commit({ ...board, planned: [...board.planned, title.trim()] });
              setTitle("");
              setDialog(false);
            }}
          >
            <Field>
              <FieldLabel htmlFor="task-title">任务名称</FieldLabel>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={60}
              />
            </Field>
            <DialogFooter>
              <Button type="submit">添加</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
