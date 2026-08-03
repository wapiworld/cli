/* Copyright 2013 - 2026 Waiterio LLC */
const commander = require('commander')
const inquirer = require('inquirer')
const ensureAuth = require('./ensureAuth.js')
const getConfig = require('./getConfig.js')
const sendMessage = require('@wapiworld/client/sendMessage.js').default

function sendCommand() {
  const command = new commander.Command('send')
  command.description('send a WhatsApp message')
  command
    .option('--instanceId [instanceId]', 'instance id')
    .option('--chatId [chatId]', 'chat id or phone number (e.g. +1234567890)')
    .option('--content [content]', 'message content')
    .action(async options => {
      try {
        await ensureAuth()

        const config = getConfig()

        const answers = await inquirer.prompt([
          {
            name: 'instanceId',
            message: 'Instance ID:',
            when: !options.instanceId && !config?.instanceId,
          },
          {
            name: 'chatId',
            message: 'Chat ID or phone number:',
            when: !options.chatId,
          },
          {
            name: 'content',
            message: 'Message:',
            when: !options.content,
          },
        ])

        const instanceId = options.instanceId || config?.instanceId || answers.instanceId
        const chatId = options.chatId || answers.chatId
        const content = options.content || answers.content

        if (!instanceId) {
          console.log('Instance ID is required. Use --instanceId or set it in wapiworld.json')

          return
        }

        if (!chatId) {
          console.log('Chat ID or phone number is required. Use --chatId')

          return
        }

        if (!content) {
          console.log('Message content is required. Use --content')

          return
        }

        const result = await sendMessage({ instanceId, chatId, content })
        console.log('Message sent successfully')

        if (result && result.key) {
          console.log(`Message ID: ${result.key.id}`)
        }
      } catch (error) {
        console.log('error', error)
      }
    })

  return command
}

module.exports = sendCommand
