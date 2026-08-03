/* Copyright 2013 - 2026 Waiterio LLC */
const agentfirstSchemaCommand = require('@monorepool/agentfirst/schemaCommand.js')
const instancesCommand = require('./instancesCommand.js')
const keysCommand = require('./keysCommand.js')
const loginCommand = require('./loginCommand.js')
const logoutCommand = require('./logoutCommand.js')
const messagesCommand = require('./messagesCommand.js')
const projectsCommand = require('./projectsCommand.js')
const sendCommand = require('./sendCommand.js')
const signupCommand = require('./signupCommand.js')
const skillsCommand = require('./skillsCommand.js')

// `wapiworld schema` — the whole command tree as JSON, so an agent can
// discover commands, options, and arguments without scraping --help text.
//
// Built from the same factories index.js composes (the factory's
// commandFactories mode) rather than the assembled program, so this file
// stays a plain zero-argument `*Command.js` factory — which is what lets the
// skills package's cliSkillDrift test introspect `schema` like any other
// command. The list includes schemaCommand itself, lazily, so the emitted
// tree describes the CLI exactly as it runs.
function schemaCommand() {
  return agentfirstSchemaCommand({
    binaryName: 'wapiworld',
    description: 'wapiworld cli',
    commandFactories: [
      instancesCommand,
      keysCommand,
      loginCommand,
      logoutCommand,
      messagesCommand,
      projectsCommand,
      schemaCommand,
      sendCommand,
      signupCommand,
      skillsCommand,
    ],
  })
}

module.exports = schemaCommand
