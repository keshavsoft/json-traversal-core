import fs from "fs";
import path from "path";
import startFunc from "../../src/index.js";
import dataJson from "./data.json" with { type: "json" };

import { generateBranchRoute } from "./templates/branchRoute.js";
import { generateLeafRoute } from "./templates/leafRoute.js";

const outputBaseDir = "./test/v3/output";

// Helper: check pure object
function isPureObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
}

// ==========================================
// STEP 1: Traversal & Plan Generation
// Walk the JSON and record every folder & node
// ==========================================
console.log("--- STEP 1: Building Manifest / Plan ---");

const nodes = [];

const collectNodes = (key, value, inPath) => {
    const currentPath = inPath === "" ? key : `${inPath.replaceAll(".", "/")}/${key}`;
    const isObject = isPureObject(value);

    nodes.push({
        key,
        value,
        fullPath: currentPath,
        isBranch: isObject,
        children: isObject ? Object.keys(value) : [],
        actions: !isObject ? [{ name: key, handler: value }] : []
    });
};

startFunc(dataJson, collectNodes);
console.log(`Plan collected ${nodes.length} nodes.\n`);

// Clean up old output if present
if (fs.existsSync(outputBaseDir)) {
    fs.rmSync(outputBaseDir, { recursive: true, force: true });
}
fs.mkdirSync(outputBaseDir, { recursive: true });

// ==========================================
// STEP 2: Folder Creation
// Create physical directories from the plan
// ==========================================
console.log("--- STEP 2: Creating Directories ---");

for (const node of nodes) {
    // Only create directories for branch nodes or intermediate containers
    if (node.isBranch) {
        const folderPath = path.join(outputBaseDir, node.fullPath);
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`[Folder Created] -> ${folderPath}`);
    }
}
console.log("");

// ==========================================
// STEP 3: Route File Hookup
// Read templates and write routes.js in each folder
// ==========================================
console.log("--- STEP 3: Generating routes.js Hookups ---");

for (const node of nodes) {
    if (!node.isBranch) continue;

    const targetDir = path.join(outputBaseDir, node.fullPath);
    const routesFilePath = path.join(targetDir, "routes.js");

    // Check if children are branches (nested objects) or leaves (endpoints)
    const childEntries = Object.entries(node.value);
    const branchChildren = [];
    const leafActions = [];

    for (const [childKey, childVal] of childEntries) {
        if (isPureObject(childVal)) {
            branchChildren.push(childKey);
        } else {
            leafActions.push({ name: childKey, handler: childVal });
        }
    }

    let fileContent = "";

    if (branchChildren.length > 0) {
        // Use Branch Template: mount child routes
        fileContent = generateBranchRoute(branchChildren);
    } else if (leafActions.length > 0) {
        // Use Leaf Template: mount actual endpoints
        fileContent = generateLeafRoute(leafActions);
    }

    if (fileContent) {
        fs.writeFileSync(routesFilePath, fileContent, "utf8");
        console.log(`[File Written]   -> ${routesFilePath}`);
    }
}

console.log("\n--- Execution Complete! Check test/v3/output ---");
