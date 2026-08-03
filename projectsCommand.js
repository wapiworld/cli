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

function projectsCommand() {
  const command = new commander.Command('projects')
  command.description('manage projects')

  // wapiworld projects list
  withJson(command.command('list'))
    .description('list projects')
    .action(async options => {
      try {
        await ensureAuth()

        const projects = await get({ url: 'projects' })

        if (options.json) {
          printJson(projects)
        } else if (projects.length === 0) {
          console.log('No projects found')
        } else {
          console.log(`Found ${projects.length} project(s):`)
          projects.forEach((project, index) => {
            const name = project.name || project._id
            console.log(`${index + 1}. ${name} (${project._id})`)
          })
        }
      } catch (error) {
        fail(error, { json: options.json })
      }
    })

  // wapiworld projects get [projectId]
  withJson(command.command('get [projectId]'))
    .description('get projects (raw JSON), or a single project by id')
    .action(async (projectId, options) => {
      try {
        await ensureAuth()

        if (projectId) {
          const project = await get({ url: `projects/${projectId}` })

          if (!project) {
            fail(new Error('Project not found'), { json: options.json })
          } else if (options.json) {
            printJson(project)
          } else {
            console.log(inspect(project, { colors: true, depth: null }))
          }
        } else {
          const projects = await get({ url: 'projects' })

          if (options.json) {
            printJson(projects)
          } else {
            console.log(inspect(projects, { colors: true, depth: null }))
          }
        }
      } catch (error) {
        fail(error, { json: options.json })
      }
    })

  // wapiworld projects read <projectId>
  withJson(command.command('read <projectId>'))
    .description('read a project formatted for the terminal')
    .action(async (projectId, options) => {
      try {
        await ensureAuth()

        const project = await get({ url: `projects/${projectId}` })

        if (!project) {
          fail(new Error('Project not found'), { json: options.json })

          return
        }

        if (options.json) {
          printJson(project)

          return
        }

        const dim = text => `\x1b[2m${text}\x1b[0m`
        const bold = text => `\x1b[1m${text}\x1b[0m`
        const cyan = text => `\x1b[36m${text}\x1b[0m`

        console.log()
        const name = project.name || project._id
        console.log(bold(name))
        console.log(dim(project._id))
        console.log()

        const fields = []
        if (project.organizationId) fields.push(`${cyan('organizationId')}  ${project.organizationId}`)
        if (project.countryCode) fields.push(`${cyan('countryCode')}  ${project.countryCode}`)
        if (project.firstDayOfTheWeek) fields.push(`${cyan('firstDayOfTheWeek')}  ${project.firstDayOfTheWeek}`)
        if (project.appointmentDuration != null) fields.push(`${cyan('appointmentDuration')}  ${project.appointmentDuration}`)
        if (project.creationTime) fields.push(`${cyan('created')}  ${project.creationTime}`)
        if (project.lastEditTime) fields.push(`${cyan('edited')}   ${project.lastEditTime}`)

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

module.exports = projectsCommand
