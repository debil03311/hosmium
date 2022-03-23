const fs = require("fs");
const config = require("../config.json");

module.exports = {
    description: "Show the bot's current prefix.",

    /**
     * @param {Message} message 
     * @returns 
     */
    execute(message) {
        return message.reply({
            content: `My prefix is \`${config.prefix}\``,

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}