const express = require("express");
const { Provider } = require("oidc-provider");

const app = express();
const port = 3000;
const issuer = `http://localhost:${port}`;

const clients = [
  {
    client_id: "shell-client",
    client_secret: "shell-secret",
    redirect_uris: ["http://localhost:4000/auth/callback"],
    post_logout_redirect_uris: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176"
    ],
    response_types: ["code"],
    grant_types: ["authorization_code"],
    token_endpoint_auth_method: "client_secret_basic"
  }
];

const configuration = {
  clients,
  features: {
    devInteractions: { enabled: true }
  },
  pkce: {
    required: () => false
  },
  claims: {
    openid: ["sub"],
    profile: ["name", "email"]
  },
  async findAccount(ctx, sub) {
    return {
      accountId: sub,
      async claims() {
        return { sub, name: "Demo User", email: "demo@example.com" };
      }
    };
  }
};

(async () => {
  const oidc = new Provider(issuer, configuration);
  app.use(oidc.callback());
  app.listen(port, () => {
    console.log(`OIDC server running: ${issuer}`);
  });
})();
