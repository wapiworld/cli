/* Copyright 2013 - 2026 Waiterio LLC */
const createEnsureAuth = require('@monorepool/agentfirst/ensureAuth.js')
const loginWithBrowser = require('@monorepool/agentfirst/loginWithBrowser.js')
const { isRefreshTokenExpired } = require('@wapiworld/client/refreshToken.js')
const { setApiKeyForWapiworldClient } = require('@wapiworld/client/apiKey.js')
const appUrl = require('./appUrl.js')
const rehydrateSession = require('./rehydrateSession.js')
const sessionStore = require('./sessionStore.js')

// Authenticate the CLI, feeding @wapiworld/client from agentfirst's
// credential resolution. Precedence (agentfirst resolveCredential.js):
//
//   stored browser session > stored API key secret > WAPIWORLD_API_KEY env
//
// A STORED SESSION WINS over the key. That ordering matters:
// WAPIWORLD_API_KEY is the variable product backends export for sending
// WhatsApp, so it is routinely set globally in a shell. Letting it outrank
// the session would silently change what `wapiworld` does — and which
// account it touches — for anyone who has it exported. The key applies only
// when there is no session, which is why the dev recipe scopes HOME:
//
//   HOME=/tmp/wapiworld-dev WAPIWORLD_API_URL=http://localhost:25399 \
//     WAPIWORLD_API_KEY=<secret> wapiworld messages list --instanceId …
//
// With nothing stored and no key: a TTY gets the historical auto browser
// login; a headless caller fails immediately (resolveAuth throws) with
// instructions naming both ways in — never a browser that blocks 5 minutes.
const resolveAuth = createEnsureAuth({
  session: sessionStore,
  envKeyName: 'WAPIWORLD_API_KEY',
  binaryName: 'wapiworld',
  appUrl,
})

module.exports = async function ensureAuth() {
  rehydrateSession()

  // A session only counts while its refresh token is alive. Drop the tokens
  // of an expired one — tokens only, a stored API key secret stays — so
  // resolution falls through to key auth instead of sending a dead jwt.
  if (sessionStore.getRefreshToken() && isRefreshTokenExpired()) {
    sessionStore.remove('accessToken')
    sessionStore.remove('refreshToken')
    rehydrateSession()
  }

  const resolved = await resolveAuth()

  if (resolved.mode === 'key') {
    setApiKeyForWapiworldClient(resolved.credential)
  } else if (!resolved.mode) {
    // Interactive terminal, nothing stored: the historical auto-login.
    await loginWithBrowser({ appUrl, session: sessionStore })
    rehydrateSession()
  }
}
