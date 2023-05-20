import { Client } from 'discord.js'
import slashCommands from './SlashCommands'

class ConfiguredClient extends Client {
  constructor() {
    super({
      intents: [
        'Guilds',
        'GuildMessages',
        'GuildMessageReactions',
      ],
    })
  }

  async loadSlashCommands() {
    const slashCommandMeta = slashCommands
      .map((command)=> command.meta)

    await this.application.commands.set(slashCommandMeta)
  }
}

// Prevents duplicate clients from being created
export default new ConfiguredClient()