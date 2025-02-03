#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";

const projectName = process.argv[2] || "valzu-app";
const projectPath = path.join(process.cwd(), projectName);
const templatePath = path.join(__dirname, "../template");

console.log(`🚀 Creating Valzu.js project: ${projectName}...`);
fs.copySync(templatePath, projectPath);

console.log("📦 Installing dependencies...");
execSync(`cd ${projectPath} && npm install`, { stdio: "inherit" });

console.log(`✅ Setup complete!`);
console.log(`\nRun your project:\n`);
console.log(`  cd ${projectName}`);
console.log(`  npm run dev`);
