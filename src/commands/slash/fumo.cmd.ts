import {
  Embed,
  ApplicationCommandOptionType as OptionTypes,
} from 'discord.js'

import { FumoClient } from 'fumo-api'

import BotConfig from '../../BotConfig'
import { InternalSlashCommand } from '../../Types'


const VIDEO_FORMATS = ['mp4', 'webm', 'mkv', 'mov']

const fumoClient = new FumoClient({
  endpoint: ''
})


export default {
  meta: {
    name: 'fumo',
    description: 'ᗜˬᗜ',

    options: [
      {
        name: 'id',
        description: `Retrieve a specific fumo by its media ID`,
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

    const fumoId = interaction.options.get('id')?.value as string

    const fumo = (fumoId)
      ? await fumoClient.specific(fumoId)
      : await fumoClient.random()

    console.log(fumo)

    const fileExtension = fumo.URL.match(/\.(.*?)$/)[1]
    const mediaType = VIDEO_FORMATS.includes(fileExtension) ? 'video' : 'image'

    const replyEmbed = {
      color: BotConfig.colors.brand,
      title: 'Open Image',
      description: `${BotConfig.emoji.cirnofancy} Your fumo, good sir.`,
      url: fumo.URL,

      // idfk man it just works
      [mediaType as 'image']: {
        url: fumo.URL,
      },

      footer: {
        text: `ID: ${fumo._id}`,
      }
    } as Embed

    await interaction.reply({
      embeds: [replyEmbed],
      ephemeral: isHiddenReply,
    })
  },
} as InternalSlashCommand