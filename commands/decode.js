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


    execute({ message }={}) {
        return message.channel.send("test");
    }
}