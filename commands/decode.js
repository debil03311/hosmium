module.exports = {
    description: "Available encodings: binary, base32, base36/alphanumeric, base64",
    aliases: [
        "decrypt"
    ],
    arguments: [
        "string",
        "encoding"
    ],


    hidden: true,


    execute({ message }={}) {
        message.channel.send("test");
    }
}