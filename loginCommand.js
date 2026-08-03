/* Copyright 2013 - 2026 Waiterio LLC */
const agentfirstLoginCommand = require('@monorepool/agentfirst/loginCommand.js')
const { setApiKeyForWapiworldClient } = require('@wapiworld/client/apiKey.js')
const get = require('@wapiworld/client/get.js').default
const appUrl = require('./appUrl.js')
const sessionStore = require('./sessionStore.js')

// Dual-mode login from the shared factory:
//
//   wapiworld login             chooser on a TTY (browser or API key)
//   wapiworld login --browser   app.wapiworld.com callback flow (as before)
//   wapiworld login --with-key  masked prompt; the secret is stored in
//                               ~/.wapiworld/ and verified before keeping it
//
// Headless (no TTY) it prints instructions and exits 1 instead of hanging.
// The secret is never accepted as an argument — argv lands in shell history
// and `ps` listings. Use WAPIWORLD_API_KEY for scripts and CI.
//
// The verify callback authenticates with ONLY the just-stored key (no
// session tokens are pushed into the client here), so a bad secret fails at
// login instead of at the first real command. `GET /api/projects` is in the
// default read-only key scopes, so a valid-but-narrow key still passes.
async function verifyApiKey() {
  setApiKeyForWapiworldClient(sessionStore.getApiKeySecret())

  const projects = await get({ url: 'projects' })

  return `Logged in with an API key — ${projects.length} project(s) visible.`
}

module.exports = function loginCommand() {
  return agentfirstLoginCommand({
    binaryName: 'wapiworld',
    appUrl,
    session: sessionStore,
    envKeyName: 'WAPIWORLD_API_KEY',
    verify: verifyApiKey,
  })
}
