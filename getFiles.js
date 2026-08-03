/* Copyright 2013 - 2026 Waiterio LLC */
const fs = require('fs-extra')
const path = require('node:path')

function getFiles_(dir) {
  let subdirs = fs.readdirSync(dir)
  // Skip node_modules and dot-dirs/files (.git, .claude, …). Descending into
  // dot-dirs is pointless for config discovery and blows up on the broken
  // symlinks that live in things like .claude/worktrees.
  subdirs = subdirs.filter(
    file => !file.startsWith('node_modules') && !file.startsWith('.'),
  )
  const files = subdirs.map(subdir => {
    const resource = path.resolve(dir, subdir)
    let stats
    try {
      stats = fs.statSync(resource)
    } catch {
      // Skip anything we can't stat (e.g. a broken symlink).
      return []
    }
    return stats.isDirectory() ? getFiles(resource) : resource
  })
  return files.reduce((a, f) => a.concat(f), [])
}

function getFiles(dir) {
  dir = dir || '.'
  let files = getFiles_(dir)

  files = files
    .map(file => file.replace(path.resolve('.'), ''))
    .filter(file => !file.startsWith('/.'))

  return files
}

module.exports = getFiles
