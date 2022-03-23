module.exports = {
    description: "Available encodings: binary, base32, base36/alphanumeric, base64",
    aliases: [
        "dec"
    ],
    arguments: [
        "string",
        "encoding"
    ],

    hidden: true,

    /**
     * @param {Message} message 
     * @param {String[]} commandArguments 
     * @returns 
     */
    execute(message, commandArguments) {
        return message.channel.send("test");
    }
}