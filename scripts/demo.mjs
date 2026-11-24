import fs from "node:fs";
import path from "node:path";
import { checkPackage } from "../dist/index.js";

const root = path.resolve("examples/demo-pkg");
fs.mkdirSync(root, { recursive: true });
fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ version: "0.0.1" }, null, 2));
const out = path.resolve("examples/out-demo");
const r = checkPackage(root, out);
console.log(JSON.stringify({ issues: r.issues.length, out }, null, 2));
