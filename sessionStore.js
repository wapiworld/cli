/* Copyright 2013 - 2026 Waiterio LLC */
const createSessionStore = require('@monorepool/agentfirst/sessionStore.js')

// One store for everything the CLI persists: the browser login's
// accessToken + refreshToken and the API-key secret, all in ~/.wapiworld/ —
// the same directory and key names the old session/ modules used, so an
// existing login keeps working unchanged.
module.exports = createSessionStore({ productDirName: 'wapiworld' })
