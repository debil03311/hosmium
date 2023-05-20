import {
  Embed,
  ApplicationCommandOptionType as OptionTypes,
} from 'discord.js'

import BotConfig from '../../BotConfig'
import { InternalSlashCommand } from '../../Types'


const DICE_FACES = '⚀⚁⚂⚃⚄⚅'


export default {
  meta: {
    name: 'dice',
    description: 'Roll four-sided die and see what you get',

    options: [
      {
        name: 'amount',
        description: `How many die to roll (default: 2)`,
        type: OptionTypes.Number,
        required: false,

        // Create choices from 1 to N
        choices: new Array(6)
          .fill(null)
          .map((_, index)=> ({
            name:  index + 1,
            value: index + 1,
          }))
      },
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

    const rolls = []
    const dieCount = interaction.options.get('amount')?.value as number || 2

    for (let rollIndex = 0; rollIndex < dieCount; rollIndex++) {
      const roll = Math.floor(Math.random() * 6)

      rolls.push({
        dice: DICE_FACES[roll],
        value: roll + 1,
      })
    }

    const die = rolls
      .map((roll)=> roll.dice)
      .join('')

    const values = rolls
      .map((roll)=> roll.value)
      .join(' ')

    const sum = rolls
      .map((roll)=> roll.value)
      .reduce((previous, current)=> previous + current)

    const replyEmbed = {
      color: BotConfig.colors.brand,
      title: `🥁 ${interaction.user.tag} rolls...`,
      description: `${die} (${values})\nTotal: ${sum}`,
    } as Embed

    await interaction.reply({
      embeds: [replyEmbed],
      ephemeral: isHiddenReply,
    })
  },
} as InternalSlashCommand