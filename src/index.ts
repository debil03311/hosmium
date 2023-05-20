import 'dotenv/config'
import { InteractionType } from 'discord.js'

import client from './ExtendedClient'
import commands from './SlashCommands'
import { timestamp } from './Utils'
import BotConfig from './BotConfig'

// * PHP SERVER

// const phpServer = await PhpServer({
//   port: Number(process.env.PHP_SERVER_PORT) || 63317,
//   router: './aes.php'
// })

// console.log(phpServer.url)

// * DISCORD

client.login(process.env.DISCORD_BOT_TOKEN)

client.on('ready', async ()=> {
  console.log(timestamp(), `${client.user.tag} is online`)
  await client.loadSlashCommands()
})

client.on('interactionCreate', async (interaction)=> {
  // * SLASH COMMANDS
  if (interaction.type == InteractionType.ApplicationCommand) {
    const discordUser = interaction.user.tag
    const commandName = interaction.command.name

    // Try to find the corresponding command
    const command = commands.find(
      (command)=> command.meta.name === commandName)

    // If no command was found then something terrible has happened
    // I for one blame the discord.js devs :3
    if (!command)
      return console.warn(timestamp(), `${discordUser} ran invalid command ${commandName}`)


    // Log dictord user action to the console
    console.log(timestamp(), `${discordUser} ran ${commandName}`)

    try {
      // const commandResult =
      await command.execute(interaction)
    }
    catch(error) {
      console.error(error)

      interaction.reply({
        embeds: [{
          color: BotConfig.colors.failure,
          title: '❌ Something went wrong',
          description: "```arm\n" + error + "```",
          footer: {
            text: `${commandName}@${new Date().getTime()}`,
          },
        }],
        ephemeral: Boolean(interaction.options.get('hidden')?.value),
      })
    }
  }
})