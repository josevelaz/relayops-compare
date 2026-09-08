import { spawnSync } from "node:child_process";
import {
  cpSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, "site-dist");
const pagesBase = (process.env.PAGES_BASE || "/").replace(/\/?$/, "/");

const apps = [
  { id: "astra", dir: path.join(root, "relayops-astra") },
  { id: "spark", dir: path.join(root, "relayops-spark") },
];

function run(command, args, cwd, env) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed in ${cwd}`);
  }
}

function findClientDir(appDir) {
  const candidates = [
    path.join(appDir, "dist", "client"),
    path.join(appDir, ".output", "public"),
    path.join(appDir, "dist"),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(`No build output found in ${appDir}`);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const app of apps) {
  console.log(`\nBuilding ${app.id} for GitHub Pages (base ${pagesBase}${app.id}/)`);
  if (process.env.CI) {
    run("npm", ["ci", "--legacy-peer-deps"], app.dir);
  } else if (!existsSync(path.join(app.dir, "node_modules"))) {
    run("npm", ["install", "--legacy-peer-deps"], app.dir);
  }
  run("npm", ["run", "build"], app.dir, {
    PAGES: "1",
    PAGES_BASE: pagesBase,
  });
  const clientDir = findClientDir(app.dir);
  const dest = path.join(out, app.id);
  cpSync(clientDir, dest, { recursive: true });
  const shell = path.join(dest, "_shell.html");
  const index = path.join(dest, "index.html");
  if (!existsSync(index) && existsSync(shell)) {
    copyFileSync(shell, index);
  }
  if (existsSync(index)) {
    copyFileSync(index, path.join(dest, "404.html"));
  }
}

cpSync(path.join(root, "site", "index.html"), path.join(out, "index.html"));
writeFileSync(path.join(out, ".nojekyll"), "");
console.log(`\nGitHub Pages site written to ${out}`);
