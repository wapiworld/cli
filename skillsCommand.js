/* Copyright 2013 - 2026 Waiterio LLC */
const agentfirstSkillsCommand = require('@monorepool/agentfirst/skillsCommand.js')

// The shared factory scans for bundled SKILL.md files relative to
// `baseDirectory`. Passing this file's __dirname preserves the historical
// candidates in both layouts: <cli>/skills next to index.js in dev after a
// build, <cli>/skills as ../skills from the published dist/index.js, and the
// canonical wapiworld/skills/public/skills workspace as the monorepo dev
// fallback before any build.
module.exports = function skillsCommand() {
  return agentfirstSkillsCommand({ baseDirectory: __dirname })
}
