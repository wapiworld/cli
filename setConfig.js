/* Copyright 2013 - 2026 Waiterio LLC */
const fs = require('fs-extra')
const path = require('node:path')

module.exports = function setConfig(config) {
  const configPath = path.resolve('.', 'wapiworld.json')

  let string = ''

  if (config) {
    string = JSON.stringify(config)
  }

  config = fs.writeFileSync(configPath, string)

  return config
}
