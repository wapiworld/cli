/* Copyright 2013 - 2024 Waiterio LLC */

const {
  setAccessTokenForWapiworldClient,
  setAccessTokenCallbackForWapiworldClient,
} = require('@wapiworld/client/accessToken.js')
const {
  setRefreshTokenForWapiworldClient,
} = require('@wapiworld/client/refreshToken.js')
const localStorage = require('./localStorage.js')

module.exports = function clearSession() {
  localStorage.clear()

  setAccessTokenCallbackForWapiworldClient(null)

  setAccessTokenForWapiworldClient(null)
  setRefreshTokenForWapiworldClient(null)
}
