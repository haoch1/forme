import { exportCSS, normalizeTheme, type ThemeConfig } from "@/design-system/theme";
import { frontendStandard } from "@/design-system/frontend-standard";

export async function downloadProject(config: ThemeConfig) {
  const response = await fetch(`${import.meta.env.BASE_URL}downloads/frontend-starter.zip`);
  if (!response.ok) throw new Error("模板暂时无法下载，请稍后重试");
  const { unzipSync, zipSync, strToU8 } = await import("fflate");
  const files = unzipSync(new Uint8Array(await response.arrayBuffer()));
  const theme = normalizeTheme(config);
  files["frontend-starter/src/selected-theme.json"] = strToU8(JSON.stringify(theme, null, 2) + "\n");
  files["frontend-starter/src/selected-theme.css"] = strToU8(exportCSS(theme));
  delete files["frontend-starter/项目开发说明.md"];
  files["frontend-starter/前端标准.md"] = strToU8(frontendStandard(theme));
  const zip = zipSync(files, { level: 6 });
  const url = URL.createObjectURL(new Blob([zip.buffer as ArrayBuffer], { type: "application/zip" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "frontend-starter.zip";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
