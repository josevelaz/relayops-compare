import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const siteDir = path.join(root, "site");
const port = Number(process.env.HUB_PORT || 4173);
const children = [];

const apps = [
  { name: "astra", dir: path.join(root, "relayops-astra"), color: "\x1b[36m" },
  { name: "spark", dir: path.join(root, "relayops-spark"), color: "\x1b[35m" },
];
const reset = "\x1b[0m";

function pipe(app, stream, out) {
  const prefix = `${app.color}[${app.name}]${reset} `;
  stream.on("data", (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line.length > 0) out.write(prefix + line + "\n");
    }
  });
}

for (const app of apps) {
  const pkg = path.join(app.dir, "package.json");
  if (!fs.existsSync(pkg)) {
    console.error(`${app.color}[${app.name}]${reset} missing ${pkg}`);
    process.exit(1);
  }
  const child = spawn("npm", ["run", "dev"], {
    cwd: app.dir,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  children.push(child);
  pipe(app, child.stdout, process.stdout);
  pipe(app, child.stderr, process.stderr);
  child.on("exit", (code, signal) => {
    console.error(
      `${app.color}[${app.name}]${reset} exited${code == null ? "" : ` with code ${code}`}${signal ? ` signal ${signal}` : ""}`,
    );
    shutdown(code ?? 1);
  });
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/") rel = "/index.html";
  const file = path.normalize(path.join(siteDir, rel));
  if (!file.startsWith(siteDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "content-type": types[path.extname(file)] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`\x1b[33m[hub]\x1b[0m http://127.0.0.1:${port}`);
});

function shutdown(code = 0) {
  server.close();
  for (const child of children) {
    if (child.exitCode == null) child.kill("SIGTERM");
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
