const { MessageEmbed } = require("discord.js");
const cloudscraper = require("cloudscraper");
const cheerio = require("cheerio");
const config = require("../config");

module.exports = {
    description: "Search the web for an image.",
    aliases: [
        "img",
        "picture",
        "pic",
    ],
    arguments: [
        "query"
    ],

    async execute({ message, commandArguments } = {}) {
        if (!commandArguments.length) {
            return message.reply(
                "This command requires an argument.");
        }

        const joinedArguments = commandArguments.join(" ");
        const query = encodeURIComponent(joinedArguments);

        const options = {
            url: `http://results.dogpile.com/serp?qc=images&q=${query}`,
            headers: {
                cookie: "ws_prefs=vr=1&af=Heavy&sh=False",
            }
        };

        const response = await cloudscraper.get(options);
        const $$ = cheerio.load(response);
        const links = $$('.image a.link');

        const urls = new Array(links.length).fill(0)
            .map((v, i) => links.eq(i).attr('href'))

        if (!urls.length) {
            return message.reply(
                `Couldn't find any images based on **"${joinedArguments}"**`);
        }

        const limit = 10;
        const resultAmount = (urls.length < limit)
            ? urls.length
            : limit

        const imageUrl = urls[ ~~(Math.random() * resultAmount) ];

        const imageEmbed = new MessageEmbed({
            color: config.color,
            title: "Open Image",
            description: `
                Query: ${joinedArguments}
                Result: ${urls.indexOf(imageUrl) + 1} (${resultAmount})
            `.trim(),
            url: imageUrl,

            image: {
                url: imageUrl,
            },

            footer: {
                text: `Requested by: ${message.author.tag}`,
            }
        });

        return message.reply({
            embeds: [
                imageEmbed
            ],

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}