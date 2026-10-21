import { Spinner } from "@/components/ui/spinner";
import { Component, useEffect, useState, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { ActionButton } from "@/components/action-button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function PreviewLoading() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 10000);
    return () => window.clearTimeout(timer);
  }, []);
  return <div className="preview-loading" role="status"><Spinner  /><p>{slow ? "预览加载时间较长" : "正在载入预览…"}</p>{slow && <ActionButton icon={RefreshCw} variant="outline" onClick={() => window.location.reload()}>重新加载</ActionButton>}</div>;
}

export class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="p-6"><Alert variant="destructive"><AlertTitle>预览暂时无法显示</AlertTitle><AlertDescription>重新加载预览即可重试，已选配置会保留。<ActionButton icon={RefreshCw} variant="outline" onClick={() => window.location.reload()}>重新加载</ActionButton></AlertDescription></Alert></div>;
    return this.props.children;
  }
}
