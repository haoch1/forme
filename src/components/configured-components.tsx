import type { ComponentProps } from "react";
import { useInterfaceOptions } from "@/design-system/interface-context";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";
import { SelectContent } from "@/components/ui/select";
import { TabsList } from "@/components/ui/tabs";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { TooltipContent } from "@/components/ui/tooltip";

// Configuration only supplies native props. Registry components own all visual states.
export function ConfiguredButton({ variant, size, ...props }: ComponentProps<typeof Button>) {
  const options = useInterfaceOptions();
  return <Button variant={variant ?? options.buttonStyle} size={size ?? options.controlSize} {...props} />;
}
export function ConfiguredToggleGroup({ variant, size, ...props }: ComponentProps<typeof ToggleGroup>) {
  const options = useInterfaceOptions();
  return <ToggleGroup variant={variant ?? options.toggleVariant} size={size ?? options.controlSize} {...props} />;
}
export function ConfiguredTabsList({ variant, ...props }: ComponentProps<typeof TabsList>) {
  const { tabsStyle } = useInterfaceOptions();
  return <TabsList variant={variant ?? tabsStyle} {...props} />;
}
export function ConfiguredSelectContent({ position = "popper", align = "start", style, ...props }: ComponentProps<typeof SelectContent>) {
  return <SelectContent position={position} align={align} style={{ maxHeight: "min(20rem,var(--radix-select-content-available-height))", ...style }} {...props} />;
}
export function ConfiguredDialogContent({ onInteractOutside, ...props }: ComponentProps<typeof DialogContent>) {
  const { dialogDismiss } = useInterfaceOptions();
  return <DialogContent onInteractOutside={(event) => {
    onInteractOutside?.(event);
    if (dialogDismiss === "explicit") event.preventDefault();
  }} {...props} />;
}
export function ConfiguredTooltipContent({ side, ...props }: ComponentProps<typeof TooltipContent>) {
  const { tooltipSide } = useInterfaceOptions();
  return <TooltipContent side={side ?? tooltipSide} {...props} />;
}
