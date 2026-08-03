/* Copyright 2013 - 2026 Waiterio LLC */
const { inspect } = require('node:util')
const commander = require('commander')
const ensureAuth = require('./ensureAuth.js')
const get = require('@wapiworld/client/get.js').default

function keysCommand() {
  const command = new commander.Command('keys')
  command.description('manage API keys')

  // wapiworld keys list
  command
    .command('list')
    .description('list API keys')
    .action(async () => {
      try {
        await ensureAuth()

        const keys = await get({ url: 'keys' })

        if (keys.length === 0) {
          console.log('No keys found')
        } else {
          console.log(`Found ${keys.length} key(s):`)
          keys.forEach((key, index) => {
            const project = key.projectId ? ` (project: ${key.projectId})` : ''
            console.log(`${index + 1}. ${key._id}${project}`)
          })
        }
      } catch (error) {
        console.log('error', error)
      }
    })

  // wapiworld keys get [keyId]
  command
    .command('get [keyId]')
    .description('get keys (raw JSON), or a single key by id')
    .action(async keyId => {
      try {
        await ensureAuth()

        if (keyId) {
          const key = await get({ url: `keys/${keyId}` })

          if (key) {
            console.log(inspect(key, { colors: true, depth: null }))
          } else {
            console.log('Key not found')
          }
        } else {
          const keys = await get({ url: 'keys' })
          console.log(inspect(keys, { colors: true, depth: null }))
        }
      } catch (error) {
        console.log('error', error)
      }
    })

  // wapiworld keys read <keyId>
  command
    .command('read <keyId>')
    .description('read a key formatted for the terminal')
    .action(async keyId => {
      try {
        await ensureAuth()

        const key = await get({ url: `keys/${keyId}` })

        if (!key) {
          console.log('Key not found')

          return
        }

        const bold = text => `\x1b[1m${text}\x1b[0m`
        const cyan = text => `\x1b[36m${text}\x1b[0m`

        console.log()
        console.log(bold(key._id))
        console.log()

        const fields = []
        if (key.organizationId) fields.push(`${cyan('organizationId')}  ${key.organizationId}`)
        if (key.projectId) fields.push(`${cyan('projectId')}  ${key.projectId}`)
        if (key.secret) fields.push(`${cyan('secret')}  ${key.secret}`)
        if (key.demo != null) fields.push(`${cyan('demo')}  ${key.demo}`)
        if (key.creationTime) fields.push(`${cyan('created')}  ${key.creationTime}`)
        if (key.lastEditTime) fields.push(`${cyan('edited')}   ${key.lastEditTime}`)

        if (fields.length > 0) {
          fields.forEach(line => console.log(line))
        }

        console.log()
      } catch (error) {
        console.log('error', error)
      }
    })

  return command
}

module.exports = keysCommand
