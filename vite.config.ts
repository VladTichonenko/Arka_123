import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { createChatMiddleware } from './server/chat.ts'
import { loadChatConfig } from './server/config.ts'

// https://vite.dev/config/
export default defineConfig(() => {
  const chat = createChatMiddleware(loadChatConfig())
  return {
    plugins: [react(), {
      name: 'arka-server-chat',
      configureServer(server) { server.middlewares.use(chat) },
      configurePreviewServer(server) { server.middlewares.use(chat) },
    }],
  }
})
