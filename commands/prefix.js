const fs = require("fs");

module.exports = {
    description: "Show the bot's current prefix.",

    execute({ message, config }={}) {
        // Reply with the current prefix if no arguments then exit
        message.reply({
            content: `My prefix is \`${config.prefix}\``,

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}