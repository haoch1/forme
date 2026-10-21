import { PresetButton as Button } from "@/components/preset-controls";
import { useState, type ComponentProps } from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

import { useActionMotionEnabled, useInterfaceOptions } from "@/design-system/interface-context";

/** Rotate action icons independently of button layout; async progress follows the actual pending state. */
export function ActionButton({ icon: Icon, pending = false, animationKey = 0, onClick, onPointerEnter, disabled, children, ...props }: ComponentProps<typeof Button> & { icon: LucideIcon; pending?: boolean; animationKey?: number }) {
  const [run, setRun] = useState(0);
  const options = useInterfaceOptions();
  const enabled = useActionMotionEnabled();
  const spinning = enabled && pending && options.actionIconLoading === "spin";
  const animateOnce = enabled && options.actionIconMotion !== "off" && run + animationKey > 0;
  return <Button {...props} disabled={disabled || pending} aria-busy={pending || undefined} onPointerEnter={(event) => { if (enabled && options.actionIconMotion === "hover" && !pending && !disabled) setRun((previous) => previous + 1); onPointerEnter?.(event); }} onClick={(event) => { if (enabled && options.actionIconMotion === "click") setRun((previous) => previous + 1); onClick?.(event); }}>
    <motion.span key={`${run}-${animationKey}-${spinning}`} data-icon="inline-start" data-slot="action-icon" data-motion={spinning ? "loading" : animateOnce ? options.actionIconMotion : "off"} className="inline-flex shrink-0 items-center justify-center" initial={{ rotate: 0 }} animate={{ rotate: spinning || animateOnce ? 360 : 0 }} transition={spinning ? { duration: 0.9, ease: "linear", repeat: Infinity } : { duration: enabled ? 0.45 : 0, ease: "easeOut" }}><Icon aria-hidden="true" /></motion.span>{children}
  </Button>;
}
