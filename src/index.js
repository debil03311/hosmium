// Load environment variables (tokens)
require('dotenv').config();

// Imports
const { Client, GatewayIntentBits } = require("discord.js");
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

// OpenAI
const { Configuration, OpenAIApi } = require("openai");

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
}));

// Grant the bot the necessary permissions
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
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

client.on("messageCreate", async (message)=> {
  if (message.author.bot)
    return;

  for (const pattern of messagePinTriggers)
    if (message.content.match(pattern))
      message.pin().catch(console.error);

  // If bot is mentioned, reply with OpenAI response
  if (process.env.OPENAI_API_KEY
  &&  process.env.OPENAI_ORGANIZATION_ID
  &&  message.content.startsWith(client.user)) {
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      max_tokens: 256,
      temperature: 0.2,
      // remove bot mention
      prompt: message.content.slice(client.user.id.length + 4),
    });

    message.reply({
      content: response.data.choices[0].text.trim().slice(0, 2000),
      allowedMentions: { repliedUser: false },
    });
  }
});

// For commands, buttons and whatnot
client.on("interactionCreate", async (interaction)=> {
  if (interaction.user.bot)
    return;

  console.log(interaction);

  if (interaction.customId === "minecraft_server_refresh") {
    // I can't do anything about discord's
    // 3 second timeout unfortunately
    interaction.deferUpdate();

    const newEmbed = await makeMinecraftServerEmbed(
      ...interaction.message.embeds[0].title.split(":"));

    interaction.message.edit({ embeds: [newEmbed] });
  }

  if (interaction.isChatInputCommand()) {
    // Ok bro actually fuck subcommands and this
    // whole stupid ass ass interaction system
    // Update: they got even worse somehow

    const command = commands.find((command)=>
      command.data.name === interaction.commandName)

    return command.execute(interaction, interaction.options)
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);