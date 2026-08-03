/* Copyright 2013 - 2026 Waiterio LLC */
const agentfirstLogoutCommand = require('@monorepool/agentfirst/logoutCommand.js')
const sessionStore = require('./sessionStore.js')

// Clears the whole ~/.wapiworld/ store: session tokens and any stored API
// key secret. A WAPIWORLD_API_KEY exported in the shell stays in effect —
// the factory says so out loud rather than silently staying authenticated.
module.exports = function logoutCommand() {
  return agentfirstLogoutCommand({
    binaryName: 'wapiworld',
    session: sessionStore,
    envKeyName: 'WAPIWORLD_API_KEY',
  })
}
