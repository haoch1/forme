import type { ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { ConfiguredButton as Button } from "@/components/configured-components";
import { Spinner } from "@/components/ui/spinner";

/** Native Button + Spinner; progress reflects actual pending work. */
export function ActionButton({ icon: Icon, pending = false, disabled, children, ...props }: ComponentProps<typeof Button> & { icon: LucideIcon; pending?: boolean }) {
  return <Button {...props} disabled={disabled || pending} aria-busy={pending || undefined}>
    {pending ? <Spinner data-icon="inline-start" /> : <Icon data-icon="inline-start" aria-hidden="true" />}{children}
  </Button>;
}
