"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// packages/create-valzu-app/src/cli.ts
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
function copyRecursiveSync(src, dest) {
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
        }
        else {
            fs.copyFileSync(src, dest);
        }
    }
}
function createProject(projectName) {
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
