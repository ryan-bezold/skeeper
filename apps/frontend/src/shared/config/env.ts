/**
 * Typed, validated environment configuration.
 *
 * All VITE_* variables must be present in the relevant .env file.
 * Missing required variables throw at module load time so the app
 * fails fast rather than making silent requests to undefined URLs.
 */

function optional(key: string, fallback: string): string {
  return (import.meta.env[key] as string | undefined) ?? fallback;
}

export const env = {
  /** Base URL for REST API calls, e.g. http://localhost:3000 */
  apiUrl: optional('VITE_API_URL', 'http://localhost:3000'),

  /** WebSocket server URL, e.g. ws://localhost:3000 */
  wsUrl: optional('VITE_WS_URL', 'ws://localhost:3000'),

  /** True when running via `vite dev` */
  isDev: import.meta.env.DEV as boolean,

  /** True when running a production build */
  isProd: import.meta.env.PROD as boolean,

  /** Explicit environment name: development | staging | production */
  envName: optional('VITE_ENV', import.meta.env.MODE),
} as const;

export type Env = typeof env;
