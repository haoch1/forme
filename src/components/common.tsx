import { PresetButton as Button, PresetTooltipContent as TooltipContent, PresetSelectContent as SelectContent, PresetSelectTrigger as SelectTrigger } from "@/components/preset-controls";
import type { ComponentProps, ReactNode, Ref } from "react";
import type { LucideIcon } from "lucide-react";

import { ActionButton } from "@/components/action-button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select";
export function IconButton({
  label,
  icon: Icon,
  onClick,
  disabled = false,
  buttonRef,
  animated = false,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
  buttonRef?: Ref<HTMLButtonElement>;
  animated?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {animated ? <ActionButton ref={buttonRef} icon={Icon} variant="ghost" size="icon-sm" aria-label={label} disabled={disabled} onClick={onClick} /> : <Button
          ref={buttonRef}
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
        >
          <Icon />
        </Button>}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
export function Choice({
  label,
  value,
  onChange,
  options,
  renderOption,
  onReselect,
  triggerProps,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  renderOption?: (option: { value: string; label: string }) => ReactNode;
  onReselect?: (value: string) => void;
  triggerProps?: ComponentProps<typeof SelectTrigger>;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger {...triggerProps} aria-label={triggerProps?.["aria-label"] ?? label} className="w-full">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} textValue={o.label} onPointerUp={() => { if (o.value === value) onReselect?.(o.value); }} onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && o.value === value) onReselect?.(o.value); }}>
              {renderOption ? renderOption(o) : o.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
export function PageIntro({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
