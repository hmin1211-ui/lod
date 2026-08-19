import { copyFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "vercel-static");
const calculatorDir = join(outDir, "calculator");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(calculatorDir, { recursive: true });

for (const file of ["index.html", "styles.css", "app.js"]) {
  copyFileSync(join(root, "lod-keyopt", file), join(outDir, file));
  copyFileSync(join(root, "apps", "lod-cal", file), join(calculatorDir, file));
}
