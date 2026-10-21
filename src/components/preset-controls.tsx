import { createContext, useContext, type ComponentProps, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { useInterfaceOptions } from "@/design-system/interface-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogContent } from "@/components/ui/dialog";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SelectContent, SelectTrigger } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TooltipContent } from "@/components/ui/tooltip";

// Project presets compose the registry components. No Radix interaction is reimplemented here.
// Explicit native variants remain available and always take precedence over preset defaults.
const controlSizes = { compact: "sm", standard: "default", comfortable: "lg" } as const;
export function PresetButton({ variant, size, className, ...props }: ComponentProps<typeof Button>) {
  const { buttonStyle, controlHeight } = useInterfaceOptions();
  const defaultVariant = { solid: "default", secondary: "secondary", outline: "outline" } as const;
  return <Button variant={variant ?? defaultVariant[buttonStyle]} size={size ?? controlSizes[controlHeight]} className={cn("preset-button preset-control", className)} {...props} />;
}

export function PresetCard({ className, style, size, ...props }: ComponentProps<typeof Card>) {
  return <Card size={size} className={cn("preset-card", className)} style={{ "--card-spacing": size === "sm" ? "16px" : "var(--ui-card-spacing,24px)", ...style } as CSSProperties} {...props} />;
}

export function PresetInput({ className, ...props }: ComponentProps<typeof Input>) {
  const { inputStyle } = useInterfaceOptions();
  return <Input data-appearance={inputStyle} className={cn("preset-input preset-control", className)} {...props} />;
}
export function PresetTextarea({ className, ...props }: ComponentProps<typeof Textarea>) {
  const { inputStyle } = useInterfaceOptions();
  return <Textarea data-appearance={inputStyle} className={cn("preset-textarea preset-control", className)} {...props} />;
}
export function PresetSelectTrigger({ className, ...props }: ComponentProps<typeof SelectTrigger>) {
  const { inputStyle } = useInterfaceOptions();
  return <SelectTrigger data-appearance={inputStyle} className={cn("preset-select-trigger preset-control", className)} {...props} />;
}
export function PresetSelectContent({ position = "popper", align = "start", sideOffset = 4, className, ...props }: ComponentProps<typeof SelectContent>) {
  return <SelectContent position={position} align={align} sideOffset={sideOffset} className={cn("preset-select-content", className)} {...props} />;
}

const SelectionContext = createContext<"segmented" | "outline">("outline");
export function PresetToggleGroup({ appearance, size, className, children, ...props }: ComponentProps<typeof ToggleGroup> & { appearance?: "segmented" | "outline" }) {
  const { selectionStyle, controlHeight } = useInterfaceOptions();
  const resolved = appearance ?? (selectionStyle === "segmented" ? "segmented" : "outline");
  return <ToggleGroup size={size ?? controlSizes[controlHeight]} data-appearance={resolved} className={cn("preset-toggle-group", className)} {...props}><SelectionContext.Provider value={resolved}>{children}</SelectionContext.Provider></ToggleGroup>;
}
export function PresetToggleGroupItem({ className, ...props }: ComponentProps<typeof ToggleGroupItem>) {
  const appearance = useContext(SelectionContext);
  return <ToggleGroupItem data-appearance={appearance} className={cn("preset-toggle-group-item preset-control", className)} {...props} />;
}
export function PresetTabsList({ className, ...props }: ComponentProps<typeof TabsList>) {
  const { tabsStyle } = useInterfaceOptions();
  return <TabsList data-appearance={tabsStyle} className={cn("preset-tabs-list", className)} {...props} />;
}
export function PresetTabsTrigger({ className, ...props }: ComponentProps<typeof TabsTrigger>) {
  return <TabsTrigger className={cn("preset-tabs-trigger preset-control", className)} {...props} />;
}

export function PresetDialogContent({ className, onInteractOutside, ...props }: ComponentProps<typeof DialogContent>) {
  const { dialogDismiss } = useInterfaceOptions();
  return <DialogContent className={cn("preset-dialog-content", className)} onInteractOutside={(event) => {
    onInteractOutside?.(event);
    if (dialogDismiss === "explicit") event.preventDefault();
  }} {...props} />;
}
export function PresetTooltipContent({ side, ...props }: ComponentProps<typeof TooltipContent>) {
  const { tooltipSide } = useInterfaceOptions();
  return <TooltipContent side={side ?? tooltipSide} {...props} />;
}

export function PresetFieldGroup({ className, ...props }: ComponentProps<typeof FieldGroup>) {
  return <FieldGroup className={cn("preset-field-group", className)} {...props} />;
}
export function PresetFieldLabel({ className, ...props }: ComponentProps<typeof FieldLabel>) {
  return <FieldLabel className={cn("preset-field-label", className)} {...props} />;
}
export function PresetCheckbox({ className, ...props }: ComponentProps<typeof Checkbox>) {
  return <Checkbox className={cn("preset-checkbox preset-control", className)} {...props} />;
}
export function PresetSwitch({ className, ...props }: ComponentProps<typeof Switch>) {
  return <Switch className={cn("preset-switch preset-control", className)} {...props} />;
}
export function PresetSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return <Separator className={cn("preset-separator", className)} {...props} />;
}
export function PresetTableHeader({ className, ...props }: ComponentProps<typeof TableHeader>) {
  return <TableHeader className={cn("preset-table-header", className)} {...props} />;
}
export function PresetTableBody({ className, ...props }: ComponentProps<typeof TableBody>) {
  return <TableBody className={cn("preset-table-body", className)} {...props} />;
}
export function PresetTableRow({ className, ...props }: ComponentProps<typeof TableRow>) {
  return <TableRow className={cn("preset-table-row", className)} {...props} />;
}
export function PresetTableHead({ className, ...props }: ComponentProps<typeof TableHead>) {
  return <TableHead className={cn("preset-table-cell", className)} {...props} />;
}
export function PresetTableCell({ className, ...props }: ComponentProps<typeof TableCell>) {
  return <TableCell className={cn("preset-table-cell", className)} {...props} />;
}
