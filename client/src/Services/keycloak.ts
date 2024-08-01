import Keycloak from "keycloak-js";

const client = new Keycloak({
  url: import.meta.env.VITE_KEYCLOACK_URL,
  realm: import.meta.env.VITE_KEYCLOACK_REALM,
  clientId: import.meta.env.VITE_KEYCLOACK_CIENTID,
});

export default client;
