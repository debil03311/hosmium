const { Collection } = require("discord.js");
const fs = require("fs");
const config = require('./config.json');

// Get all files from the designated directory
const commandFiles = fs.readdirSync(config.commandsDirectory)
    // Only keep javascript files
    .filter((filename) => filename.slice(filename.length - 3) === ".js")

const commands = new Collection();

for (const commandFilename of commandFiles) {
    const timestamp = new Date().toLocaleTimeString("UK");
    console.log(`[${timestamp}] Loading command: ${commandFilename}`);

    // Load command from file
    const commandObject = require(`${config.commandsDirectory}/${commandFilename}`)

    // Add command to collection
    commands.set(
            // Strip ".js" from the filename
            commandFilename.slice(0, commandFilename.length - 3),
            commandObject
        );

    // Register command aliases if any
    if (commandObject.aliases) {
        const aliasObject = {
            isAlias: true,
            ...commandObject
        }

        for (const alias of commandObject.aliases)
            commands.set(alias, aliasObject);
    }
}

module.exports = { commands };