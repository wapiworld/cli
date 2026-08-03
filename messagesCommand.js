/* Copyright 2013 - 2026 Waiterio LLC */
const { inspect } = require('node:util')
const commander = require('commander')
const ensureAuth = require('./ensureAuth.js')
const getConfig = require('./getConfig.js')
const getMessages = require('@wapiworld/client/getMessages.js').default

// Recording is opt-in per project/instance/chat, so an empty list is the
// expected answer for most instances rather than a sign something is broken.
// Say so, otherwise every user's first run looks like a bug.
const RECORDING_OFF_HINT =
  'No recorded messages. Wapiworld only stores message content for chats where recording is enabled — check the instance in the dashboard.'

const resolveInstanceId = (options, config) =>
  options.instanceId || config?.instanceId

function messagesCommand() {
  const command = new commander.Command('messages')
  command.description('read recorded messages')

  // wapiworld messages list
  command
    .command('list', { isDefault: true })
    .description('list recorded messages (printed oldest-first)')
    .option('--instanceId [instanceId]', 'instance id')
    .option('--chatId [chatId]', 'chat id or phone number (e.g. +1234567890)')
    .option('--limit [limit]', 'maximum messages to return (default 100)')
    .option('--skip [skip]', 'messages to skip')
    .option('--startTime [startTime]', 'ISO timestamp, inclusive lower bound')
    .option('--endTime [endTime]', 'ISO timestamp, exclusive upper bound')
    .action(async options => {
      try {
        await ensureAuth()

        const config = getConfig()
        const instanceId = resolveInstanceId(options, config)

        if (!instanceId) {
          console.log(
            'Instance ID is required. Use --instanceId or set it in wapiworld.json',
          )

          return
        }

        const messages = await getMessages({ ...options, instanceId })

        if (messages.length === 0) {
          console.log(RECORDING_OFF_HINT)

          return
        }

        console.log(`Found ${messages.length} message(s):`)

        // Oldest first when printing: a conversation reads top to bottom, even
        // though the API returns newest first for pagination.
        messages
          .slice()
          .reverse()
          .forEach(message => {
            const when = message.timestamp || message.creationTime || ''
            const who =
              message.direction === 'outbound'
                ? 'me'
                : message.name || message.chatId
            console.log(`[${when}] ${who}: ${message.content}`)
          })
      } catch (error) {
        console.log('error', error)
      }
    })

  // wapiworld messages get
  command
    .command('get')
    .description('get recorded messages (raw JSON)')
    .option('--instanceId [instanceId]', 'instance id')
    .option('--chatId [chatId]', 'chat id or phone number')
    .option('--limit [limit]', 'maximum messages to return (default 100)')
    .action(async options => {
      try {
        await ensureAuth()

        const config = getConfig()
        const instanceId = resolveInstanceId(options, config)

        if (!instanceId) {
          console.log(
            'Instance ID is required. Use --instanceId or set it in wapiworld.json',
          )

          return
        }

        const messages = await getMessages({ ...options, instanceId })

        console.log(inspect(messages, { colors: true, depth: null }))
      } catch (error) {
        console.log('error', error)
      }
    })

  return command
}

module.exports = messagesCommand
