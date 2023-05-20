import { globSync } from 'glob'

import { InternalSlashCommand } from './Types'
import { flipSlashes, timestamp } from './Utils'

const slashCommands: InternalSlashCommand[] = []

// Paths returned by glob on windows use backslashes by default
// even though glob only supports fowardslashes... Gotta fix that.
const singleCommandPaths = globSync('src/commands/slash/[!.]*.cmd.?s')
  .map((path)=> flipSlashes(path, 'FORWARDS'))

for (const relativePath of singleCommandPaths) {
  console.log(timestamp(), `Importing slash command: ${relativePath}...`)

  // Fix slashes again
  const absolutePath = flipSlashes(
    `${__dirname}/../${relativePath}`,
    'FORWARDS')

  const command = require(absolutePath).default as InternalSlashCommand
  // const command = (await import(absolutePath)).default as InternalSlashCommand
  // console.log(command)

  if (!command) {
    console.warn(relativePath, 'appears to be empty, skipping...')
    continue
  }

  slashCommands.push(command)
}

// TODO: Implement subcommands
// TODO: IDEA: Commands can either be a single .ts file or a folder if it has subcommands

// for (let directory of commandDirectories) {
//   // Matches either @.cmd.ts or @.cmd.js
//   // Glob returns an array so try to store the first item if any
//   const mainCommandGlob = globSync(`${directory}/@.cmd.?s`)

//   const mainCommandPath = flipSlashes(mainCommandGlob?.[0], 'FORWARDS')

//   // const subCommandPaths = globSync(`${directory}/[!@]*.cmd.?s`)
//   //   .map((path)=> flipSlashes(path, 'FORWARDS'))
  
//   // Fix slashes again
//   const absoluteMainPath = flipSlashes(
//     `${__dirname}/../${mainCommandPath}`,
//     'FORWARDS')

//   // Import main command and push it to the container array
//   const command = require(absoluteMainPath).default as InternalSlashCommand
//   slashCommands.push(command)
// }


export default slashCommands