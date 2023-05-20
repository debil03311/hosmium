import {
  ApplicationCommandOptionType as OptionTypes,
} from 'discord.js'

import BotConfig from '../../BotConfig'
import { InternalSlashCommand } from '../../Types'


interface UnitData {
  unit: string
  divisor: number
}
const TIME_UNITS: {[unit: string]: UnitData} = {
  milliseconds: {
    unit: 'ms',
    divisor: 1,
  },
  seconds: {
    unit: 's',
    divisor: 1000,
  },
  minutes: {
    unit: 'm',
    divisor: 1000 * 60,
  },
  hours: {
    unit: 'h',
    divisor: 1000 * 60 * 60,
  },
  days: {
    unit: 'd',
    divisor: 1000 * 60 * 60 * 24,
  },
  weeks: {
    unit: 'w',
    divisor: 1000 * 60 * 60 * 24 * 7,
  },
}


export default {
  meta: {
    name: 'ping',
    description: 'Un momento, señor.',

    options: [
      {
        name: 'unit',
        description: 'The measure of time for the response to be measured in.',
        type: OptionTypes.String,
        required: false,

        choices: Object.keys(TIME_UNITS)
          .map((unit)=> ({
            name: unit,
            value: unit,
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

    const currentUnix = new Date().getTime()
    const clientUnix = interaction.createdTimestamp

    // Ping time in milliseconds
    const milliseconds = currentUnix - clientUnix

    // Get the key name from the command option if any
    // Otherwise default to ms
    const unitKey = interaction.options.get('unit')?.value as string
                 || 'milliseconds'

    const unitData = TIME_UNITS[unitKey]

    // Final converted time with unit
    const finalTime = (milliseconds / unitData.divisor) + unitData.unit

    await interaction.reply({
      content: `${BotConfig.emoji.mxneco} ${finalTime}, señor.`,
      ephemeral: isHiddenReply,
    })
  },
} as InternalSlashCommand