module.exports = {
    description: "ᗜˬᗜ",
    // arguments: [],

    hidden: true,

    execute({ message } = {}) {
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