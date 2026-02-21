import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import * as readline from "readline";

const TEMPLATES = ["blank", "landing", "minimal", "product"] as const;
type TemplateName = (typeof TEMPLATES)[number];

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

function getTemplatePath(choice: TemplateName): string {
  const base = path.resolve(__dirname, "..");
  if (choice === "blank") {
    return path.join(base, "template");
  }
  return path.join(base, `template-${choice}`);
}

function createProject(projectName: string, template: TemplateName): void {
  const templatePath = getTemplatePath(template);
  const targetPath = path.resolve(process.cwd(), projectName);

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template "${template}" not found at ${templatePath}`);
    process.exit(1);
  }

  if (fs.existsSync(targetPath)) {
    console.error(`❌ Project directory "${projectName}" already exists.`);
    process.exit(1);
  }

  copyRecursiveSync(templatePath, targetPath);

  const pkgPath = path.join(targetPath, "package.json");
  let pkg = fs.readFileSync(pkgPath, "utf-8");
  if (pkg.includes("workspace:*")) {
    pkg = pkg
      .replace(/"valzu-core"\s*:\s*"workspace:\*"/g, '"valzu-core": "^2.0.0"')
      .replace(/"valzu-blocks"\s*:\s*"workspace:\*"/g, '"valzu-blocks": "^1.0.0"')
      .replace(/"([^"]+)"\s*:\s*"workspace:\*"/g, '"$1": "*"');
    fs.writeFileSync(pkgPath, pkg);
  }

  console.log(`✅ Project "${projectName}" created with template "${template}"!`);

  console.log("Installing dependencies... Please wait.");
  try {
    execSync("pnpm install", { cwd: targetPath, stdio: "inherit" });
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

function promptTemplate(): Promise<TemplateName> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (): Promise<string> =>
    new Promise((resolve) => {
      rl.question(
        `Which template? (${TEMPLATES.join(" | ")}): `,
        (answer: string) => {
          rl.close();
          resolve(answer.trim().toLowerCase() || "blank");
        }
      );
    });

  return question().then((answer: string) => {
    if (TEMPLATES.includes(answer as TemplateName)) {
      return answer as TemplateName;
    }
    return "blank";
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let projectName: string | null = null;
  let templateArg: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--template" && args[i + 1]) {
      templateArg = args[i + 1].toLowerCase();
      i++;
    } else if (!args[i].startsWith("-")) {
      projectName = args[i];
    }
  }

  if (!projectName) {
    console.error("Usage: create-valzu-app <project-name> [--template blank|landing|minimal|product]");
    process.exit(1);
  }

  const template: TemplateName =
    templateArg && TEMPLATES.includes(templateArg as TemplateName)
      ? (templateArg as TemplateName)
      : await promptTemplate();

  createProject(projectName as string, template);
}

main();
