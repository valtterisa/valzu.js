// packages/create-valzu-app/src/cli.ts
import * as fs from "fs";
import * as path from "path";

function copyRecursiveSync(src: string, dest: string) {
  if (fs.existsSync(src)) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }
      const files = fs.readdirSync(src);
      files.forEach((file) => {
        const curSource = path.join(src, file);
        const curDest = path.join(dest, file);
        copyRecursiveSync(curSource, curDest);
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

function createProject(projectName: string) {
  const templatePath = path.resolve(__dirname, "../template");
  const targetPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetPath)) {
    console.error(`❌ Project directory "${projectName}" already exists.`);
    process.exit(1);
  }

  copyRecursiveSync(templatePath, targetPath);
  console.log(`✅ Project "${projectName}" created successfully!`);
}

// Simple CLI argument parsing
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: create-valzu-app <project-name>");
  process.exit(1);
}

const projectName = args[0];
createProject(projectName);
