const { MessageEmbed } = require("discord.js");
const deepl = require("deepl");

const config = require("../config.json");
const languages = require("./data/languages.json");

const languageCodes = languages.map((language)=> language.code.toLowerCase());
const languageAliases = languages.map((language)=> language.names.slice(1)).flat();

// Every valid target argument
const validTargets = languages.map((language)=> language.names).flat()

module.exports = {
    description: "Translate text from one language to another.",
    deepHelp: [
        `The following target languages are available: *${languageCodes.join(", ")}*`,
        "Multiple aliases exist for every language. For example, __es__ can be substituted for either __esp__, __spa__, __spanish__, __espanol__ or __español__.",
    ],
    aliases: [
        "tl",
    ],
    arguments: [
        "targetLanguage",
        "...text",
    ],

    /**
     * @param {Message} message 
     * @param {String[]} commandArguments 
     * @returns 
     */
    execute(message, commandArguments) {
        if (!config.deeplApiKey) {
            return message.reply(
                "```arm\nError: Mising API key for DeepL```");
        }

        if (!commandArguments[1]) {
            return message.reply(
                "This command requires two or more arguments.");
        }

        // Target language should be the first argument
        const targetLanguageArgument = commandArguments[0].toLowerCase();

        // Check to see if the target language is valid
        if (!validTargets.includes(targetLanguageArgument)) {
            return message.reply(
                `Invalid target language: **${targetLanguageArgument}**`);
        }

        // Find the correct language object
        const targetLanguage = languages.find((language)=>
            language.names.includes(targetLanguageArgument))

        // Remove target language from arguments
        commandArguments.shift();

        // Stringify the rest the of arguments
        const sample = commandArguments.join(" ");

        // Make translation request to DeepL
        deepl({
                free_api: true,
                auth_key: config.deeplApiKey,
                text: sample,
                target_lang: targetLanguage.code,
            })
            // Only get the first translation
            .then((response)=> response.data.translations[0])
            .then((translation)=> {
                const sourceLanguage = languages.find(
                    (language)=> language.code == translation.detected_source_language)

                const translationEmbed = new MessageEmbed({
                    color: config.color,
                    title: `${sourceLanguage.fullName} ${sourceLanguage.flag} → ${targetLanguage.flag} ${targetLanguage.fullName}`,
                    description: translation.text,
                });

                return message.reply({
                    embeds: [
                        translationEmbed
                    ],

                    // Without pinging
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            })
            .catch((ERROR)=> {
                console.error(ERROR);
                return message.reply("```arm\n"+ERROR+"```");
            })
    }
}