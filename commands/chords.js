module.exports = {
    description: "",
    aliases: [],
    arguments: [],

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