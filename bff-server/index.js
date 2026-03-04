const express = require("express");
const session = require("express-session");
const cors = require("cors");
const crypto = require("crypto");
const { Issuer } = require("openid-client");

const app = express();
const port = 4000;

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(
  session({
    secret: "super-secret-demo",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  }),
);

let client;
(async () => {
  const issuer = await Issuer.discover("http://localhost:3000");
  client = new issuer.Client({
    client_id: "shell-client",
    client_secret: "shell-secret",
    redirect_uris: ["http://localhost:4000/auth/callback"],
    response_types: ["code"],
  });
  console.log("BFF ready");
})();

app.get("/auth/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  req.session.state = state;

  const returnTo = req.query.returnTo;
  if (
    typeof returnTo === "string" &&
    returnTo.startsWith("http://localhost:")
  ) {
    req.session.returnTo = returnTo;
  }

  const url = client.authorizationUrl({
    scope: "openid profile",
    state,
  });

  res.redirect(url);
});

app.get("/auth/callback", async (req, res) => {
  try {
    const params = client.callbackParams(req);
    // console.log(params);


    const tokenSet = await client.callback(
      "http://localhost:4000/auth/callback",
      params,
      { state: req.session.state },
    );

    const userinfo = await client.userinfo(tokenSet.access_token);
    console.log(userinfo);
    
    req.session.user = {
      sub: userinfo.sub,
      name: userinfo.name,
      email: userinfo.email,
    };
    req.session.idToken = tokenSet.id_token;

    const redirectUrl = req.session.returnTo || "http://localhost:5173/";
    req.session.returnTo = null;
    res.redirect(redirectUrl);
  } catch (e) {
    console.error(e);
    res.status(500).send("Callback error");
  }
});

app.get("/api/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ ok: false });
  res.json(req.session.user);
});

app.get("/auth/logout", async (req, res) => {
  try {
    const postLogoutRedirectUri = "http://localhost:5173";
    const idTokenHint = req.session?.idToken;

    req.session.destroy(() => {
      res.clearCookie("connect.sid");

      if (idTokenHint && client) {
        const endSessionUrl = client.endSessionUrl({
          id_token_hint: idTokenHint,
          post_logout_redirect_uri: postLogoutRedirectUri,
        });
        return res.redirect(endSessionUrl);
      }

      return res.redirect(postLogoutRedirectUri);
    });
  } catch (e) {
    console.error(e);
    res.redirect("http://localhost:5173");
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

app.listen(port, () => console.log(`BFF running: http://localhost:${port}`));
