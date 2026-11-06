import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parse } from "yaml";

const raw = readFileSync(join(process.cwd(), ".github", "workflows", "publicar-guias.yml"), "utf8");
const workflow = parse(raw);
const steps = Object.values<{ steps: { run?: string; env?: Record<string, string> }[] }>(workflow.jobs).flatMap((job) => job.steps);
const step = steps.find((s) => s.run)!;

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true });
});

/** Roda o script do passo como o GitHub roda (`bash -e`), com um `curl` falso que grava os argumentos. */
function runStep(hook: string, curlExit: number) {
  const dir = mkdtempSync(join(tmpdir(), "publicar-guias-"));
  dirs.push(dir);
  const log = join(dir, "args");
  writeFileSync(join(dir, "curl"), `#!/bin/sh\necho "$@" > "${log}"\nexit ${curlExit}\n`);
  chmodSync(join(dir, "curl"), 0o755);
  const result = spawnSync("bash", ["-e", "-c", step.run!], {
    env: { PATH: `${dir}:${process.env.PATH}`, NETLIFY_BUILD_HOOK: hook },
    encoding: "utf8",
  });
  let args = "";
  try {
    args = execFileSync("cat", [log], { encoding: "utf8" });
  } catch {
    // curl não foi chamado
  }
  return { status: result.status, args };
}

describe("workflow de publicação diária", () => {
  it("roda todo dia às 12:07 UTC, 9h07 em Brasília (SCHED-06)", () => {
    expect(workflow.on.schedule).toEqual([{ cron: "7 12 * * *" }]);
  });

  it("aceita disparo manual (SCHED-06)", () => {
    expect(workflow.on).toHaveProperty("workflow_dispatch");
  });

  it("lê a URL do secret, e a URL não está no repositório (SCHED-07)", () => {
    expect(step.env?.NETLIFY_BUILD_HOOK).toBe("${{ secrets.NETLIFY_BUILD_HOOK }}");
    expect(raw).not.toContain("api.netlify.com/build_hooks");
  });

  it("envia POST para a URL do hook (SCHED-07)", () => {
    const { status, args } = runStep("https://hook.example/abc", 0);
    expect(status).toBe(0);
    expect(args).toContain("-X POST");
    expect(args).toContain("https://hook.example/abc");
  });

  it("falha sem chamar o curl quando o secret está vazio (SCHED-08)", () => {
    const { status, args } = runStep("", 0);
    expect(status).not.toBe(0);
    expect(args).toBe("");
  });

  it("falha quando a requisição falha (SCHED-08)", () => {
    expect(runStep("https://hook.example/abc", 22).status).not.toBe(0);
  });
});
