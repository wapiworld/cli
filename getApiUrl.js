/* Copyright 2013 - 2026 Waiterio LLC */

// Production wapiworld API — the same default and the same override
// (`WAPIWORLD_API_URL`) that `@wapiworld/client` env/getWapiworldApiUrl.js
// resolves, kept here as a tiny CommonJS function because `signup` is the one
// call that must not go through the client at all: the client attaches
// whatever session or WAPIWORLD_API_KEY it already holds, and signup has to be
// made with no credential but the email and password being registered.
//
// It deliberately does not read WAITERIO_ENV. The client helper maps
// staging/development to their own hosts; here only the explicit
// `WAPIWORLD_API_URL` override applies, so pass it when creating an account on
// a non-production stack:
//
//   WAPIWORLD_API_URL=http://localhost:25300 wapiworld signup --email …
module.exports = function getApiUrl() {
  return process.env.WAPIWORLD_API_URL || 'https://api.wapiworld.com'
}
