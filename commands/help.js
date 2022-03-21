const { MessageEmbed } = require("discord.js");
const config = require("../config.json");
const quoteList = require("./data/quotes.json");

/**
 * Create a Discord embed field for a given command
 * @param {String} commandName
 * @param {Object} commandObject
 * @returns Object
 */
function fieldForCommand(commandName, commandObject) {
    // Initial object
    const fieldObject = {
        name: commandName,
        value: commandObject.description,
    }

    // Italicize and separate arguments by spaces if any
    if (commandObject.arguments)
        fieldObject.name += ` __${commandObject.arguments?.join("__ __")}__`;

    // Return finalized object
    return fieldObject;
}

module.exports = {
    description: "You literally just used this.",
    aliases: [
        "commands",
        "cmds",
    ],
    arguments: [
        "command?"
    ],

    execute({ message, commandArguments, commandList }={}) {
        // Initialize Discord embed without any entries
        const helpEmbed = new MessageEmbed({
            color: config.color,
            // For some reason .addField() doesn't want to work
            fields: [],

            footer: {
                text: `Prefix: ${config.prefix}`,
            }
        });

        // If a command name was passed as an argument
        if (commandArguments[0]) {
            // Take the first argument
            const commandName = commandArguments[0];

            try {
                // Get appropriate command
                const commandObject = commandList.get(commandName);

                // Create a new embed field for this command
                const commandField = fieldForCommand(commandName, commandObject);

                // List command aliases in the help embed, if any
                if (commandObject.aliases) {
                    commandField.value +=
                        `\nAliases: *${commandObject.aliases.join(", ")}*`;
                }

                // If the command has usage notes, add them in
                if (commandObject.usage) {
                    commandField.value += "\n\n"
                        + commandObject.usage.join("\n");
                }

                // If the command has extra help fields, add them in
                if (commandObject.deepHelp) {
                    commandField.value += "\n\n"
                        + commandObject.deepHelp.join("\n\n");
                }

                // Add command entry to the embed
                helpEmbed.fields.push(commandField);
            }
            
            // If the argument is an invalid command name
            catch (ERROR) {
                return message.reply(
                    `No such command: \`${commandArguments[0]}\` (${ERROR})`);
            }
        }

        else {
            // Get a random quote
            const quote = quoteList[ ~~(Math.random() * quoteList.length) ];

            // Set embed headers for command list
            helpEmbed.setTitle("Inhale the hosmium <:imagine:955234989732143115>")
                .setDescription(`
                        *${quote.text}*
                        — **${quote.source}**, ${quote.year}
                    `.trim())
                .setThumbnail(config.botLogoImage)

            for (const commandName of commandList.keys()) {
                const commandObject = commandList.get(commandName);

                // Skip this iteration if the command is an alias
                if (commandObject.isAlias || commandObject.hidden)
                    continue;

                // Add command entry to the embed
                helpEmbed.fields.push(
                    fieldForCommand(commandName, commandObject) );
            }
        }

        return message.reply({
            embeds: [
                helpEmbed
            ],

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}