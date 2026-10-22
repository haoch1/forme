import path from "node:path";
import ts from "typescript";
import { templateFiles } from "./template-files.mjs";

// Compile the generated app in memory so broken template-only imports fail CI.
const files = await templateFiles();
const root = path.resolve(import.meta.dirname, "..", ".template-validation");
const key = (file) => path.resolve(file).toLowerCase();
const sources = new Map(Object.entries(files).map(([file, text]) => [key(path.join(root, file)), text.toString()]));
const directories = new Set();
for (const file of sources.keys()) {
  for (let dir = path.dirname(file); dir !== path.dirname(dir); dir = path.dirname(dir)) directories.add(key(dir));
}
const config = JSON.parse(files["tsconfig.app.json"].toString());
const converted = ts.convertCompilerOptionsFromJson(config.compilerOptions, root);
const host = ts.createCompilerHost(converted.options);
const originalReadFile = host.readFile;
const originalFileExists = host.fileExists;
const originalDirectoryExists = host.directoryExists;
host.readFile = (file) => sources.get(key(file)) ?? originalReadFile(file);
host.fileExists = (file) => sources.has(key(file)) || originalFileExists(file);
host.directoryExists = (dir) => directories.has(key(dir)) || originalDirectoryExists(dir);
host.getSourceFile = (file, languageVersion) => {
  const text = host.readFile(file);
  return text === undefined ? undefined : ts.createSourceFile(file, text, languageVersion);
};
host.getCurrentDirectory = () => root;
const rootNames = Object.keys(files).filter((file) => /^src\/.*\.tsx?$/.test(file)).map((file) => path.join(root, file));
const program = ts.createProgram(rootNames, converted.options, host);
const diagnostics = [...converted.errors, ...ts.getPreEmitDiagnostics(program)];
if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, host));
  process.exitCode = 1;
} else console.log(`PASS: generated template typechecks independently (${rootNames.length} source files).`);
