import {
  ApplicationCommandOptionType as OptionTypes,
} from 'discord.js'

import { InternalSlashCommand } from '../../Types'


export default {
  meta: {
    name: 'eval',
    description: 'Aw hell naw',

    options: [
      {
        name: 'expression',
        description: `JavaScript code`,
        type: OptionTypes.String,
        required: false,
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

    const expression = interaction.options.get('expression')?.value as string

    if (!expression)
      throw new Error(`Expression can't be empty.`)

    const evalResult = eval(expression)

    await interaction.reply({
      content: '```js\n' + evalResult + '```',
      ephemeral: isHiddenReply,
    })
  },
} as InternalSlashCommand