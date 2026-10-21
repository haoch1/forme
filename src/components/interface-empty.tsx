import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useInterfaceOptions } from "@/design-system/interface-context";

export function InterfaceEmpty({ title, description, children }: { title: string; description: string; children?: ReactNode }) {
  const { emptyStyle } = useInterfaceOptions();
  return <Empty><EmptyHeader>{emptyStyle === "icon" && <EmptyMedia variant="icon"><Inbox aria-hidden="true" /></EmptyMedia>}<EmptyTitle>{title}</EmptyTitle><EmptyDescription>{description}</EmptyDescription></EmptyHeader>{children && <EmptyContent>{children}</EmptyContent>}</Empty>;
}
