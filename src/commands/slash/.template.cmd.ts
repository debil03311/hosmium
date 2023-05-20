import {
  Embed,
  ApplicationCommandOptionType as OptionTypes,
} from 'discord.js'

import BotConfig from '../../BotConfig'
import { InternalSlashCommand } from '../../Types'


export default {
  meta: {
    name: 'command_name',
    description: 'Example of a slash command.',

    options: [
      {
        name: 'hidden',
        description: `Only you will see the bot's reply`,
        type: OptionTypes.String,
        required: false,

        choices: [
          {
            name: 'yes',
            value: 'true',
          }
        ]
      }
    ]
  },

  async execute(interaction) {
    const isHiddenReply = Boolean(interaction.options.get('hidden')?.value)

    const replyEmbed = {
      color: BotConfig.colors.brand,
      title: 'Embed example',
      description: `Example of an embed`,
    } as Embed

    await interaction.reply({
      content: `Simple text example`,
      embeds: [replyEmbed],
      ephemeral: isHiddenReply,
    })
  },

  update() {
    // 
  },
} as InternalSlashCommand