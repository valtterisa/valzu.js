"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// packages/create-valzu-app/src/cli.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
function copyRecursiveSync(src, dest) {
    if (fs_1.default.existsSync(src)) {
        const stats = fs_1.default.statSync(src);
        if (stats.isDirectory()) {
            if (!fs_1.default.existsSync(dest)) {
                fs_1.default.mkdirSync(dest);
            }
            const files = fs_1.default.readdirSync(src);
            for (const file of files) {
                const curSource = path_1.default.join(src, file);
                const curDest = path_1.default.join(dest, file);
                copyRecursiveSync(curSource, curDest);
            }
        }
        else {
            fs_1.default.copyFileSync(src, dest);
        }
    }
}
function createProject(projectName) {
    const templatePath = path_1.default.resolve(__dirname, "../template");
    const targetPath = path_1.default.resolve(process.cwd(), projectName);
    if (fs_1.default.existsSync(targetPath)) {
        console.error(`❌ Project directory "${projectName}" already exists.`);
        process.exit(1);
    }
    // Copy the template recursively
    copyRecursiveSync(templatePath, targetPath);
    console.log(`✅ Project "${projectName}" created successfully!`);
    // Automatically install dependencies in the new project
    console.log("Installing dependencies... Please wait.");
    try {
        (0, child_process_1.execSync)("npm install", { cwd: targetPath, stdio: "inherit" });
        console.log("✅ Dependencies installed successfully!");
    }
    catch (error) {
        console.error("❌ Failed to install dependencies. Please run 'npm install' manually in the project directory.");
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
