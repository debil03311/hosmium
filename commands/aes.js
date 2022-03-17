const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const config = require("../config");

const bitSizes = [128, 192, 256];
const encryptAliases = ["encrypt", "enc", "en", "e"];
const decryptAliases = ["decrypt", "dec", "de", "d"];

/**
 * Cut out the middle part of a long string of text
 * @param {String} text 
 * @param {Number} maxVisible The visible amount of characters at the start and end of the string
 * @param {String} filler String to replace the removed characters with
 * @returns String
 */
function shortenText(text, maxVisible, filler = "...") {
    // If the text is too short, don't bother
    if (maxVisible > text.length - (maxVisible * 2))
        return text;

    const textStart = text.slice(0, maxVisible);
    const textEnd = text.slice(text.length - maxVisible, text.length);

    return textStart + "..." + textEnd;
}

module.exports = {
    description: "Encrypt/decrypt text using AES.",
    arguments: [
        "encrypt|decrypt",
        "string",
        "decryptionKey"
    ],

    async execute({ message, commandArguments } = {}) {
        if (!commandArguments[2])
            return message.reply("This command requires three arguments.");

        // Initialize embed
        const messageEmbed = new MessageEmbed({
            // green
            color: "#03C4A1",
            description: "",
        });

        // If there are excess arguments, add them to the third one
        if (commandArguments.length > 3)
            commandArguments[2] = commandArguments.slice(2).join(" ");

        // Encode every argument as a URI component
        encodedArguments = commandArguments.map(encodeURIComponent);

        if (encryptAliases.includes(encodedArguments[0])) {
            const method = "encrypt";

            // Generate URL for the GET request
            const url = `http://rats.chat/aes.php?method=${method}&text=${encodedArguments[1]}&key=${encodedArguments[2]}&bits=`;

            // If the original text is too big
            const textDisplay = shortenText(commandArguments[1], 16);

            // Default bot color
            messageEmbed.color = config.color;
            messageEmbed.title
                = `:closed_lock_with_key: Encrypted __${textDisplay}__ with key __${commandArguments[2]}__`;

            for (const bits of bitSizes) {
                const response = await axios.get(url + bits);

                messageEmbed.description
                    += `\n**${bits}bit:** ${response.data}`
            }
        }

        else if (decryptAliases.includes(encodedArguments[0])) {
            const method = "decrypt";

            // Generate URL for the GET request
            const url = `http://rats.chat/aes.php?method=${method}&text=${encodedArguments[1]}&key=${encodedArguments[2]}&bits=`;

            // If the original text is too big
            const textDisplay = shortenText(commandArguments[1], 16);

            messageEmbed.title
                = `:unlock: Decrypted __${textDisplay}__ with key __${commandArguments[2]}__`

            // Get bit sizes from resultStrings keys
            for (const bits of bitSizes) {
                try {
                    // Send GET request with appropriate bit size
                    const response = await axios.get(url + bits);

                    // If a decoded string exists, add it to the embed
                    if (response.data) {
                        messageEmbed.description
                            += `\n**${bits}bit:** ${response.data}`;
                    }
                }

                catch (ERROR) {
                    console.error(ERROR);
                    return message.reply("```arm\n" + ERROR + "```");
                }
            }

            if (!messageEmbed.description) {
                delete messageEmbed.title;

                // red
                messageEmbed.color = "#F05454";
                messageEmbed.description = `:lock: Decryption failed with key __${commandArguments[2]}__.`;
            }
        }

        else {
            return message.reply(`Invalid method: \`${commandArguments[0]}\``)
        }

        return message.reply({
            embeds: [
                messageEmbed
            ],

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}