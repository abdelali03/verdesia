const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.json': 'application/json; charset=utf-8' };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  if (pathname === '/') pathname = '/index.html';
  const file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep) || pathname.split('/').some(part => part.startsWith('.')) || !types[path.extname(file)]) {
    res.writeHead(404).end('Introuvable'); return;
  }
  fs.stat(file, (error, stat) => {
    if (error) { res.writeHead(404).end('Introuvable'); return; }
    const headers = { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-cache', 'Accept-Ranges': 'bytes' };
    let start = 0;
    let end = stat.size - 1;
    if (req.headers.range) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!range || (!range[1] && !range[2])) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end(); return; }
      if (range[1]) { start = Number(range[1]); end = range[2] ? Math.min(Number(range[2]), end) : end; }
      else start = Math.max(0, stat.size - Number(range[2]));
      if (start > end || start < 0 || start >= stat.size) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end(); return; }
      headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    }
    headers['Content-Length'] = end - start + 1;
    res.writeHead(req.headers.range ? 206 : 200, headers);
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(file, { start, end }).on('error', () => res.destroy()).pipe(res);
  });
});
const port = Number(process.env.PORT || 5173);
server.listen(port, '127.0.0.1', () => console.log(`Verdesia : http://localhost:${port}`));
