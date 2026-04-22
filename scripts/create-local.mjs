import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const forwardedArgs = process.argv.slice(2);
let normalizedArgs = forwardedArgs[0] === "--" ? forwardedArgs.slice(1) : forwardedArgs;

if (normalizedArgs.length === 0) {
  const rl = createInterface({ input, output });
  let projectName = "";
  try {
    projectName = (await rl.question("Project name: ")).trim();
  } catch {
    rl.close();
    process.exit(1);
  }
  rl.close();

  if (!projectName) {
    console.error("Project name is required.");
    process.exit(1);
  }

  normalizedArgs = [projectName];
}

const build = spawnSync("pnpm", ["run", "build:cli"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: true,
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const buildCore = spawnSync("pnpm", ["run", "build:core"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: true,
});

if (buildCore.status !== 0) {
  process.exit(buildCore.status ?? 1);
}

const buildBlocks = spawnSync("pnpm", ["run", "build:blocks"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: true,
});

if (buildBlocks.status !== 0) {
  process.exit(buildBlocks.status ?? 1);
}

const projectNameArgIndex = normalizedArgs.findIndex((arg) => !arg.startsWith("-"));
if (projectNameArgIndex === -1) {
  console.error("Project name is required.");
  process.exit(1);
}
const projectName = normalizedArgs[projectNameArgIndex];

const runCreate = spawnSync(
  "node",
  ["packages/create-landrr-app/bin/create-landrr-app", ...normalizedArgs],
  {
    cwd: rootDir,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      LANDRR_USE_WORKSPACE_DEPS: "1",
      LANDRR_SKIP_INSTALL: "1",
    },
  }
);

if (runCreate.status !== 0) {
  process.exit(runCreate.status ?? 1);
}

const projectPath = path.resolve(rootDir, projectName);
const packageJsonPath = path.join(projectPath, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

if (packageJson.dependencies?.["@landrr/core"] === "workspace:*") {
  packageJson.dependencies["@landrr/core"] = "file:../packages/landrr-core";
}
if (packageJson.dependencies?.["@landrr/blocks"] === "workspace:*") {
  packageJson.dependencies["@landrr/blocks"] = "file:../packages/landrr-blocks";
}

fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

const install = spawnSync("pnpm", ["install", "--ignore-workspace"], {
  cwd: projectPath,
  stdio: "inherit",
  shell: true,
});

process.exit(install.status ?? 1);
