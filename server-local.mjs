import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const host = "127.0.0.1";
const port = 4173;
const url = `http://${host}:${port}/`;
const fileUrl = new URL("index.html", import.meta.url).href;

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function getFilePath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl || "/", url).pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.join(root, relativePath);
  return filePath.startsWith(root) ? filePath : null;
}

const server = http.createServer(async (request, response) => {
  const filePath = getFilePath(request.url);

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, host, () => {
  console.log(`Livinha aberto em ${url}`);
  execFile("open", [url]);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(`A porta ${port} já está em uso. Abrindo ${url}`);
    execFile("open", [url]);
    return;
  }

  console.error(`Não foi possível abrir ${url}: ${error.message}`);
  console.log(`Abrindo o app diretamente pelo arquivo local: ${fileUrl}`);
  execFile("open", [fileUrl]);
  process.exitCode = 1;
});
