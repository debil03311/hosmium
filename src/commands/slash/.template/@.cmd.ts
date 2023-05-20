import {
  Embed,
  ApplicationCommandOptionType as OptionTypes,
} from 'discord.js'

import BotConfig from '../../../BotConfig'
import { InternalSlashCommand } from '../../../Types'


export default {
  meta: {
    name: 'example_command',
    description: 'Example of a slash command.',

    options: [
      {
        name: 'string_option',
        description: 'Example of a command option.',
        type: OptionTypes.String,
        required: false,
        choices: [
          {
            name: 'Choice A',
            value: 'this is invisible to the user',
          }
        ]
      },
    ]
  },

  async execute(interaction) {
    const replyEmbed = {
      color: BotConfig.colors.brand,
      title: 'Embed example',
      description: `Example of an embed`,
    } as Embed

    await interaction.reply({
      embeds: [replyEmbed],
    })
  },

  update() {
    // 
  },
} as InternalSlashCommand