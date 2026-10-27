import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiGatewayTarget =
    env.VITE_API_GATEWAY_TARGET ||
    'https://tvdhpxkwq3.execute-api.us-east-2.amazonaws.com/Prod'

  return {
    plugins: [react()],
    server: {
      // Proxy inverso para emular el comportamiento de CloudFront en desarrollo local
      proxy: {
        '/api': {
          target: apiGatewayTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
