import fs from "node:fs";
import path from "node:path";
import { ENGINE_VERSION } from "../version.js";

export type Issue = {
  ruleId: string;
  message: string;
  fixHint: string;
  severity: "error" | "warn";
};

export type CheckResult = {
  schemaVersion: "1.0";
  engineVersion: string;
  cwd: string;
  issues: Issue[];
  artifacts: { json: string; markdown: string };
};

export function checkPackage(cwd: string, outDir: string): CheckResult {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) throw new Error("package.json not found");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const issues: Issue[] = [];

  if (!pkg.name) {
    issues.push({
      ruleId: "MISSING_NAME",
      message: "name is missing",
      fixHint: "Set a unique package name",
      severity: "error",
    });
  }
  if (!pkg.version) {
    issues.push({
      ruleId: "MISSING_VERSION",
      message: "version is missing",
      fixHint: "Set a semver version like 0.1.0",
      severity: "error",
    });
  }
  if (!pkg.license) {
    issues.push({
      ruleId: "MISSING_LICENSE",
      message: "license field is missing",
      fixHint: "Add license: MIT (or your SPDX id)",
      severity: "error",
    });
  }
  if (!pkg.description) {
    issues.push({
      ruleId: "MISSING_DESCRIPTION",
      message: "description is missing",
      fixHint: "Add a one-line description",
      severity: "warn",
    });
  }
  if (!pkg.repository && !pkg.homepage) {
    issues.push({
      ruleId: "MISSING_REPO_OR_HOMEPAGE",
      message: "repository/homepage missing",
      fixHint: "Add repository.url for GitHub discovery",
      severity: "warn",
    });
  }
  if (!pkg.engines?.node) {
    issues.push({
      ruleId: "MISSING_ENGINES_NODE",
      message: "engines.node is missing",
      fixHint: "Declare supported Node versions",
      severity: "warn",
    });
  }
  if (pkg.bin && !pkg.files) {
    issues.push({
      ruleId: "BIN_WITHOUT_FILES",
      message: "bin is set but files whitelist is missing",
      fixHint: "Add files: [\"dist\", ...] so publish includes the CLI",
      severity: "warn",
    });
  }
  if (pkg.type !== "module" && pkg.type !== "commonjs" && pkg.main?.endsWith(".js")) {
    issues.push({
      ruleId: "TYPE_UNSPECIFIED",
      message: "type is unspecified (defaults to CommonJS)",
      fixHint: "Set type: module if shipping ESM",
      severity: "warn",
    });
  }
  if (pkg.private === true && pkg.bin) {
    issues.push({
      ruleId: "PRIVATE_WITH_BIN",
      message: "package is private but exposes a bin",
      fixHint: "Set private:false if you intend to publish the CLI",
      severity: "warn",
    });
  }

  fs.mkdirSync(outDir, { recursive: true });
  const result: CheckResult = {
    schemaVersion: "1.0",
    engineVersion: ENGINE_VERSION,
    cwd,
    issues,
    artifacts: { json: "report.json", markdown: "summary.md" },
  };
  fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(result, null, 2));
  fs.writeFileSync(
    path.join(outDir, "summary.md"),
    [
      "# PkgCheck report",
      "",
      `Issues: ${issues.length}`,
      "",
      ...issues.map((i) => `- **${i.severity}** \`${i.ruleId}\` — ${i.message}`),
      "",
      "## Agent checklist",
      ...issues.map((i) => `- ${i.fixHint}`),
    ].join("\n"),
  );
  return result;
}
