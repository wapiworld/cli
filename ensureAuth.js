/* Copyright 2013 - 2026 Waiterio LLC */
const rehydrateSession = require('./session/rehydrateSession.js')
const isLoggedInSession = require('./session/isLoggedInSession.js')
const login = require('./login.js')
const {
  setApiKeyForWapiworldClient,
} = require('@wapiworld/client/apiKey.js')

// Authenticate the CLI, by API key when one is supplied and otherwise by the
// stored browser session.
//
// @wapiworld/client already supports both (see the dual-mode comment in
// http.js) but the CLI only ever wired the session up, so there was no way to
// run it against anything but the account you last logged into interactively.
// That made local development impossible: a production session token does not
// validate against a dev stack, and the browser login always points at
// production.
//
// WAPIWORLD_API_KEY closes that, and is also what a CI job or a script wants:
//
//   HOME=/tmp/wapiworld-dev WAPIWORLD_API_URL=http://localhost:25399 \
//     WAPIWORLD_API_KEY=<secret> wapiworld messages list --instanceId …
//
// A STORED SESSION WINS over the key, mirroring @wapiworld/client's own
// precedence in http.js. That ordering matters: WAPIWORLD_API_KEY is the
// variable product backends export for sending WhatsApp, so it is routinely
// set globally in a shell. Letting it outrank the session would silently
// change what `wapiworld` does for anyone who has it exported — which is
// exactly what it did before this was corrected.
//
// So the key applies when there is no session, which is why the dev recipe
// above scopes HOME: the session lives in ~/.wapiworld.
module.exports = async function ensureAuth() {
  rehydrateSession()

  if (isLoggedInSession()) {
    return
  }

  const apiKey = process.env.WAPIWORLD_API_KEY

  if (apiKey) {
    setApiKeyForWapiworldClient(apiKey)

    return
  }

  console.log('Please login first')
  await login()
  rehydrateSession()
}
