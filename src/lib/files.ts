import { toast } from "sonner";
import { useEffect, useState } from "react";

export function useTextDownload(text: string) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const next = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [text]);
  return url;
}
export function downloadFile(
  filename: string,
  text: string,
  mime = "text/plain",
) {
  const url = URL.createObjectURL(
    new Blob([text], { type: `${mime};charset=utf-8` }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("已复制到剪贴板");
  } catch {
    toast.error("剪贴板不可用，请使用下载按钮保存。");
  }
}
export function saveLocal<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}
export function readLocal<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}
