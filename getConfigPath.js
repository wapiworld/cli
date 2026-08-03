/* Copyright 2013 - 2026 Waiterio LLC */
const getFiles = require('./getFiles.js')

module.exports = function getConfigPath() {
  let configPath
  let files = getFiles()
  files = files.filter(file => !file.includes('/build/'))
  files = files.filter(file => file.endsWith('wapiworld.json'))

  if (files.length > 0) {
    configPath = files[0] // eslint-disable-line prefer-destructuring

    if (configPath.startsWith('/')) {
      configPath = configPath.slice(1)
    }
  }

  return configPath
}
