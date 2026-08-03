/* Copyright 2013 - 2026 Waiterio LLC */
const commander = require('commander')
const inquirer = require('inquirer')
const {
  withJson,
  printJson,
  fail,
} = require('@monorepool/agentfirst/output.js')
const ensureAuth = require('./ensureAuth.js')
const getConfig = require('./getConfig.js')
const sendMessage = require('@wapiworld/client/sendMessage.js').default

function isInteractive() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY)
}

function sendCommand() {
  const command = new commander.Command('send')
  command.description('send a WhatsApp message')
  withJson(command)
    .option('--instanceId [instanceId]', 'instance id')
    .option('--chatId [chatId]', 'chat id or phone number (e.g. +1234567890)')
    .option('--content [content]', 'message content')
    .action(async options => {
      try {
        await ensureAuth()

        const config = getConfig()

        // Prompt only on a real terminal and never in json mode — a headless
        // caller with a missing option must fail fast below, not hang on a
        // question it cannot answer.
        const canPrompt = isInteractive() && !options.json

        const answers = await inquirer.prompt([
          {
            name: 'instanceId',
            message: 'Instance ID:',
            when: canPrompt && !options.instanceId && !config?.instanceId,
          },
          {
            name: 'chatId',
            message: 'Chat ID or phone number:',
            when: canPrompt && !options.chatId,
          },
          {
            name: 'content',
            message: 'Message:',
            when: canPrompt && !options.content,
          },
        ])

        const instanceId = options.instanceId || config?.instanceId || answers.instanceId
        const chatId = options.chatId || answers.chatId
        const content = options.content || answers.content

        if (!instanceId) {
          fail(
            new Error(
              'Instance ID is required. Use --instanceId or set it in wapiworld.json',
            ),
            { json: options.json },
          )

          return
        }

        if (!chatId) {
          fail(new Error('Chat ID or phone number is required. Use --chatId'), {
            json: options.json,
          })

          return
        }

        if (!content) {
          fail(new Error('Message content is required. Use --content'), {
            json: options.json,
          })

          return
        }

        const result = await sendMessage({ instanceId, chatId, content })

        if (options.json) {
          printJson({
            ok: true,
            id: result?.key?.id || null,
            instanceId,
            chatId,
          })

          return
        }

        console.log('Message sent successfully')

        if (result && result.key) {
          console.log(`Message ID: ${result.key.id}`)
        }
      } catch (error) {
        fail(error, { json: options.json })
      }
    })

  return command
}

module.exports = sendCommand
