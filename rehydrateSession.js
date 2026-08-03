/* Copyright 2013 - 2026 Waiterio LLC */
const {
  setAccessTokenForWapiworldClient,
  setAccessTokenCallbackForWapiworldClient,
} = require('@wapiworld/client/accessToken.js')
const {
  setRefreshTokenForWapiworldClient,
} = require('@wapiworld/client/refreshToken.js')
const sessionStore = require('./sessionStore.js')

// Pushes the stored session into @wapiworld/client and registers the
// callback that persists a refreshed accessToken back to ~/.wapiworld/.
module.exports = function rehydrateSession() {
  setAccessTokenForWapiworldClient(sessionStore.getAccessToken())
  setRefreshTokenForWapiworldClient(sessionStore.getRefreshToken())
  setAccessTokenCallbackForWapiworldClient(sessionStore.setAccessToken)
}
