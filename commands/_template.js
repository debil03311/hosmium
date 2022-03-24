module.exports = {
    description: "",
    deephelp: [],
    aliases: [],
    arguments: [],
    usage: [],

    hidden: true,

    /**
     * @param {Message} message 
     * @param {String[]} commandArguments 
     * @param {Collection} commands
     * @param {Client} bot
     */
    execute(message, commandArguments, commands, bot) {
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