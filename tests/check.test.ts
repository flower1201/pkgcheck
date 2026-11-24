import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { checkPackage } from "../src/core/check.js";

describe("checkPackage", () => {
  it("flags missing license and name", () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "pkgcheck-"));
    fs.writeFileSync(path.join(cwd, "package.json"), JSON.stringify({ version: "1.0.0" }));
    const result = checkPackage(cwd, path.join(cwd, "out"));
    expect(result.issues.some((i) => i.ruleId === "MISSING_NAME")).toBe(true);
    expect(result.issues.some((i) => i.ruleId === "MISSING_LICENSE")).toBe(true);
  });
});
