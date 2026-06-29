/* eslint-env node */
const { spawnSync } = require("child_process");
const { execSync } = require("child_process");

const changedFiles = execSync("git diff --name-only --diff-filter=ACMRTUXB HEAD")
    .toString()
    .split("\n")
    .filter((f) => f.match(/\.(ts|tsx|js|jsx)$/));

if (changedFiles.length === 0) {
    console.log("✅ No changed JS/TS files to transform");
    process.exit(0);
}

console.log("🔎 Files to transform:", changedFiles);

changedFiles.forEach((file) => {
    console.log(`⚡ Running jscodeshift on: ${file}`);
    const result = spawnSync("npx", ["jscodeshift", "-t", "mui-split-imports.js", file, "--parser=tsx"], {
        stdio: "inherit",
        shell: true,
    });

    if (result.error) {
        console.error(`❌ Failed on ${file}:`, result.error);
    }
});
