import fs from "fs";
import path from "path";
import { execSync } from "child_process";
type DependencyVersionMap = Record<string, string>;

const DEFAULT_DEPENDENCY_VERSIONS: DependencyVersionMap = {
  "@landrr/core": "^7.0.0",
  "@landrr/blocks": "^6.0.0",
};

function getPublishedDependencyVersions(): DependencyVersionMap {
  const packageJsonPath = path.resolve(__dirname, "..", "package.json");
  try {
    const raw = fs.readFileSync(packageJsonPath, "utf-8");
    const parsed = JSON.parse(raw) as {
      landrrDependencyVersions?: DependencyVersionMap;
    };
    return {
      ...DEFAULT_DEPENDENCY_VERSIONS,
      ...(parsed.landrrDependencyVersions ?? {}),
    };
  } catch {
    return DEFAULT_DEPENDENCY_VERSIONS;
  }
}

function copyRecursiveSync(src: string, dest: string): void {
  if (fs.existsSync(src)) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }
      const files = fs.readdirSync(src);
      for (const file of files) {
        const curSource = path.join(src, file);
        const curDest = path.join(dest, file);
        copyRecursiveSync(curSource, curDest);
      }
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

function getTemplatePath(): string {
  const base = path.resolve(__dirname, "..");
  return path.join(base, "template");
}

function createProject(projectName: string): void {
  const templatePath = getTemplatePath();
  const targetPath = path.resolve(process.cwd(), projectName);
  const useWorkspaceDeps = process.env.LANDRR_USE_WORKSPACE_DEPS === "1";

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Default template not found at ${templatePath}`);
    process.exit(1);
  }

  if (fs.existsSync(targetPath)) {
    console.error(`❌ Project directory "${projectName}" already exists.`);
    process.exit(1);
  }

  copyRecursiveSync(templatePath, targetPath);

  const pkgPath = path.join(targetPath, "package.json");
  let pkg = fs.readFileSync(pkgPath, "utf-8");
  if (!useWorkspaceDeps && pkg.includes("workspace:*")) {
    const versions = getPublishedDependencyVersions();
    pkg = pkg
      .replace(
        /"@landrr\/core"\s*:\s*"workspace:\*"/g,
        `"@landrr/core": "${versions["@landrr/core"]}"`
      )
      .replace(
        /"@landrr\/blocks"\s*:\s*"workspace:\*"/g,
        `"@landrr/blocks": "${versions["@landrr/blocks"]}"`
      )
      .replace(
        /"valzu-core"\s*:\s*"workspace:\*"/g,
        `"@landrr/core": "${versions["@landrr/core"]}"`
      )
      .replace(
        /"valzu-blocks"\s*:\s*"workspace:\*"/g,
        `"@landrr/blocks": "${versions["@landrr/blocks"]}"`
      )
      .replace(/"([^"]+)"\s*:\s*"workspace:\*"/g, '"$1": "*"');
    fs.writeFileSync(pkgPath, pkg);
  }

  console.log(`✅ Project "${projectName}" created!`);

  const skipInstall = process.env.LANDRR_SKIP_INSTALL === "1";
  if (skipInstall) {
    console.log("Skipping dependency install.");
    console.log(`\nNext steps:
  1. Change to the project directory: cd ${projectName}
  2. Install dependencies: pnpm install
  3. Run the development server: pnpm run dev
  4. Open your browser at http://localhost:3000 to view your app.\n`);
    return;
  }

  console.log("Installing dependencies... Please wait.");
  try {
    const installCommand = useWorkspaceDeps ? "pnpm install" : "pnpm install --ignore-workspace";
    execSync(installCommand, { cwd: targetPath, stdio: "inherit" });
    console.log("✅ Dependencies installed successfully!");
  } catch (error) {
    console.error(
      "❌ Failed to install dependencies. Please run 'pnpm install' manually in the project directory."
    );
  }

  console.log(`\nNext steps:
  1. Change to the project directory: cd ${projectName}
  2. Run the development server: pnpm run dev
  3. Open your browser at http://localhost:3000 to view your app.\n`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let projectName: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("-")) {
      projectName = args[i];
    }
  }

  if (!projectName) {
    console.error("Usage: create-landrr-app <project-name>");
    process.exit(1);
  }

  createProject(projectName as string);
}

main();
