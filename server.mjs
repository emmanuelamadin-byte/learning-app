import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { createServer } from "node:http";

const root = resolve(process.cwd());
const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function safeResolve(urlPath) {
  const trimmed = urlPath.split("?")[0].split("#")[0];
  const pathname = trimmed === "/" ? "/index.html" : trimmed;
  const filePath = normalize(join(root, pathname));

  if (!filePath.startsWith(root)) {
    return null;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  return normalize(join(root, "index.html"));
}

createServer((req, res) => {
  const filePath = safeResolve(req.url || "/");

  if (!filePath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  const ext = extname(filePath);
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": filePath.endsWith("sw.js")
      ? "no-cache"
      : "public, max-age=300, stale-while-revalidate=86400",
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
  };

  const stream = createReadStream(filePath);
  stream.on("error", () => {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server error");
  });

  res.writeHead(200, headers);
  stream.pipe(res);
}).listen(port, host, () => {
  console.log(`Learn Tracker running at http://${host}:${port}`);
});
