import { mkdirSync, writeFileSync } from "node:fs";
import { zipSync } from "fflate";
import { templateFiles } from "./template-files.mjs";
mkdirSync("public/downloads", { recursive: true });
const files = Object.fromEntries(
  Object.entries(await templateFiles()).map(([name, data]) => [
    `frontend-starter/${name}`,
    new Uint8Array(data),
  ]),
);
const bytes = zipSync(files, { level: 6 });
writeFileSync("public/downloads/frontend-starter.zip", bytes);
console.log(
  `Template ZIP generated: ${Object.keys(files).length} files, ${bytes.byteLength} bytes.`,
);
