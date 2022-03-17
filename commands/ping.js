module.exports = {
    description: "Un momento, señor.",
    aliases: [
        "latency"
    ],

    execute({ message }={}) {
        // Subtract message timestamp from the current milliseconds
        const time = new Date().getTime() - message.createdTimestamp;

        return message.reply({
            content: `<:mxneco:952948316340117524> ${time}ms, señor.`,

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}