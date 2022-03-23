module.exports = {
    description: "Add a dithering effect to an image",
    arguments: [
        "imageUrl?",
        "+imageAttachment?",
    ],

    hidden: true,

    /**
     * @param {Message} message 
     * @param {String[]} commandArguments 
     * @returns 
     */
    execute(message, commandArguments) {
        if (!arguments[0]) {
            return message.reply(
                "This command requires an argument");
        }

        // 

        message.reply({
            content: "test",
            embeds: [],

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}