module.exports = {
    description: "",
    aliases: [],
    arguments: [],

    hidden: true,

    execute({ message } = {}) {
        // 

        message.reply({
            text: "test",
            embeds: [],

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}