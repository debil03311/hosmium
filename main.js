const { Client, Intents } = require('discord.js');
const { parseArgsStringToArgv } = require('string-argv');

const { commands } = require("./commands.js");
const config = require('./config.json');

// Initialize bot client with necessary permissions
const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]
});

const stfuFilter =
    /[\u4E00-\u9FBF\u3040-\u309F\u30A0-\u30FF\u3000-\u301F\u2026]/

const pinTriggers = new RegExp(
        ["pipe"].join("|")
    );

// Handle commands
bot.on("messageCreate", (message) => {
    // Modest amounts of trolling
    if (!message.author.bot && message.content.match(stfuFilter))
        message.reply("stfu");

    // Pin the message
    if (message.content.match(pinTriggers)) {
        try {
            message.pin();
        } catch (ERROR) {
            message.channel.send(
                "```arm\n"+ERROR+"```");
        }
    }

    // Stop execution if the message doesn't start with
    // the correct prefix
    if (!message.content.startsWith(config.prefix))
        return;

    // If you see this, I'm so tired.
    // I don't know why apostrophes don't get escaped
    // and the argument parser doesn't know what to do
    // with them. This will have to do for now.

    // Remove prefix from the string and split by spaces
    const commandArguments = parseArgsStringToArgv(
            message.content
                .replace(/'/g, "%APOSTROPHE%")
                .slice(config.prefix.length)
        )
        .map((argument)=> argument.replace(/%APOSTROPHE%/g, "\'"))

    const commandName = commandArguments[0];

    // Remove command from argument list
    commandArguments.shift();

    // Execute command if it's valid
    commands.get(commandName)?.execute(
        message, commandArguments, commands, bot)
});

bot.on("interactionCreate", (interaction)=> {
    console.log(interaction);
});

bot.login(config.botToken);
bot.on('ready', ()=> {
    const timestamp = new Date().toLocaleTimeString("UK");
    console.log(`[${timestamp}] [READY] Bot is online`);

    // Set bot status
    bot.user.setActivity({
        type: "WATCHING",
        name: "over 2 billion servers!",
    });
});