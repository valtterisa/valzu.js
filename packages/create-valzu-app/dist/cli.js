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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const readline = __importStar(require("readline"));
const TEMPLATES = ["blank", "landing", "minimal", "product"];
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
function getTemplatePath(choice) {
    const base = path_1.default.resolve(__dirname, "..");
    if (choice === "blank") {
        return path_1.default.join(base, "template");
    }
    return path_1.default.join(base, `template-${choice}`);
}
function createProject(projectName, template) {
    const templatePath = getTemplatePath(template);
    const targetPath = path_1.default.resolve(process.cwd(), projectName);
    if (!fs_1.default.existsSync(templatePath)) {
        console.error(`❌ Template "${template}" not found at ${templatePath}`);
        process.exit(1);
    }
    if (fs_1.default.existsSync(targetPath)) {
        console.error(`❌ Project directory "${projectName}" already exists.`);
        process.exit(1);
    }
    copyRecursiveSync(templatePath, targetPath);
    const pkgPath = path_1.default.join(targetPath, "package.json");
    let pkg = fs_1.default.readFileSync(pkgPath, "utf-8");
    if (pkg.includes("workspace:*")) {
        pkg = pkg
            .replace(/"valzu-core"\s*:\s*"workspace:\*"/g, '"valzu-core": "^2.0.0"')
            .replace(/"valzu-blocks"\s*:\s*"workspace:\*"/g, '"valzu-blocks": "^1.0.0"')
            .replace(/"([^"]+)"\s*:\s*"workspace:\*"/g, '"$1": "*"');
        fs_1.default.writeFileSync(pkgPath, pkg);
    }
    console.log(`✅ Project "${projectName}" created with template "${template}"!`);
    console.log("Installing dependencies... Please wait.");
    try {
        (0, child_process_1.execSync)("pnpm install", { cwd: targetPath, stdio: "inherit" });
        console.log("✅ Dependencies installed successfully!");
    }
    catch (error) {
        console.error("❌ Failed to install dependencies. Please run 'pnpm install' manually in the project directory.");
    }
    console.log(`\nNext steps:
  1. Change to the project directory: cd ${projectName}
  2. Run the development server: pnpm run dev
  3. Open your browser at http://localhost:3000 to view your app.\n`);
}
function promptTemplate() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const question = () => new Promise((resolve) => {
        rl.question(`Which template? (${TEMPLATES.join(" | ")}): `, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() || "blank");
        });
    });
    return question().then((answer) => {
        if (TEMPLATES.includes(answer)) {
            return answer;
        }
        return "blank";
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const args = process.argv.slice(2);
        let projectName = null;
        let templateArg = null;
        for (let i = 0; i < args.length; i++) {
            if (args[i] === "--template" && args[i + 1]) {
                templateArg = args[i + 1].toLowerCase();
                i++;
            }
            else if (!args[i].startsWith("-")) {
                projectName = args[i];
            }
        }
        if (!projectName) {
            console.error("Usage: create-valzu-app <project-name> [--template blank|landing|minimal|product]");
            process.exit(1);
        }
        const template = templateArg && TEMPLATES.includes(templateArg)
            ? templateArg
            : yield promptTemplate();
        createProject(projectName, template);
    });
}
main();
