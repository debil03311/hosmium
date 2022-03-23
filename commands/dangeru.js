const { MessageEmbed, MessageReaction, Message } = require("discord.js");
const cloudscraper = require("cloudscraper");
const cheerio = require("cheerio");

// const navigationEmoji = ['⬅️', '➡️'];
const numberEmoji = [ '0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣' ]

/**
 * @param {MessageReaction} reaction 
 */
function navigationReactionFilter(reaction) {
    return true;
    return navigationEmoji.includes(reaction.emoji.name);
}

const DangerU = require("./modules/dangeru.js");
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
        "`dangeru 842631` → Replies to thread no. 842631",
    ],

    hidden: true,

    /**
     * @param {Message} message 
     * @param {String[]} commandArguments 
     * @returns 
     */
    async execute(message, commandArguments) {
        if (!commandArguments[0]) {
            return message.reply(
                "This command requires an argument.")
        }

        const threadId = parseInt(commandArguments[0]);

        if (commandArguments[0].toLowerCase() === "boards"
        ||  commandArguments[0].toLowerCase() === "boardlist") {
            // Initialize embed
            const boardListEmbed = new MessageEmbed({
                color: dangeru.color,
                title: "danger/u/",
                url: dangeru.url,

                thumbnail: {
                    url: dangeru.thumbnails.default,
                },

                fields: [],
            });

            const boardList = await dangeru.boardList();

            for (const board of boardList) {
                boardListEmbed.fields.push({
                    inline: true,
                    name: `/${board}/`,
                    value: dangeru.boardData[board].name,
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

        else if (commandArguments[0] == "burgs") {
            // Fetch danger/u/ frontpage HTML
            const $$ = cheerio.load(
                await cloudscraper.get("https://dangeru.us"));
            
            // Grab burg numbers and convert it to integers
            const burgs = [
                parseInt( $$(".index-links span").eq(4).text() ),
                parseInt( $$(".index-links span").eq(5).text() ),
            ];

            // Lesser and greater burgs
            const burgsSorted = burgs.sort();

            // Index of the greater burgs (0 or 1)
            const biggestBurg = burgs.indexOf(burgsSorted[1]);

            // Initialize embed
            const burgEmbed = new MessageEmbed({
                color: dangeru.color,
                inline: true,

                title: "burg",
                url: dangeru.url,

                thumbnail: {
                    // Decide thumbnail based on which burg
                    // is currently the biggest
                    url: dangeru.thumbnails[biggestBurg ? "angryBurg" : "burg"],
                },

                fields: [
                    {
                        inline: true,
                        name: "Burgs",
                        value: `${burgs[0]}`,
                    },{
                        inline: true,
                        name: "Angry Burgs",
                        value: `${burgs[1]}`,
                    },{
                        // Difference between the burgs
                        name: "Distance",
                        value: `${burgsSorted[1] - burgsSorted[0]} burgs`,
                    },{
                        // Burg to Angry burg Ratio
                        name: "BAR",
                        value: `${(burgs[0] / burgs[1]).toFixed(2)}`,
                    }
                ],
            });

            message.reply({
                embeds: [
                    burgEmbed,
                ],

                // Without pinging
                allowedMentions: {
                    repliedUser: false
                }
            });
        }

        // Thread replies
        else if (threadId) {
            const thread = await dangeru.thread(threadId);
            console.log(thread);
        }

        // Board threads
        else {
            const boardName = commandArguments[0];
            const pageNumber = (commandArguments[1] -1) || 0;

            const threadList = await dangeru.board(boardName, pageNumber);
            // console.log(threadList);

            const boardEmbed = new MessageEmbed({
                color: dangeru.color,
                title: `danger/${boardName}/`,
                description: `Page ${pageNumber + 1}`,
                url: `${dangeru.url}/${boardName}/?page=${pageNumber}`,

                thumbnail: {
                    url: dangeru.thumbnails.default,
                },

                fields: threadList.map((thread) => {
                    const emoji = (thread.sticky)
                        ? ":pushpin:"
                        : (thread.is_locked)
                            ? "<:dorosleep:955469693026725899>"
                            : "<:almahug:955478250795200543>"

                    const date = new Date(thread.date_posted).toUTCString();

                    return {
                        inline: true,
                        name: `${emoji} \`${thread.post_id}\`\n:hash: \`${thread.hash}\``,
                        value: thread.title ?? "*N/A*",
                    }
                }),
            });

            const embedReply = await message.reply({
                    embeds: [
                        boardEmbed
                    ],

                    // Without pinging
                    allowedMentions: {
                        repliedUser: false
                    }
                })
                .then(async (embedReply)=> {
                    const pageCount = dangeru.boardData[boardName].pageCount;

                    for (let i = 1; i <= pageCount; i++)
                        await embedReply.react(numberEmoji[i]);

                    return embedReply;
                });

            console.log(embedReply);
 
            const navigationCollector =
                embedReply.createReactionCollector({
                    navigationReactionFilter,
                    time: 4*60*1000
                });

            console.log(navigationCollector);

            navigationCollector.on("collect", (reaction, user)=> {
                console.log(reaction);
                console.log(user);
            });

            navigationCollector.on("end", (collected) => {
                console.log(collected);
            });
        }
    }
}