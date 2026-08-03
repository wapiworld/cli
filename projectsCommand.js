/* Copyright 2013 - 2026 Waiterio LLC */
const { inspect } = require('node:util')
const commander = require('commander')
const ensureAuth = require('./ensureAuth.js')
const get = require('@wapiworld/client/get.js').default

function projectsCommand() {
  const command = new commander.Command('projects')
  command.description('manage projects')

  // wapiworld projects list
  command
    .command('list')
    .description('list projects')
    .action(async () => {
      try {
        await ensureAuth()

        const projects = await get({ url: 'projects' })

        if (projects.length === 0) {
          console.log('No projects found')
        } else {
          console.log(`Found ${projects.length} project(s):`)
          projects.forEach((project, index) => {
            const name = project.name || project._id
            console.log(`${index + 1}. ${name} (${project._id})`)
          })
        }
      } catch (error) {
        console.log('error', error)
      }
    })

  // wapiworld projects get [projectId]
  command
    .command('get [projectId]')
    .description('get projects (raw JSON), or a single project by id')
    .action(async projectId => {
      try {
        await ensureAuth()

        if (projectId) {
          const project = await get({ url: `projects/${projectId}` })

          if (project) {
            console.log(inspect(project, { colors: true, depth: null }))
          } else {
            console.log('Project not found')
          }
        } else {
          const projects = await get({ url: 'projects' })
          console.log(inspect(projects, { colors: true, depth: null }))
        }
      } catch (error) {
        console.log('error', error)
      }
    })

  // wapiworld projects read <projectId>
  command
    .command('read <projectId>')
    .description('read a project formatted for the terminal')
    .action(async projectId => {
      try {
        await ensureAuth()

        const project = await get({ url: `projects/${projectId}` })

        if (!project) {
          console.log('Project not found')

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
        console.log('error', error)
      }
    })

  return command
}

module.exports = projectsCommand
