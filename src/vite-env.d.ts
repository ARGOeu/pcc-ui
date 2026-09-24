/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KEYCLOAK_URL: string
  readonly VITE_KEYCLOAK_REALM: string
  readonly VITE_KEYCLOAK_CLIENT_ID: string
  readonly VITE_KEYCLOAK_SCOPE: string
  readonly VITE_REDIRECT_URI: string
  readonly VITE_BACKEND_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
