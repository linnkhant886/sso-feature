# SSO Micro-Frontend 

## Apps
- `auth-server` (port 3000): OAuth2/OIDC provider
- `bff-server` (port 4000): session + `/api/me` + login redirect with `returnTo`
- `shell-app` (port 5173): App Panel
- `app1` (port 5174)
- `app2` (port 5175)
- `app3` (port 5176)

## Install & Run
Open terminals and run:

```bash
cd auth-server && npm install && npm run dev
cd bff-server && npm install && npm run dev
cd shell-app && npm install && npm run dev
cd app1 && npm install && npm run dev
cd app2 && npm install && npm run dev
cd app3 && npm install && npm run dev
```

## Test Flow (Google-like SSO)
1. Open `http://localhost:5175` (or 5174/5176 directly)
2. If not logged in, it redirects to login automatically
3. After login, returns back to the original app (`returnTo`)
4. Now switch between App1/App2/App3 without re-login
5. Logout from any app
