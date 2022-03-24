const { MessageEmbed, Client } = require("discord.js");
const config = require("../config.json");

module.exports = {
    description: "Details about hosmium.",
    aliases: [
        "state",
        "stats",
        "info",
    ],

    /**
     * @param {Message} message 
     * @param {Client} bot 
     */
    execute(message, commandArguments, commands, bot) {
        // bot.uptime is expressed in milliseconds
        const uptime = {
            miliseconds: bot.uptime.toFixed(0) % 1000,
            seconds:    (bot.uptime / 1000).toFixed(0) % 60,
            minutes:    (bot.uptime / 1000 / 60).toFixed(0) % 60,
            hours:      (bot.uptime / 1000 / 60 / 60).toFixed(0) % 24,
            days:       (bot.uptime / 1000 / 60 / 60 / 24).toFixed(0) % 7,
        }

        // Formatted time string
        const uptimeString =
            `${uptime.days}d ${uptime.hours}h ${uptime.minutes}m`;

        message.reply({
            embeds: [
                new MessageEmbed({
                    color: config.color,
                    title: `${bot.user.username}#${bot.user.discriminator}`,

                    thumbnail: {
                        url: config.botLogoImage,
                    },

                    fields: [
                        {
                            inline: true,
                            name: "Uptime",
                            value: uptimeString,
                        },
                        {
                            inline: true,
                            name: "Memory",
                            value: `${~~(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
                        },
                        {
                            inline: true,
                            name: "Servers",
                            value: bot.guilds.cache.size.toString(),
                        },
                        {
                            inline: true,
                            name: "Birthday",
                            value: bot.user.createdAt.toLocaleDateString("JA"),
                        },
                        {
                            inline: true,
                            name: "Node",
                            value: process.version,
                        },
                    ]
                })
            ],

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}