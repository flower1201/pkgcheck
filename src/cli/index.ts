#!/usr/bin/env node
import path from "node:path";
import { Command } from "commander";
import { checkPackage } from "../core/check.js";
import { ENGINE_VERSION } from "../version.js";

const program = new Command();
program
  .name("pkgcheck")
  .description("Offline package.json readiness lint")
  .version(ENGINE_VERSION)
  .argument("[dir]", "package directory", ".")
  .option("--out <dir>", "output directory", "./pkgcheck-report")
  .option("--fail", "exit 10 on error-severity issues", false)
  .action((dir: string, opts: { out: string; fail?: boolean }) => {
    const result = checkPackage(path.resolve(dir), path.resolve(opts.out));
    const errors = result.issues.filter((i) => i.severity === "error").length;
    process.stdout.write(
      `${JSON.stringify({ issues: result.issues.length, errors, out: opts.out }, null, 2)}\n`,
    );
    if (opts.fail && errors > 0) process.exitCode = 10;
  });

program.parseAsync(process.argv).catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
