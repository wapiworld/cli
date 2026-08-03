/* Copyright 2013 - 2024 Waiterio LLC */
const {
  setAccessTokenForWapiworldClient,
  setAccessTokenCallbackForWapiworldClient,
} = require('@wapiworld/client/accessToken.js')
const {
  setRefreshTokenForWapiworldClient,
} = require('@wapiworld/client/refreshToken.js')
const getAccessToken = require('./getAccessToken.js')
const getRefreshToken = require('./getRefreshToken.js')
const setAccessToken = require('./setAccessToken.js')

module.exports = function rehydrateSession() {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()

  setAccessTokenForWapiworldClient(accessToken)
  setRefreshTokenForWapiworldClient(refreshToken)
  setAccessTokenCallbackForWapiworldClient(setAccessToken)
}
