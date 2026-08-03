#!/usr/bin/env node
/* Copyright 2013 - 2026 Waiterio LLC */
// Default to production — the CLI is a customer tool and must never quietly
// talk to a dev box. But do NOT clobber an explicit choice, otherwise there is
// no way to point the CLI at a local stack while developing against it:
//
//   WAITERIO_ENV=development wapiworld messages list --instanceId …
//   WAPIWORLD_API_URL=http://localhost:25399 wapiworld instances list
//
// (WAPIWORLD_API_URL wins over both — see @wapiworld/client getWapiworldApiUrl.)
process.env.WAITERIO_ENV = process.env.WAITERIO_ENV || 'production'
const program = require('commander')
const instancesCommand = require('./instancesCommand.js')
const keysCommand = require('./keysCommand.js')
const loginCommand = require('./loginCommand.js')
const logoutCommand = require('./logoutCommand.js')
const messagesCommand = require('./messagesCommand.js')
const projectsCommand = require('./projectsCommand.js')
const schemaCommand = require('./schemaCommand.js')
const sendCommand = require('./sendCommand.js')
const signupCommand = require('./signupCommand.js')
const skillsCommand = require('./skillsCommand.js')
const packageJson = require('./package.json')

program
  .name('wapiworld')
  .description('wapiworld cli')
  .version(packageJson.version)
  .addCommand(instancesCommand())
  .addCommand(keysCommand())
  .addCommand(loginCommand())
  .addCommand(logoutCommand())
  .addCommand(messagesCommand())
  .addCommand(projectsCommand())
  .addCommand(schemaCommand())
  .addCommand(sendCommand())
  .addCommand(signupCommand())
  .addCommand(skillsCommand())
  .parse(process.argv)
