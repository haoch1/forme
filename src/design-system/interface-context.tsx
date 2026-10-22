import { createContext, useContext, type ReactNode } from "react";
import { defaultInterface, type InterfaceOptions } from "./interface-options";

const InterfaceContext = createContext<InterfaceOptions>(defaultInterface);
export function InterfaceOptionsProvider({ options, children }: { options: InterfaceOptions; children: ReactNode }) {
  return <InterfaceContext.Provider value={options}>{children}</InterfaceContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useInterfaceOptions() { return useContext(InterfaceContext); }
export function DetailCopy({ short, full }: { short: string; full: string }) {
  const options = useInterfaceOptions();
  return options.copyStyle === "complete" ? full : short;
}
export function RequiredMark() {
  const { requiredIndicator } = useInterfaceOptions();
  if (requiredIndicator === "none") return null;
  return <span aria-hidden="true" className={requiredIndicator === "asterisk" ? "text-destructive" : "text-xs text-muted-foreground"}>{requiredIndicator === "asterisk" ? "*" : "必填"}</span>;
}
