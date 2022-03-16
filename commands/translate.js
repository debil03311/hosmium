module.exports = {
    description: "Translate text from one language to another",
    aliases: [
        "tl",
    ],
    arguments: [
        "target language",
        "text",
    ],

    hidden: true,

    execute({ message } = {}) {
        message.channel.send("test");
    }
}