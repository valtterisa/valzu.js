// packages/create-valzu-app/src/cli.ts
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

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

function createProject(projectName: string): void {
  const templatePath = path.resolve(__dirname, "../template");
  const targetPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetPath)) {
    console.error(`❌ Project directory "${projectName}" already exists.`);
    process.exit(1);
  }

  // Copy the template recursively
  copyRecursiveSync(templatePath, targetPath);
  console.log(`✅ Project "${projectName}" created successfully!`);

  // Automatically install dependencies in the new project
  console.log("Installing dependencies... Please wait.");
  try {
    execSync("npm install", { cwd: targetPath, stdio: "inherit" });
    console.log("✅ Dependencies installed successfully!");
  } catch (error) {
    console.error(
      "❌ Failed to install dependencies. Please run 'npm install' manually in the project directory."
    );
  }

  // Print next steps for the user
  console.log(`\nNext steps:
  1. Change to the project directory: cd ${projectName}
  2. Run the development server: npm run dev
  3. Open your browser at http://localhost:3000 to view your app.\n`);
}

// Simple CLI argument parsing
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: create-valzu-app <project-name>");
  process.exit(1);
}

const projectName = args[0];
createProject(projectName);
