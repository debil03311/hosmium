const { Client, Intents } = require('discord.js');
const { parseArgsStringToArgv } = require('string-argv');

const config = require('./config.json');
const commands = require("./commands.js").commands;

// Initialize bot client with necessary permissions
const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

// Handle commands
bot.on("messageCreate", (message) => {
    // Modest amounts of trolling
    if (!message.author.bot
    && message.content.match(/[\u4E00-\u9FBF\u3040-\u309F\u30A0-\u30FF\u3000-\u301F\u2026]/))
        message.reply("stfu");

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
    commands.get(commandName)?.execute({
        bot: bot,
        message: message,
        commandArguments: commandArguments,
        commandList: commands,
    });
});

/**
 * Prepend zeroes to a single digit number
 * @param {Number} digit 
 * @param {Number} amount
 * @returns String
 */
function prefixZero(digit, amount = 0) {
    digit = Math.abs(digit).toString();

    if (digit > 10)
        return digit;

    return digit.padStart(amount+1, "0")
}

bot.login(config.botToken);
bot.on('ready', ()=> {
    const date = new Date();
    const hour = prefixZero(date.getHours(), 1);
    const minute = prefixZero(date.getMinutes(), 1);

    console.log(`[${hour}:${minute}] Bot is online`)

    // Set bot status
    bot.user.setActivity({
        type: "WATCHING",
        name: "over 2 billion servers!",
    })
});