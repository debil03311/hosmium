const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

// UTC offsets
const timezones = require("./data/timezones.json")
const countries = timezones.map((timezone)=> timezone.countries).flat();

module.exports = {
    description: "Get the current time for the given timezones",
    aliases: [
        "timezone",
        "tz",
    ],
    arguments: [
        "...countries?|hours?"
    ],

    hidden: true,
    
    execute({ message, commandArguments } = {}) {
        // Current time
        const now = new Date();

        // If no arguments reply with the current UTC time
        if (!commandArguments[0]) {
            return message.reply({
                color: config.color,
                content: now.toUTCString(),

                // Without pinging
                allowedMentions: {
                    repliedUser: false
                }
            });
        }

        // Try to convert the first argument to an integer
        const targetHours = parseInt(commandArguments[0]);

        if (targetHours) {
            // Initialize embed
            const hoursEmbed = new MessageEmbed({
                color: config.color,
                title: `It is currently ${targetTime} in the following countries`,
                description: targetTimezone.countries.join(", "),
            });

            const hours = new Array(now.getHours(), targetHours).sort();
            const targetOffset = hours[1] - hours[0];

            const targetDate = new Date(now.getTime() + (targetOffset * 60*60*1000));

            message.reply({
                embeds: [
                    hoursEmbed,
                ],

                // Without pinging
                allowedMentions: {
                    repliedUser: false
                }
            });
        }
        
        else {
            const timeEmbed = new MessageEmbed({
                title: now.toUTCString(),
                fields: [],
            });
        }
    }
}