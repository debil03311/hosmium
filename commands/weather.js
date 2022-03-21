const { MessageEmbed } = require("discord.js");
const axios = require("axios");
const config = require("../config.json");

const baseUrl = "https://wttr.in/{{CITY}}.png?2FQmp&background=2f3136";

/**
 * Convert a string of text to capital case
 * @param {String} string 
 */
function toCapitalCase(string) {
    return string.charAt(0).toUpperCase()
         + string.slice(1).toLowerCase()
}

module.exports = {
    description: "Weather forecast for your city from wttr.in",
    aliases: [
        "forecast",
        "wttris",
        "wttr",
        "wf",
    ],
    arguments: [
        "city",
    ],

    async execute({ message, commandArguments } = {}) {
        if (!commandArguments[0])
            return message.reply("This command requires an argument.");

        // Capitalize city name
        const cityName = toCapitalCase(commandArguments[0]);
        // Put it in the URL
        const imageUrl = baseUrl.replace("{{CITY}}", cityName);

        try {
            const response = await axios.get(imageUrl);

            message.reply({
                embeds: [
                    new MessageEmbed({
                        color: config.color,

                        title: `Weather forecast for ${cityName}`,
                        // Remove extension and parameters from the URL
                        url: imageUrl.replace(/\.png.*/, ""),

                        image: {
                            url: imageUrl
                        }
                    })
                ],

                // Without pinging
                allowedMentions: {
                    repliedUser: false
                }
            });
        } catch (ERROR) {
            console.error(ERROR);
            message.reply("```arm\n"+ERROR+"```");
        }
    }
}