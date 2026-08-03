/* Copyright 2013 - 2024 Waiterio LLC */
const {
  setAccessTokenForWapiworldClient,
  setAccessTokenCallbackForWapiworldClient,
} = require('@wapiworld/client/accessToken.js')
const {
  setRefreshTokenForWapiworldClient,
} = require('@wapiworld/client/refreshToken.js')
const setAccessToken = require('./setAccessToken.js')
const setRefreshToken = require('./setRefreshToken.js')

module.exports = async function storeNewSession({ accessToken, refreshToken }) {
  try {
    setAccessToken(accessToken)
    setRefreshToken(refreshToken)

    setAccessTokenForWapiworldClient(accessToken, setAccessToken)
    setRefreshTokenForWapiworldClient(refreshToken, setRefreshToken)
    setAccessTokenCallbackForWapiworldClient(setAccessToken)

    return true
  } catch (error) {
    console.error('error', error)
    throw error
  }
}
