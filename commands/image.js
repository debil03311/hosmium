module.exports = {
    description: "Searches the web for an image and returns the first one.",
    aliases: [
        "img",
        "picture",
        "pic",
    ],
    arguments: [
        "query"
    ],

    hidden: true,

    execute({ message } = {}) {
        message.channel.send("test");
    }
}