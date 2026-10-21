// Adapted from jnsahaj/tweakcn components/editor/control-section.tsx (Apache-2.0).
import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { PresetButton as Button } from "@/components/preset-controls";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
export function ControlSection({
  title,
  children,
  expanded = false,
}: {
  title: string;
  children: ReactNode;
  expanded?: boolean;
}) {
  const [open, setOpen] = useState(expanded);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="control-section">
      <CollapsibleTrigger asChild><Button variant="ghost" className="section-trigger">
        <ChevronRight
          className={cn("size-3 transition-transform", open && "rotate-90")}
        />
        {title}
      </Button></CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-2 pt-2 pb-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
