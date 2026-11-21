/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = (env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '').trim().replace(/^['"]|['"]$/g, '');

  console.log('--- Gemini Proxy Initializing ---');
  console.log('Gemini API Key status:', apiKey ? `Loaded (ends with ...${apiKey.slice(-5)})` : 'Not found in .env');
  console.log('---------------------------------');

  return {
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey)
    },
    plugins: [
      react(),
      {
        name: 'vite-plugin-reset-password-api',
        configureServer(server) {
          server.middlewares.use('/api/reset-password', async (req, res) => {
            // Helper methods for Express/Vercel Serverless compatibility
            res.status = function(code) {
              res.statusCode = code;
              return res;
            };
            res.json = function(data) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };
            try {
              const { default: resetPasswordHandler } = await import('./api/reset-password.js');
              await resetPasswordHandler(req, res);
            } catch (err) {
              console.error('[Vite Dev] Reset password API error:', err);
              if (!res.writableEnded) {
                res.status(500).json({ success: false, message: err.message });
              }
            }
          });
        }
      }
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
    },
    server: {
      proxy: {
        '/api/gemini': {
          target: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
          changeOrigin: true,
          rewrite: () => '',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              const currentEnv = loadEnv(mode, process.cwd(), '');
              const currentApiKey = (currentEnv.VITE_GEMINI_API_KEY || currentEnv.GEMINI_API_KEY || '').trim().replace(/^['"]|['"]$/g, '');
              const clientKey = req.headers['x-local-api-key'] || currentApiKey;
              if (clientKey) {
                proxyReq.setHeader('x-goog-api-key', clientKey);
              }
            });
            proxy.on('error', (err) => {
              console.error('[Proxy Error]', err);
            });
          }
        },
        '/api-gemini': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-gemini/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log(`[Proxy Request] Path: ${req.url}`);
              // Reload env dynamically to get the latest key without restarting the Vite server
              const currentEnv = loadEnv(mode, process.cwd(), '');
              const currentApiKey = (currentEnv.VITE_GEMINI_API_KEY || currentEnv.GEMINI_API_KEY || '').trim().replace(/^['"]|['"]$/g, '');

              // Get key from client-sent header or fallback to loaded env key
              const clientKey = req.headers['x-local-api-key'] || currentApiKey;
              if (clientKey) {
                console.log(`[Proxy Request] Injecting API Key ending in ...${clientKey.slice(-5)}`);
                proxyReq.setHeader('x-goog-api-key', clientKey);
              } else {
                console.warn('[Proxy Request] Warning: No API Key found to inject!');
              }
            });
            proxy.on('error', (err) => {
              console.error('[Proxy Error]', err);
            });
          }
        }
      }
    }
  }
})
