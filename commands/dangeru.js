const { MessageEmbed } = require("discord.js");
const DangerU = require("./modules/dangeru.js")

const dangeru = new DangerU();

module.exports = {
    description: "Browse danger/u/ through Discord.",
    aliases: [
        "dangerus",
        "stingray",
        "awu",
        "u",
    ],
    arguments: [
        "(boards|boardlist)|boardName|burgs",
        "threadId?",
    ],
    usage: [
        "`dangeru boards` → List every board",
        "`dangeru burgs` → Current state of the burgs",
        "`dangeru tech` → All the threads on the first page of /tech/",
        "`dangeru tech 4` → All the threads on page 4 of /tech/",
    ],

    hidden: true,

    async execute({ message, commandArguments } = {}) {
        if (!commandArguments[0]) {
            return message.reply(
                "This command requires an argument.")
        }

        if (commandArguments[0].toLowerCase() === "boards" || "boardlist") {
            // Initialize embed
            const boardListEmbed = new MessageEmbed({
                color: dangeru.color,
                title: "danger/u/",
                url: dangeru.url,

                thumbnail: {
                    url: "https://i.imgur.com/aWS6tJ2.png",
                },

                fields: [],
            });

            const boardList = await dangeru.boardList();

            for (const board of boardList) {
                boardListEmbed.fields.push({
                    inline: true,
                    name: `/${board}/`,
                    value: dangeru.boardNames[board],
                });
            }

            message.reply({
                embeds: [
                    boardListEmbed,
                ],

                // Without pinging
                allowedMentions: {
                    repliedUser: false
                }
            });
        }
    }
}