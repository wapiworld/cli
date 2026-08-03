/* Copyright 2013 - 2026 Waiterio LLC */
const commander = require('commander')
const login = require('./login.js')

function loginCommand() {
  const command = new commander.Command('login')
  command.description('log in to your wapiworld.com account via browser')
  command.action(async () => {
    try {
      console.log('login')

      await login()

      console.log('logged in')
    } catch (error) {
      console.log('error', error)
    }
  })

  return command
}

module.exports = loginCommand
