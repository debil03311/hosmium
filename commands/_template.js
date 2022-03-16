module.exports = {
    description: "",
    aliases: [],
    arguments: [],

    hidden: true,

    execute({ message } = {}) {
        message.channel.send("test");
    }
}