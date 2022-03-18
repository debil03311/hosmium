const { MessageEmbed } = require("discord.js");
const fumoApi = require("fumo-api");
const config = require("../config.json");

module.exports = {
    description: "ᗜˬᗜ",
    arguments: [
        "id?"
    ],
    aliases: [
        "fumofumo",
        "ᗜˬᗜ",
    ],

    execute({ message, commandArguments } = {}) {
        if (commandArguments[0]) {
            fumoApi.getFumoByID(commandArguments[0], true)
                .then((fumo)=> {
                    return message.reply({
                        embeds: [
                            new MessageEmbed({
                                color: config.color,

                                title: "Open Image",
                                url: fumo.URL,
                                description: "<:cirnofancy:954173256947077140> Your fumo, sir.",

                                image: {
                                    url: fumo.URL,
                                },
                            })
                        ],

                        // Without pinging
                        allowedMentions: {
                            repliedUser: false
                        }
                    });
                }).catch((ERROR) => {
                    console.error(ERROR);
                    return message.reply("```arm\n" + ERROR + "```");
                })
        }

        else {
            fumoApi.randomFumo(true)
                .then((fumo)=> {
                    return message.reply({
                        embeds: [
                            new MessageEmbed({
                                color: config.color,

                                title: "Open Image",
                                url: fumo.URL,
                                description: "<:cirnofancy:954173256947077140> Your fumo, sir.",

                                image: {
                                    url: fumo.URL,
                                },
                                footer: {
                                    text: "ID: " + fumo._id,
                                }
                            })
                        ],

                        // Without pinging
                        allowedMentions: {
                            repliedUser: false
                        }
                    });
                }).catch((ERROR)=> {
                    console.error(ERROR);
                    return message.reply("```arm\n"+ERROR+"```");
                })
        }
    }
}