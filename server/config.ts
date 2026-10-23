import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { parseEnv } from 'node:util'

export function loadChatConfig() {
  const path = process.env.ARKA_CHAT_ENV_FILE || resolve(homedir(), '.config/arka123/server.env')
  const privateEnv = existsSync(path) ? parseEnv(readFileSync(path, 'utf8')) : {}
  return {
    apiKey: process.env.OPENROUTER_API_KEY || privateEnv.OPENROUTER_API_KEY || '',
    model: process.env.OPENROUTER_MODEL || privateEnv.OPENROUTER_MODEL || 'qwen/qwen3.7-flash',
  }
}
