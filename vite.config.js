import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// Runs the Vercel-style functions in api/ during `npm run dev`, so ordering works
// locally too. Server secrets come from .env.local (never committed).
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res) => {
        const name = req.url.split('?')[0].replace(/^\//, '')
        if (!/^[a-z-]+$/.test(name)) {
          res.statusCode = 404
          return res.end()
        }
        let raw = ''
        for await (const chunk of req) raw += chunk
        try {
          req.body = raw ? JSON.parse(raw) : {}
        } catch {
          req.body = {}
        }
        const out = {
          status(code) {
            res.statusCode = code
            return out
          },
          json(data) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return out
          },
        }
        try {
          const mod = await server.ssrLoadModule(`/api/${name}.js`)
          await mod.default(req, out)
        } catch (e) {
          server.config.logger.error(String(e?.stack || e))
          if (!res.writableEnded) out.status(e?.code === 'ERR_LOAD_URL' ? 404 : 500).json({ error: 'Server error' })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return { plugins: [react(), localApi()] }
})
