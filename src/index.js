// Load environment variables (tokens)
require('dotenv').config();

// Imports
const { Client, Intents } = require("discord.js");
const { readFileSync } = require("fs");

// Globals
global.config = require("yaml")
  .parse(readFileSync(`${__dirname}/config.yml`, "utf-8"))

global.utils = require(`${__dirname}/utils.js`);
global.emoji = require(`${__dirname}/commands/data/emoji.json`);

// Local imports
const commands = require(`${__dirname}/commands.js`);
const makeMinecraftServerEmbed = require(
  `${__dirname}/commands/mc-ping.js`).makeEmbed;

// Grant the bot the necessary permissions
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ]
});

client.once("ready", async (client)=> {
  console.log(`[${global.utils.timestamp()}] Bot is online`);
  console.log(`[${global.utils.timestamp()}] [COMMANDS] Loading...`);

  // Get the objects resuled from SlashCommandBuilder of every command
  const commandData = commands.map((command)=> command.data);

  // Load the bot's commands
  await client.application.commands.set(commandData);
  console.log(`[${global.utils.timestamp()}] [COMMANDS] Finished`);

  client.user.setActivity({
    type: "WATCHING",
    name: "over 2 billion servers!",
  });
});

// If any of these patterns are matched in a
// user-sent message, the bot will automatically
// pin it. The patterns can also be strings.

const messagePinTriggers = [
  /pip(e|ing)/
]

client.on("messageCreate", (message)=> {
  if (message.author.bot)
    return;

  for (const pattern of messagePinTriggers)
    if (message.content.match(pattern))
      message.pin().catch(console.error);
});

// For commands, buttons and whatnot
client.on("interactionCreate", async (interaction)=> {
  console.log(interaction);

  if (interaction.user.bot)
    return;

  if (interaction.customId === "minecraft_server_refresh") {
    // I can't do anything about discord's
    // 3 second timeout unfortunately
    interaction.deferUpdate();

    const newEmbed = await makeMinecraftServerEmbed(
      ...interaction.message.embeds[0].title.split(":"));

    interaction.message.edit({ embeds: [newEmbed] });
  }

  if (interaction.isCommand()) {
    // Ok bro actually fuck subcommands and this
    // whole stupid ass ass interaction system

    const command = commands.find((command)=>
      command.data.name === interaction.commandName)

    return command.execute(interaction, interaction.options)
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);