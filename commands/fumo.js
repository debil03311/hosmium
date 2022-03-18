const { MessageEmbed } = require("discord.js");
const fumoApi = require("fumo-api");
const config = require("../config.json");

const videoFormats = ["mp4", "webm", "mkv", "mov"];

/**
 * Reply to a message with a fumo image embed
 * @param {Message} message Discord message to reply to
 * @param {Boolean} isRandom Whether or not an ID was given
 * @param {String} fumoId The fumo image's ID
 */
async function replyWithFumo(message, isRandom = true, fumoId = "") {
    try {
        const fumo = (isRandom)
            ? await fumoApi.randomFumo(true)
            : await fumoApi.getFumoByID(fumoId, true)

        const fileExtension = fumo.URL
            .split("/").reverse()[0] // filename
            .split(".").reverse()[0] // extension

        const isVideo = videoFormats.includes(fileExtension);

        const fumoEmbed = new MessageEmbed({
            color: config.color,
            title: "Open Image",
            url: fumo.URL,
            description: "<:cirnofancy:954173256947077140> Your fumo, sir.",
        });

        // TODO: Find a way to embed video files.

        if (isVideo) {
            fumoEmbed.title = ":globe_with_meridians: Open Video"
            fumoEmbed.video = {
                url: fumo.URL,
            }
        } else {
            fumoEmbed.image = {
                url: fumo.URL,
            }
        }

        if (isRandom) {
            fumoEmbed.footer = {
                text: "ID: " + fumo._id,
            }
        }

        return message.reply({
            embeds: [
                fumoEmbed,
            ],

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
    
    catch (ERROR) {
        console.error(ERROR);
        return message.reply("```arm\n" + ERROR + "```");
    }
}

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
        return replyWithFumo(
            message,
            !Boolean(commandArguments[0]),
            commandArguments[0]);
    }
}