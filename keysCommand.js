/* Copyright 2013 - 2026 Waiterio LLC */
const { inspect } = require('node:util')
const commander = require('commander')
const {
  withJson,
  printJson,
  fail,
} = require('@monorepool/agentfirst/output.js')
const ensureAuth = require('./ensureAuth.js')
const get = require('@wapiworld/client/get.js').default

function keysCommand() {
  const command = new commander.Command('keys')
  command.description('manage API keys')

  // wapiworld keys list
  withJson(command.command('list'))
    .description('list API keys')
    .action(async options => {
      try {
        await ensureAuth()

        const keys = await get({ url: 'keys' })

        if (options.json) {
          // Redact the secrets: `keys list` never printed them for humans,
          // and json mode must not widen what the command reveals.
          printJson(keys.map(({ secret: _, ...key }) => key))
        } else if (keys.length === 0) {
          console.log('No keys found')
        } else {
          console.log(`Found ${keys.length} key(s):`)
          keys.forEach((key, index) => {
            const project = key.projectId ? ` (project: ${key.projectId})` : ''
            console.log(`${index + 1}. ${key._id}${project}`)
          })
        }
      } catch (error) {
        fail(error, { json: options.json })
      }
    })

  // wapiworld keys get [keyId]
  withJson(command.command('get [keyId]'))
    .description('get keys (raw JSON), or a single key by id')
    .action(async (keyId, options) => {
      try {
        await ensureAuth()

        if (keyId) {
          const key = await get({ url: `keys/${keyId}` })

          if (!key) {
            fail(new Error('Key not found'), { json: options.json })
          } else if (options.json) {
            printJson(key)
          } else {
            console.log(inspect(key, { colors: true, depth: null }))
          }
        } else {
          const keys = await get({ url: 'keys' })

          if (options.json) {
            printJson(keys)
          } else {
            console.log(inspect(keys, { colors: true, depth: null }))
          }
        }
      } catch (error) {
        fail(error, { json: options.json })
      }
    })

  // wapiworld keys read <keyId>
  withJson(command.command('read <keyId>'))
    .description('read a key formatted for the terminal')
    .action(async (keyId, options) => {
      try {
        await ensureAuth()

        const key = await get({ url: `keys/${keyId}` })

        if (!key) {
          fail(new Error('Key not found'), { json: options.json })

          return
        }

        if (options.json) {
          printJson(key)

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
        fail(error, { json: options.json })
      }
    })

  return command
}

module.exports = keysCommand
