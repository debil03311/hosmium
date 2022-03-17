const deepl = require("deepl");
const { MessageEmbed } = require("discord.js");

const languages = [
    {
        code: "BG",
        fullName: "Bulgarian",
        flag: ":flag_bg:",
        names: ["bg", "bul", "bulgarian", "balgarski", "български"]
    },{
        code: "CS",
        fullName: "Czech",
        flag: ":flag_cs:",
        names: ["cs", "cze", "ces", "czech", "cestina", "cheshtina", "cesky", "chesky", "čeština", "český"]
    },{
        code: "DA",
        fullName: "Danish",
        flag: ":flag_da:",
        names: ["da", "dan", "danish", "dansk"]
    },{
        code: "DE",
        fullName: "German",
        flag: ":flag_de:",
        names: ["de", "deu", "ger", "german", "deutsch"]
    },{
        code: "EL",
        fullName: "Greek",
        flag: ":flag_el:",
        names: ["el", "ell", "gre", "greek", "ellinika", "ελληνικά"]
    },{
        code: "EN",
        fullName: "English",
        flag: ":flag_us:",
        names: ["en", "eng", "english"]
    },{
        code: "EN-US",
        fullName: "American English",
        flag: ":flag_us:",
        names: ["en-us", "us"]
    },{
        code: "EN-GB",
        fullName: "British English",
        flag: ":flag_gb:",
        names: ["en-gb", "gb"]
    },{
        code: "ES",
        fullName: "Spanish",
        flag: ":flag_es:",
        names: ["es", "esp", "spa", "spanish", "espanol", "español"]
    },{
        code: "ET",
        fullName: "Estonian",
        flag: ":flag_et:",
        names: ["et", "est", "estonian", "eesti"]
    },{
        code: "FI",
        fullName: "Finnish",
        flag: ":flag_fi:",
        names: ["fi", "fin", "finnish", "suomen"]
    },{
        code: "FR",
        fullName: "French",
        flag: ":flag_fr:",
        names: ["fr", "fra", "french", "francais", "français"]
    },{
        code: "HU",
        fullName: "Hungarian",
        flag: ":flag_hu:",
        names: ["hu", "hun", "hungarian", "magyar"]
    },{
        code: "IT",
        fullName: "Italian",
        flag: ":flag_it:",
        names: ["it", "ita", "italian", "italiano", "italiana"]
    },{
        code: "JA",
        fullName: "Japanese",
        flag: ":flag_ja:",
        names: ["ja", "jp", "jap", "jpn", "japanese", "nihongo", "nippongo", "wago", "日本語", "和語"]
    },{
        code: "LT",
        fullName: "Lithuanian",
        flag: ":flag_lt:",
        names: ["lt", "lit", "lithuanian", "lietuviu", "lietuvių"]
    },{
        code: "LV",
        fullName: "Latvian",
        flag: ":flag_lv:",
        names: ["lv", "lav", "latvian", "latviešu"]
    },{
        code: "NL",
        fullName: "Dutch",
        flag: ":flag_nl:",
        names: ["nl", "ndl", "dut", "dutch", "nederlands"]
    },{
        code: "PL",
        fullName: "Polish",
        flag: ":flag_pl:",
        names: ["pl", "pol", "polish", "polski"]
    },{
        code: "PT",
        fullName: "Portuguese",
        flag: ":flag_pt:",
        names: ["pt", "por", "prt", "portuguese", "portugues", "português"]
    },{
        code: "PT-PT",
        fullName: "Portuguese",
        flag: ":flag_pt:",
        names: ["pt-pt"]
    },{
        code: "PT-BR",
        fullName: "Brazillian Portuguese",
        flag: ":flag_br:",
        names: ["pt-br", "br", "bra", "brz", "brazillian"]
    },{
        code: "RO",
        fullName: "Romanian",
        flag: ":flag_ro:",
        names: ["ro", "rou", "rom", "romanian", "romana", "română"]
    },{
        code: "RU",
        fullName: "Russian",
        flag: ":flag_ru:",
        names: ["ru", "rus", "russian", "russkij", "russkii", "ruski", "русский"]
    },{
        code: "SK",
        fullName: "Slovak",
        flag: ":flag_sk:",
        names: ["sk", "slo", "slk", "slovak", "slovencina", "slovenchina", "slovensky", "slovenčina", "slovenský"]
    },{
        code: "SL",
        fullName: "Slovene",
        flag: ":flag_sl:",
        names: ["sl", "slv", "slovene", "slovenski", "slovenscina", "slovenshchina", "slovenski", "slovenščina"]
    },{
        code: "SV",
        fullName: "Swedish",
        flag: ":flag_sv:",
        names: ["sv", "swe", "swedish", "svenska"]
    },{
        code: "ZH",
        fullName: "Chinese",
        flag: ":flag_zh:",
        names: ["zh", "cn", "chi", "zho", "chinese", "zhongwen", "中文"]
    }
]

// Every valid target argument
const validTargets = languages
    .map((language)=> language.names)
    .flat()

module.exports = {
    description: `
        Translate text from one language to another.
        Languages: *${languages.map((language)=> language.code.toLowerCase()).join(", ")}*
    `.trim(),
    aliases: [
        "tl",
    ],
    arguments: [
        "targetLanguage",
        "text",
    ],

    execute({ message, commandArguments, config } = {}) {
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

                message.reply({
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
                message.reply("```arm\n"+ERROR+"```");
            })
    }
}