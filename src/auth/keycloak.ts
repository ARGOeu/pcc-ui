import Keycloak, {
  type KeycloakConfig,
  type KeycloakInitOptions,
} from 'keycloak-js'

const config: KeycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
}

let initPromise: Promise<boolean> | null = null

export const initKeycloak = (opts: KeycloakInitOptions) => {
  initPromise ??= keycloak.init(opts)
  return initPromise
}

export const keycloak = new Keycloak(config)
