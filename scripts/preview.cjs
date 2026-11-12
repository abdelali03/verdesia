/* Local production-output preview, including range requests and baseline comparison. */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const workspace = path.resolve(__dirname, '..');
const root = path.join(workspace, 'dist');
const baseline = path.join(workspace, '.preview/baseline');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer((req, res) => {
  let requested;
  try { requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const isBaseline = requested.startsWith('/baseline/');
  const selected = isBaseline ? baseline : root;
  let pathname = isBaseline ? requested.slice('/baseline'.length) : requested;
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.resolve(selected, '.' + pathname);
  if (!file.startsWith(selected + path.sep) || pathname.split('/').some(p => p.startsWith('.')) || !types[path.extname(file)]) { res.writeHead(404).end(); return; }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404).end(); return; }
    let start = 0, end = stat.size - 1;
    const headers = { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'Accept-Ranges': 'bytes' };
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1] && !match[2])) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end(); return; }
      start = match[1] ? Number(match[1]) : Math.max(0, stat.size - Number(match[2]));
      end = match[1] && match[2] ? Math.min(end, Number(match[2])) : end;
      if (start > end || start >= stat.size) { res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` }).end(); return; }
      headers['Content-Range'] = `bytes ${start}-${end}/${stat.size}`;
    }
    if (!req.headers.range && /\.(html|css|js|svg|xml|txt)$/.test(file) && /\bbr\b/.test(req.headers['accept-encoding'] || '')) {
      headers['Content-Encoding'] = 'br'; headers.Vary = 'Accept-Encoding';
      res.writeHead(200, headers);
      if (req.method === 'HEAD') { res.end(); return; }
      fs.createReadStream(file).pipe(zlib.createBrotliCompress()).pipe(res);
    } else {
      headers['Content-Length'] = end - start + 1;
      res.writeHead(req.headers.range ? 206 : 200, headers);
      if (req.method === 'HEAD') { res.end(); return; }
      fs.createReadStream(file, { start, end }).on('error', () => res.destroy()).pipe(res);
    }
  });
});
server.listen(Number(process.env.PORT || 5180), '127.0.0.1', () => console.log(`Verdesia optimized: http://localhost:${server.address().port}/\nBaseline: http://localhost:${server.address().port}/baseline/`));
