const { MessageEmbed, MessageReaction, Message, User } = require("discord.js");
const cloudscraper = require("cloudscraper");
const cheerio = require("cheerio");

const DangerU = require("./modules/dangeru.js");
const dangeru = new DangerU();

const numberEmoji = [ '0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣' ];

/**
 * Generate a message embed for a danger/u/ board
 * @param {String} boardName 
 * @param {Number} pageNumber - Should start at 1
 * @param {Object[]} threadList 
 * @param {Message} message - Original command message
 * @returns MessageEmbed 
 */
function generateBoardEmbed(boardName, pageNumber, threadList, message) {
    return new MessageEmbed({
        color: dangeru.color,
        title: `danger/${boardName}/`,
        description: `Page ${pageNumber}`,
        url: `${dangeru.url}/${boardName}/?page=${pageNumber-1}`,

        thumbnail: {
            url: dangeru.thumbnails.default,
        },

        fields: threadList.map((thread) => {
            // Determine thread emoji
            // :pushpin:   Sticky (Pinned)
            // :dorosleep: Locked
            // :almahug:   Active
            const emoji = (thread.sticky)
                ? ":pushpin:"
                : (thread.is_locked)
                    ? "<:dorosleep:955469693026725899>"
                    : "<:almahug:955478250795200543>"

            return {
                inline: true,
                name: `${emoji} \`${thread.post_id}\`\n:hash: \`${thread.hash}\``,
                value: thread.title ?? "*N/A*",
            }
        }),

        footer: {
            text: `Controller: ${message.author.username}#${message.author.discriminator}`
        },
    });
}

/**
 * Generate a message embed for a danger/u/ board
 * @param {String} boardName 
 * @param {Object[]} postList 
 * @param {Number} sliceOffset - What post to start showing from `(n -> n+10)`
 * @param {Message} message - Original command message
 * @returns MessageEmbed 
 */
function generateThreadEmbed(threadId, postList, sliceOffset=0, message) {
    return new MessageEmbed({
        color: dangeru.color,
        title: "Open Thread",
        url: "https://dangeru.us/",

        thumbnail: {
            url: dangeru.thumbnails.default,
        },

        fields: postList.slice(
                sliceOffset,
                sliceOffset+10
            )
            .map((postObject)=> {
                const date = new Date(postObject.date_posted).toLocaleString("JA");
                const isOp = (postObject.is_op)
                    ? ":speech_balloon:"
                    : ""
                
                // const threadTitle = (postObject.);

                return {
                    name: `${isOp} \`${postObject.post_id}\` \`#${postObject.hash}\` ${date} GMT`,
                    value: postObject.comment.slice(0, 2048),
                }
            }),
    });
}

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
        "`dangeru` `boards` → List every board",
        "`dangeru` `burgs` → Current state of the burgs",
        "`dangeru` `tech` → All the threads on the first page of /tech/",
        "`dangeru` `tech 4` → All the threads on page 4 of /tech/",
        "`dangeru` `842631` → Replies to thread no. 842631",
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

        // TODO: reply offset
        // TODO: catch board doesn't exist
        // TODO: figure out why /a/ doesn't work
        // TODO: figure out why boards sometimes jump to the last page

        // Thread replies
        else if (threadId) {
            const embedReply = await message.reply({
                    embeds: [
                        generateThreadEmbed(
                            threadId,
                            await dangeru.thread(threadId),
                            0,
                            message,
                        ),
                    ],

                    // Without pinging
                    allowedMentions: {
                        repliedUser: false
                    }
                })
                // .then(async (embedReply) => {
                //     // Get the current board's amount of pages
                //     const pageCount = dangeru.boardData[boardName].pageCount;

                //     // Don't bother if there's only one page
                //     if (pageCount < 2)
                //         return embedReply;

                //     // React with a number emoji for each page
                //     for (let i = 1; i <= pageCount; i++)
                //         await embedReply.react(numberEmoji[i]);

                //     return embedReply;
                // });
        }

        // Board threads
        else {
            // Example: cyb
            const boardName = commandArguments[0];

            // Should start at 1
            const pageNumber = parseInt(commandArguments[1]) || 1;

            // Hardcoded information
            const boardData = dangeru.boardData[boardName];

            if (pageNumber > boardData.pageCount
            ||  pageNumber < 1) {
                return message.reply(
                    `Page ${pageNumber} of **/${boardName}/** does not exist.`);
            }

            const embedReply = await message.reply({
                    embeds: [
                        generateBoardEmbed(
                            boardName,
                            pageNumber,
                            await dangeru.board(boardName, pageNumber-1),
                            message
                        ),
                    ],

                    // Without pinging
                    allowedMentions: {
                        repliedUser: false
                    }
                })
                .then(async (embedReply)=> {
                    // Get the current board's amount of pages
                    const pageCount = dangeru.boardData[boardName].pageCount;

                    // Don't bother if there's only one page
                    if (pageCount < 2)
                        return embedReply;

                    // React with a number emoji for each page
                    for (let i = 1; i <= pageCount; i++)
                        await embedReply.react(numberEmoji[i]);

                    return embedReply;
                });

            /**
             * This doesn't work for some reason
             * Only collect number emoji 0-9 sent by the command initiator
             * @param {MessageReaction} reaction 
             * @param {User} reactionUser
             */
            const numberReactionFilter = (reaction, reactionUser) => {
                return (reactionUser.id === message.author.id)
                    && numberEmoji.includes(reaction.emoji.name)
            }

            // Reference to the collector
            const navigationCollector =
                embedReply.createReactionCollector({
                    numberReactionFilter,
                    time: 2*60*1000
                });

            navigationCollector.on("collect", async (reaction, reactionUser)=> {
                // Check to see that the reaction is valid
                if (!reactionUser.id === message.author.id
                ||  !numberEmoji.includes(reaction.emoji.name)) {
                    return;
                }

                try {
                    // Update reply embed
                    embedReply.edit({
                        embeds: [
                            // Fetch new page with reaction number
                            generateBoardEmbed(
                                boardName,
                                reaction.emoji.name[0],
                                await dangeru.board(boardName, reaction.emoji.name[0]-1),
                                message
                            ),
                        ],

                        // Without pinging
                        allowedMentions: {
                            repliedUser: false
                        }
                    });
                } catch (ERROR) {
                    console.error(ERROR);
                    console.error(`
                        Board: /${boardName}/
                        Page: ${boardNumber}/${pageCount}
                        It's likely that there's only one page on this board.
                    `);
                }
            });

            navigationCollector.on("end", (collected) => {
                // console.log("FINISHED");

                const finalEmbed = embedReply.embeds[0];
                finalEmbed.footer.text = "Session over."

                // Update reply embed
                embedReply.edit({
                    embeds: [
                        finalEmbed
                    ],

                    // Without pinging
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            });
        }
    }
}