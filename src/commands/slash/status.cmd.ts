import {
  Embed,
  ApplicationCommandOptionType as OptionTypes,
} from 'discord.js'

import client from '../../ExtendedClient'
import BotConfig from '../../BotConfig'
import { InternalSlashCommand } from '../../Types'


export default {
  meta: {
    name: 'status',
    description: `See what's cooking`,

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

    const currentUnix = new Date().getTime()
    const clientUnix = interaction.createdTimestamp
    const ping = currentUnix - clientUnix + 'ms'

    const clientUptime = {
      miliseconds: Math.floor(client.uptime) % 1000,
      seconds:     Math.floor(client.uptime / 1000) % 60,
      minutes:     Math.floor(client.uptime / 1000 / 60) % 60,
      hours:       Math.floor(client.uptime / 1000 / 60 / 60) % 24,
      days:        Math.floor(client.uptime / 1000 / 60 / 60 / 24) % 7,
    }

    const replyEmbed = {
      color: BotConfig.colors.brand,

      fields: [
        {
          name: '☀️ Uptime',
          value: `${clientUptime.days}d ${clientUptime.hours}h ${clientUptime.minutes}m`,
          inline: true,
        },{
          name: '⏲️ Latency',
          value: ping,
          inline: true,
        },{
          name: '🔥 Memory',
          value: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
          inline: true,
        },{
          name: '🎂 Birthday',
          value: client.user.createdAt.toLocaleDateString('ja-JP'),
          inline: true,
        },{
          name: '🏘️ Servers',
          value: client.guilds.cache.size.toString(),
          inline: true,
        },{
          name: '⬢   Node',
          value: process.version,
          inline: true,
        }
      ],

      footer: {
        text: client.user.tag,
        iconURL: BotConfig.images.brand,
      }
    } as Embed

    await interaction.reply({
      embeds: [replyEmbed],
      ephemeral: isHiddenReply,
    })
  },
} as InternalSlashCommand