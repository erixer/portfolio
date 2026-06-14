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
    plugins: [react()],
    server: {
      proxy: {
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
