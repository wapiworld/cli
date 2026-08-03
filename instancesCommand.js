/* Copyright 2013 - 2026 Waiterio LLC */
const { inspect } = require('node:util')
const commander = require('commander')
const ensureAuth = require('./ensureAuth.js')
const getInstances = require('@wapiworld/client/getInstances.js').default

function instancesCommand() {
  const command = new commander.Command('instances')
  command.description('manage instances')

  // wapiworld instances list
  command
    .command('list')
    .description('list instances')
    .action(async () => {
      try {
        await ensureAuth()

        const instances = await getInstances()

        if (instances.length === 0) {
          console.log('No instances found')
        } else {
          console.log(`Found ${instances.length} instance(s):`)
          instances.forEach((instance, index) => {
            const name = instance.whatsappAccountName || instance.phone || instance._id
            const status = instance.status ? ` [${instance.status}]` : ''
            const phone = instance.phone && instance.whatsappAccountName ? ` (${instance.phone})` : ''
            console.log(`${index + 1}. ${name}${phone}${status} (${instance._id})`)
          })
        }
      } catch (error) {
        console.log('error', error)
      }
    })

  // wapiworld instances get [instanceId]
  command
    .command('get [instanceId]')
    .description('get instances (raw JSON), or a single instance by id')
    .action(async instanceId => {
      try {
        await ensureAuth()

        if (instanceId) {
          const instances = await getInstances()
          const instance = instances.find(i => i._id === instanceId)

          if (instance) {
            console.log(inspect(instance, { colors: true, depth: null }))
          } else {
            console.log('Instance not found')
          }
        } else {
          const instances = await getInstances()
          console.log(inspect(instances, { colors: true, depth: null }))
        }
      } catch (error) {
        console.log('error', error)
      }
    })

  // wapiworld instances read <instanceId>
  command
    .command('read <instanceId>')
    .description('read an instance formatted for the terminal')
    .action(async instanceId => {
      try {
        await ensureAuth()

        const instances = await getInstances()
        const instance = instances.find(i => i._id === instanceId)

        if (!instance) {
          console.log('Instance not found')

          return
        }

        const dim = text => `\x1b[2m${text}\x1b[0m`
        const bold = text => `\x1b[1m${text}\x1b[0m`
        const cyan = text => `\x1b[36m${text}\x1b[0m`
        const green = text => `\x1b[32m${text}\x1b[0m`
        const yellow = text => `\x1b[33m${text}\x1b[0m`

        console.log()
        const name = instance.whatsappAccountName || instance.phone || instance._id
        console.log(bold(name))
        const meta = [instance._id]
        if (instance.status) {
          const statusColor = instance.status === 'READY' ? green : yellow
          meta.push(statusColor(instance.status))
        }
        console.log(dim(meta[0]) + (meta[1] ? `  ${meta[1]}` : ''))
        console.log()

        const fields = []
        if (instance.phone) fields.push(`${cyan('phone')}  ${instance.phone}`)
        if (instance.whatsappAccountName) fields.push(`${cyan('whatsappAccountName')}  ${instance.whatsappAccountName}`)
        if (instance.status) fields.push(`${cyan('status')}  ${instance.status}`)
        if (instance.projectId) fields.push(`${cyan('projectId')}  ${instance.projectId}`)
        if (instance.organizationId) fields.push(`${cyan('organizationId')}  ${instance.organizationId}`)
        if (instance.webhookUrl) fields.push(`${cyan('webhookUrl')}  ${instance.webhookUrl}`)
        if (instance.webhookEvents && instance.webhookEvents.length > 0) {
          fields.push(`${cyan('webhookEvents')}  ${instance.webhookEvents.join(', ')}`)
        }
        if (instance.qrcode) fields.push(`${cyan('qrcode')}  ${instance.qrcode}`)
        if (instance.creationTime) fields.push(`${cyan('created')}  ${instance.creationTime}`)
        if (instance.lastEditTime) fields.push(`${cyan('edited')}   ${instance.lastEditTime}`)

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

module.exports = instancesCommand
