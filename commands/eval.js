module.exports = {
    description: "Wreak havoc.",
    arguments: [
        "javascript"
    ],

    hidden: true,

    execute({ message, commandArguments } = {}) {
        if (!commandArguments[0]) {
            message.reply("This command requires an argument.");
            return;
        }

        let result;

        try {
            result = "js\n" + eval(commandArguments.join(" "));
        } catch (ERROR) {
            console.error(ERROR);
            result = "yaml\n" + ERROR.message;
        }

        console.log("EVAL END")

        return message.reply({
            content: `\`\`\`${result}\`\`\``,

            // Without pinging
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}