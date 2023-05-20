import {
  ApplicationCommandData,
  CommandInteraction
} from 'discord.js'

export interface InternalSlashCommand {
  meta: ApplicationCommandData
  execute(interaction: CommandInteraction): any
  update(): any
}