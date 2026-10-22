import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ConfiguredButton as Button, ConfiguredToggleGroup as ToggleGroup, ConfiguredTabsList as TabsList, ConfiguredDialogContent as DialogContent } from "@/components/configured-components";
import { FieldLabel, FieldGroup } from "@/components/ui/field";
import { ToggleGroupItem } from "@/components/ui/toggle-group";
import { TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Monitor, Tablet, Smartphone, Undo2, Redo2, RotateCcw, Download, Copy, FileText, Sun, Moon, Check, SlidersHorizontal, Maximize2, SwatchBook, BookOpen, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Field } from "@/components/ui/field";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Choice, IconButton } from "@/components/common";
import { useThemeStore } from "@/stores/theme-store";
import { optionSections, detailOptionIds, basicOptionGroups, optionValue, setOption, type OptionDefinition } from "@/design-system/option-catalog";
import { presetTheme } from "@/design-system/theme";
import { frontendStandard } from "@/design-system/frontend-standard";
import { downloadProject } from "@/lib/export-project";
import { copyText, useTextDownload } from "@/lib/files";
import { SourcesDialog } from "./sources";

const previews = [
  { id: "app", label: "应用页面" }, { id: "cards", label: "组件" },
  { id: "icons", label: "图标" }, { id: "details", label: "界面细节" }, { id: "motion", label: "动效" },
  { id: "panels", label: "分栏" }, { id: "board", label: "拖拽" },
  { id: "state", label: "状态" },
];
const devices = [
  { id: "desktop", label: "电脑", icon: Monitor, width: "100%" },
  { id: "tablet", label: "平板", icon: Tablet, width: "768px" },
  { id: "mobile", label: "手机", icon: Smartphone, width: "390px" },
];
const paletteField = optionSections.find((section) => section.id === "appearance")!.fields.find((field) => field.id === "preset")!;

function PresetField({ field, onChosen }: { field: OptionDefinition; onChosen: (id: string) => void }) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const value = optionValue(theme, field);
  const change = (next: string) => { if (next) { setTheme(setOption(theme, field, next)); onChosen(field.id); } };
  const renderPalette = (option: { value: string; label: string }) => {
    const tokens = presetTheme(option.value).styles[theme.mode];
    return <><span className="palette-choice-sample" aria-hidden="true">{["primary", "background", "muted", "accent"].map((key) => <span key={key} style={{ background: tokens[key], borderColor: tokens.border }} />)}</span><span>{option.label}</span></>;
  };
  return <Field className="preset-field" data-option-field={field.id}><FieldLabel id={`option-${field.id}`}>{field.label}</FieldLabel>
    {field.options.length > 5 ? <Choice label={field.label} value={value} onChange={change} onReselect={() => onChosen(field.id)} options={field.options.map((o) => ({ value: o.id, label: o.label }))} renderOption={field.id === "preset" ? renderPalette : undefined} />
      : <ToggleGroup type="single" value={value} onValueChange={change} variant="outline" aria-labelledby={`option-${field.id}`} className="option-buttons">{field.options.map((option) => <ToggleGroupItem value={option.id} key={option.id} onClick={() => { if (option.id === value) onChosen(field.id); }}>{option.label}</ToggleGroupItem>)}</ToggleGroup>}
  </Field>;
}

export default function StyleWorkbench() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const navigate = useNavigate();
  const [level, setLevel] = useState(hash === "advanced" ? "advanced" : "basic");
  const [category, setCategory] = useState("appearance");
  const [preview, setPreview] = useState(previews.some((p) => p.id === hash) ? hash : hash === "tools" ? "icons" : "cards");
  const [device, setDevice] = useState("desktop");
  const [mobilePane, setMobilePane] = useState("settings");
  const [showStandard, setShowStandard] = useState(hash === "export");
  const [showSources, setShowSources] = useState(hash === "resources");
  const [busy, setBusy] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState(false);
  const [previewRevision, setPreviewRevision] = useState(0);
  const [previewHeight, setPreviewHeight] = useState(560);
  const [detailExample, setDetailExample] = useState<{ id: string; revision: number } | null>(null);
  const previewFrame = useRef<HTMLIFrameElement>(null);
  const expandedFrame = useRef<HTMLIFrameElement>(null);
  const sourceTrigger = useRef<HTMLButtonElement>(null);
  const standardTrigger = useRef<HTMLButtonElement>(null);
  const expandedTrigger = useRef<HTMLButtonElement>(null);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const undo = useThemeStore((s) => s.undo);
  const redo = useThemeStore((s) => s.redo);
  const reset = useThemeStore((s) => s.reset);
  const canUndo = useThemeStore((s) => s.past.length > 0);
  const canRedo = useThemeStore((s) => s.future.length > 0);
  const standard = useMemo(() => frontendStandard(theme), [theme]);
  const standardUrl = useTextDownload(standard);
  useEffect(() => {
    if (hash === "advanced") setLevel("advanced");
    else if (hash === "export") setShowStandard(true);
    else if (hash === "resources") setShowSources(true);
    else if (hash === "tools") setPreview("icons");
    else if (previews.some((p) => p.id === hash)) setPreview(hash);
  }, [hash]);
  useEffect(() => {
    const onSize = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source === expandedFrame.current?.contentWindow && event.data?.type === "style-preview-escape") { setExpandedPreview(false); return; }
      if (event.source !== previewFrame.current?.contentWindow) return;
      if (event.data?.type === "style-preview-ready") {
        previewFrame.current?.contentWindow?.postMessage({ type: "style-preview-demo", demo: preview }, window.location.origin);
        previewFrame.current?.contentWindow?.postMessage({ type: "style-preview-example", example: detailExample }, window.location.origin);
        return;
      }
      if (event.data?.type !== "style-preview-size") return;
      const height = event.data.height;
      if (typeof height === "number" && Number.isFinite(height)) setPreviewHeight(Math.max(240, Math.min(12000, height)));
    };
    window.addEventListener("message", onSize);
    return () => window.removeEventListener("message", onSize);
  }, [preview, detailExample]);
  useEffect(() => {
    const reportViewport = () => {
      const frame = previewFrame.current;
      if (!frame) return;
      const box = frame.getBoundingClientRect();
      const pane = document.querySelector(".config-preview")?.getBoundingClientRect();
      const visibleTop = Math.max(box.top, pane?.top ?? 0, document.querySelector(".preview-toolbar")?.getBoundingClientRect().bottom ?? 0, document.querySelector(".editor-header")?.getBoundingClientRect().bottom ?? 0);
      const visibleBottom = Math.min(box.bottom, pane?.bottom ?? window.innerHeight, window.innerHeight);
      frame.contentWindow?.postMessage({ type: "style-preview-viewport", center: (visibleTop + visibleBottom) / 2 - box.top, height: Math.max(200, visibleBottom - visibleTop - 32) }, window.location.origin);
    };
    const pending = requestAnimationFrame(reportViewport);
    const pane = document.querySelector(".config-preview");
    pane?.addEventListener("scroll", reportViewport, { passive: true });
    window.addEventListener("scroll", reportViewport, { passive: true });
    window.addEventListener("resize", reportViewport);
    return () => { cancelAnimationFrame(pending); pane?.removeEventListener("scroll", reportViewport); window.removeEventListener("scroll", reportViewport); window.removeEventListener("resize", reportViewport); };
  }, [previewHeight, preview, device]);
  useEffect(() => {
    previewFrame.current?.contentWindow?.postMessage({ type: "style-preview-demo", demo: preview }, window.location.origin);
    previewFrame.current?.contentWindow?.postMessage({ type: "style-preview-example", example: detailExample }, window.location.origin);
  }, [preview, detailExample]);
  const chooseCategory = (id: string) => {
    setCategory(id);
    setDetailExample(null);
    const section = optionSections.find((s) => s.id === id)!;
    setPreview(section.preview);
  };
  const previewChoice = (id: string) => {
    if (detailOptionIds.includes(id)) {
      setDetailExample((previous) => ({ id, revision: (previous?.revision ?? 0) + 1 }));
      setPreview("details");
      document.querySelector(".config-preview")?.scrollTo({ top: 0, behavior: "instant" });
    }
    else if (id.startsWith("panel") || id === "rememberPanels") setPreview("panels");
    else if (id.startsWith("drag") || id === "rememberBoard") setPreview("board");
    else if (id === "preferenceStorage") setPreview("state");
    else if (id.startsWith("icon")) setPreview("icons");
    else if (id.startsWith("motion")) setPreview("motion");
    else if (["navigation", "sidebarWidth", "contentWidth", "pagePadding", "surface"].includes(id)) setPreview("app");
  };
  const closeLegacyHash = () => {
    if (hash === "export" || hash === "resources") void navigate({ to: "/", search: { q: "", view: "projects" }, hash: "", replace: true });
  };
  const download = async () => {
    setBusy(true);
    try { await downloadProject(theme); toast.success("已下载模板、前端标准和完整配置"); }
    catch (error) { toast.error(error instanceof Error ? error.message : "下载失败，请重试"); }
    finally { setBusy(false); }
  };
  const activeDevice = devices.find((d) => d.id === device)!;
  const previewGroup = preview === "app" ? "app" : ["cards", "icons", "details"].includes(preview) ? "components" : "interactions";
  const previewUrl = `${import.meta.env.BASE_URL}?__preview=1&demo=${preview}`;
  return <><header className="app-header editor-header"><a href="/" className="app-brand" aria-label="Forme 首页"><span className="brand-mark" aria-hidden="true"><SwatchBook /></span><h1 className="brand-wordmark">Forme</h1></a><div className="header-right"><Badge variant="secondary" className="save-status"><Check data-icon="inline-start" />自动保存</Badge><Button ref={sourceTrigger} variant="ghost" size="sm" onClick={() => setShowSources(true)}><BookOpen data-icon="inline-start" />技术栈与规则</Button><Button variant="outline" size="sm" disabled={busy} onClick={() => void download()}>{busy ? <Spinner data-icon="inline-start"  /> : <Download data-icon="inline-start" />}下载模板</Button><Button size="sm" onClick={() => void copyText(standard)}><Copy data-icon="inline-start" />复制前端标准</Button></div></header><main id="main-content" className="config-workbench">
    <div className="config-mobile-switch"><ToggleGroup type="single" value={mobilePane} onValueChange={(v) => { if (v) setMobilePane(v); }} aria-label="工作区"><ToggleGroupItem value="settings">配置</ToggleGroupItem><ToggleGroupItem value="preview">预览</ToggleGroupItem></ToggleGroup></div>
    <div className="config-layout" data-mobile-pane={mobilePane}>
      <Card className="config-controls gap-0 py-0" role="region" aria-label="风格配置">
        <div className="config-controls-header"><span className="flex items-center gap-2 text-sm font-medium"><SlidersHorizontal className="size-4" />风格配置</span><ToggleGroup type="single" size="sm" value={level} onValueChange={(v) => { if (v) setLevel(v); }} aria-label="配置级别"><ToggleGroupItem value="basic">常用</ToggleGroupItem><ToggleGroupItem value="advanced">进阶</ToggleGroupItem></ToggleGroup></div>
        <div className="config-control-scroll">
          {level === "basic" ? <>
            <PresetField field={paletteField} onChosen={previewChoice} />
            <Accordion type="multiple" defaultValue={basicOptionGroups.filter((group) => group.defaultOpen).map((group) => group.id)} className="common-option-groups">{basicOptionGroups.map((group) => <AccordionItem key={group.id} value={group.id}><AccordionTrigger>{group.label}</AccordionTrigger><AccordionContent><FieldGroup>{group.fields.map((field) => <PresetField key={field.id} field={field} onChosen={previewChoice} />)}</FieldGroup></AccordionContent></AccordionItem>)}</Accordion>
            <Button className="mt-6 w-full" variant="outline" onClick={() => setLevel("advanced")}>更多预设选项<SlidersHorizontal data-icon="inline-end" /></Button>
          </> : <Tabs value={category} onValueChange={chooseCategory} className="config-categories"><TabsList className="config-category-list">{optionSections.map((section) => <TabsTrigger key={section.id} value={section.id}>{section.label}</TabsTrigger>)}</TabsList>{optionSections.map((section) => <TabsContent key={section.id} value={section.id}><FieldGroup>{section.fields.map((field, index) => <Fragment key={field.id}>{field.group && field.group !== section.fields[index - 1]?.group && <p className="option-subheading">{field.group}</p>}<PresetField field={field} onChosen={previewChoice} /></Fragment>)}</FieldGroup></TabsContent>)}</Tabs>}
        </div>
        <div className="config-control-footer"><Button ref={standardTrigger} variant="outline" size="sm" onClick={() => setShowStandard(true)}><FileText data-icon="inline-start" />查看生成的标准</Button></div>
      </Card>
      <Card className="config-preview gap-0 py-0" role="region" aria-label="响应式预览">
        <Tabs value={previewGroup} onValueChange={(group) => setPreview(group === "app" ? "app" : group === "components" ? "cards" : "motion")} className="preview-tab-control">
          <div className="preview-toolbar"><div className="preview-navigation"><TabsList className="preview-tab-list"><TabsTrigger value="components">组件总览</TabsTrigger><TabsTrigger value="app">应用页面</TabsTrigger><TabsTrigger value="interactions">交互演示</TabsTrigger></TabsList><div className="config-preview-topbar"><ToggleGroup type="single" value={device} onValueChange={(v) => { if (v) setDevice(v); }} size="sm" aria-label="预览设备">{devices.map(({ id, label, icon: Icon }) => <ToggleGroupItem key={id} value={id} aria-label={label}><Icon data-icon="inline-start" /><span className="device-label">{label}</span></ToggleGroupItem>)}</ToggleGroup><ToggleGroup type="single" value={theme.mode} onValueChange={(mode) => { if (mode) setTheme({ ...theme, mode: mode as typeof theme.mode }); }} size="sm" aria-label="预览明暗"><ToggleGroupItem value="light" aria-label="浅色"><Sun /></ToggleGroupItem><ToggleGroupItem value="dark" aria-label="深色"><Moon /></ToggleGroupItem></ToggleGroup></div></div>
          <div className="preview-secondarybar">{previewGroup !== "app" ? <div className="preview-subtypes"><ToggleGroup type="single" value={preview} onValueChange={(id) => { if (id) setPreview(id); }} size="sm" aria-label="预览内容">{previews.filter((item) => previewGroup === "components" ? ["cards", "icons", "details"].includes(item.id) : ["motion", "panels", "board", "state"].includes(item.id)).map((item) => <ToggleGroupItem value={item.id} key={item.id}>{item.id === "cards" ? "常用组件" : item.label}</ToggleGroupItem>)}</ToggleGroup></div> : <span className="preview-dimensions">{activeDevice.label}{device === "desktop" ? " · 自适应" : ` · ${activeDevice.width}`}</span>}<div className="editor-history flex items-center gap-1"><IconButton label="撤销调整" icon={Undo2} onClick={undo} disabled={!canUndo} /><IconButton label="重做调整" icon={Redo2} onClick={redo} disabled={!canRedo} /><IconButton label="恢复默认" icon={RotateCcw} animated onClick={reset} /><Separator orientation="vertical" className="mx-2 h-4" /><IconButton label="刷新预览" icon={RefreshCw} animated onClick={() => setPreviewRevision((n) => n + 1)} /><IconButton buttonRef={expandedTrigger} label="放大预览" icon={Maximize2} onClick={() => setExpandedPreview(true)} /></div></div></div>
          <TabsContent value={previewGroup} forceMount className="preview-content">
          <div className="preview-scroll"><div className="preview-device" data-device={device} style={{ width: activeDevice.width, height: `${previewHeight}px` }}><iframe ref={previewFrame} key={previewRevision} title="界面预览" src={`${import.meta.env.BASE_URL}?__preview=1&demo=cards`} allow="clipboard-write" /></div></div>
        </TabsContent></Tabs>
      </Card>
    </div></main>
    <Dialog open={expandedPreview} onOpenChange={setExpandedPreview}><DialogContent className="expanded-preview-dialog" onCloseAutoFocus={(event) => { event.preventDefault(); expandedTrigger.current?.focus({ preventScroll: true }); }}><DialogHeader className="shrink-0 pr-8"><DialogTitle>{activeDevice.label}预览</DialogTitle><DialogDescription>按实际设备宽度显示，可以直接操作。</DialogDescription></DialogHeader><div className="preview-scroll"><div className="preview-device" data-device={device} style={{ width: activeDevice.width }}><iframe ref={expandedFrame} title="放大的界面预览" src={previewUrl} allow="clipboard-write" /></div></div></DialogContent></Dialog>
    <Dialog open={showStandard} onOpenChange={(open) => { setShowStandard(open); if (!open) closeLegacyHash(); }}><DialogContent className="bounded-dialog sm:max-w-4xl" onCloseAutoFocus={(event) => { event.preventDefault(); standardTrigger.current?.focus({ preventScroll: true }); }}><DialogHeader className="shrink-0 pr-8"><DialogTitle>可复用前端标准</DialogTitle><DialogDescription>只定义外观、交互和技术栈。项目名称、说明及业务内容由 agent 根据聊天生成。</DialogDescription></DialogHeader><pre className="standard-document">{standard}</pre><DialogFooter className="shrink-0"><Button variant="outline" onClick={() => { setShowStandard(false); closeLegacyHash(); }}>关闭</Button><Button variant="outline" asChild><a href={standardUrl} download="前端标准.md"><Download data-icon="inline-start" />保存标准</a></Button><Button onClick={() => void copyText(standard)}><Copy data-icon="inline-start" />复制标准</Button></DialogFooter></DialogContent></Dialog>

    <SourcesDialog returnFocus={() => sourceTrigger.current?.focus({ preventScroll: true })} open={showSources} onOpenChange={(open) => { setShowSources(open); if (!open) closeLegacyHash(); }} />
  </>;
}
