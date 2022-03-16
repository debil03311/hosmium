const { MessageEmbed } = require("discord.js");

const quotes = [
    "'PIRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRKELE'\n- Finnish guy on Phasmophobia, 2021",
    "'Herobrine tried to eat my dummy thicc ass'\n- Гönк, cca. 2020",
    "'the sykkuno-corpsehusband bussy piping incident'\n- Math, 2022",
    "\\*racial slurs*\n- British VRChat sandwich, 2021",
]

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

    // List command aliases if any
    if (commandObject.aliases)
        fieldObject.value += `\nAliases: *${commandObject.aliases.join(", ")}*`;

    // Return finalized object
    return fieldObject;
}

module.exports = {
    description: "You literally just used this.",
    aliases: [
        "commands",
        "cmds"
    ],
    arguments: [
        "command?"
    ],

    execute({ bot, message, commandArguments, commandList, config }={}) {
        // Initialize Discord embed without any entries
        const helpEmbed = new MessageEmbed({
            color: "#987353",
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

                // Add command entry to the embed
                helpEmbed.fields.push(
                    fieldForCommand(commandName, commandObject));
            }
            
            // If the argument is an invalid command name
            catch (ERROR) {
                message.reply(
                    `No such command: \`${commandArguments[0]}\` (${ERROR.name})`);

                return;
            }
        }

        else {
            // Set embed headers for command list
            helpEmbed.setTitle("Inhale the hosmium <:imagineTheSmelle:953441999518830712>")
                .setDescription(
                    quotes[
                        Math.floor(Math.random() * quotes.length)
                    ])
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

        message.reply({
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