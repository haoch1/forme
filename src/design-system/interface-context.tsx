import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { defaultInterface, type InterfaceOptions } from "./interface-options";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getServerReducedMotion = () => true;

const InterfaceContext = createContext<InterfaceOptions>(defaultInterface);
const MotionPreferenceContext = createContext(true);
export function InterfaceOptionsProvider({ options, children, motionEnabled = true }: { options: InterfaceOptions; children: ReactNode; motionEnabled?: boolean }) {
  return <MotionPreferenceContext.Provider value={motionEnabled}><InterfaceContext.Provider value={options}>{children}</InterfaceContext.Provider></MotionPreferenceContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useInterfaceOptions() { return useContext(InterfaceContext); }
// eslint-disable-next-line react-refresh/only-export-components
export function useActionMotionEnabled() {
  const enabled = useContext(MotionPreferenceContext);
  const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerReducedMotion);
  return enabled && !reduced;
}
export function DetailCopy({ short, full }: { short: string; full: string }) {
  const options = useInterfaceOptions();
  return options.copyStyle === "complete" ? full : short;
}
export function RequiredMark() {
  const { requiredIndicator } = useInterfaceOptions();
  if (requiredIndicator === "none") return null;
  return <span aria-hidden="true" className={requiredIndicator === "asterisk" ? "text-destructive" : "text-xs text-muted-foreground"}>{requiredIndicator === "asterisk" ? "*" : "必填"}</span>;
}
