import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const apps = [
  { name: "astra", dir: path.join(root, "relayops-astra"), color: "\x1b[36m" },
  { name: "spark", dir: path.join(root, "relayops-spark"), color: "\x1b[35m" },
];

const reset = "\x1b[0m";
const children = [];

for (const app of apps) {
  const pkg = path.join(app.dir, "package.json");
  if (!existsSync(pkg)) {
    console.error(`${app.color}[${app.name}]${reset} missing ${pkg}`);
    process.exit(1);
  }

  const child = spawn("npm", ["run", "dev"], {
    cwd: app.dir,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.push(child);

  const prefix = `${app.color}[${app.name}]${reset} `;
  child.stdout.on("data", (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line.length > 0) process.stdout.write(prefix + line + "\n");
    }
  });
  child.stderr.on("data", (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line.length > 0) process.stderr.write(prefix + line + "\n");
    }
  });
  child.on("exit", (code, signal) => {
    console.error(
      `${prefix}exited${code == null ? "" : ` with code ${code}`}${signal ? ` signal ${signal}` : ""}`,
    );
    for (const other of children) {
      if (other !== child && other.exitCode == null) other.kill("SIGTERM");
    }
    process.exit(code ?? 1);
  });
}

function shutdown() {
  for (const child of children) {
    if (child.exitCode == null) child.kill("SIGTERM");
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
