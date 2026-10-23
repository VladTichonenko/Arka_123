import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { createChatMiddleware } from './chat.ts'
import { loadChatConfig } from './config.ts'

const root = resolve('dist')
const chat = createChatMiddleware(loadChatConfig())
const mime: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.ico': 'image/x-icon' }
const server = createServer((req, res) => {
  void chat(req, res, () => { void (async () => {
    if (!['GET', 'HEAD'].includes(req.method || '')) { res.writeHead(405).end(); return }
    let path: string
    try { path = resolve(root, '.' + decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname)) }
    catch { res.writeHead(400).end(); return }
    if (!path.startsWith(root + sep) && path !== root) { res.writeHead(403).end(); return }
    if (path.split(sep).some(part => part.startsWith('.'))) { res.writeHead(404).end(); return }
    try {
      if (!(await stat(path).catch(() => null))?.isFile()) {
        if (extname(path) || req.url?.startsWith('/api/')) { res.writeHead(404).end(); return }
        path = resolve(root, 'index.html')
      }
      const info = await stat(path)
      const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/)
      const start = range ? Number(range[1]) : 0
      const end = range && range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1
      if (start > end || start >= info.size) { res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end(); return }
      res.writeHead(range ? 206 : 200, {
        'Content-Type': mime[extname(path)] || 'application/octet-stream',
        'Content-Length': end - start + 1,
        'Accept-Ranges': 'bytes',
        'Cache-Control': path.includes(`${sep}assets${sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache',
        ...(range ? { 'Content-Range': `bytes ${start}-${end}/${info.size}` } : {}),
      })
      if (req.method === 'HEAD') res.end()
      else createReadStream(path, { start, end }).on('error', () => res.destroy()).pipe(res)
    } catch { res.writeHead(404).end('Сначала выполните npm run build.') }
  })() })
})
server.listen(Number(process.env.PORT || 3000), process.env.HOST || '127.0.0.1', () => {
  console.log(`АРКА 123: http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3000}`)
})
