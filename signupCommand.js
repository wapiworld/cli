/* Copyright 2013 - 2026 Waiterio LLC */
const agentfirstSignupCommand = require('@monorepool/agentfirst/signupCommand.js')
const appUrl = require('./appUrl.js')
const getApiUrl = require('./getApiUrl.js')
const sessionStore = require('./sessionStore.js')

// The step that used to need a person. `login` assumes the account exists;
// an agent pointed at wapiworld.com for the first time has no account to log
// into, and the browser flow it fell into blocked for up to five minutes
// with nobody there to complete it.
//
//   wapiworld signup --email founder@example.com --json
//
// stores the session in the same ~/.wapiworld the browser flow writes, so
// every other command works immediately afterwards.
function signupCommand() {
  return agentfirstSignupCommand({
    binaryName: 'wapiworld',
    getApiUrl,
    appUrl,
    session: sessionStore,
  })
}

module.exports = signupCommand
