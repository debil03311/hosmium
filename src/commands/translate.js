const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const deepl = require("deepl");

const languageData = require("./data/languages.json");
const languageNames = languageData.map((language)=> language.name);
const languageNamesString = languageNames
  .map((name)=> global.utils.wrapText(name, "*"))
  .join(", ")

// const languageAliases = languageData
//   .map((language)=> language.aliases)
//   .flat()
//   .sort((current, previous)=>
//     current.charAt(0) < previous.charAt(0) ? -1 : 1)

// const languageAliasesString = languageAliases
//   .map((alias)=> global.utils.wrapText(alias, "*"))
//   .join(", ")

const commandData = new SlashCommandBuilder()
  .setName("translate")
  .setDescription("Translate text from one language to another")

  .addStringOption((option)=> option
    .setRequired(true)
    .setName("text")
    .setDescription("The text you want to translate"))

  .addStringOption((option)=> option
    .setRequired(true)
    .setName("target")
    .setDescription("Language to translate to (e.g. chinese/zh/中文/zhongwen etc.)"))

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("source")
    .setDescription("Language to translate from (e.g. spanish/español/es/spa etc.)"))

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

module.exports = {
  aliases: ["deepl"],
  data: commandData,

  async execute(interaction, options) {
    if (!process.env.DEEPL_API_KEY) {
      return interaction.reply(
        "```arm\nError: Mising DeepL API key```");
    }

    const text = options.get("text").value;

    // I would like to formally raise my middle finger
    // to Discord and their slash command API

    const targetArgument = options.get("target").value.toLowerCase();
    const sourceArgument = options.get("source")?.value.toLowerCase();

    // Why, on this beautiful Earth, would they choose to
    // cap the options at 25? Come on, seriously?

    const target = languageData.find((language)=> 
      language.aliases.includes(targetArgument))

    const source = languageData.find((language)=> 
      language.aliases.includes(sourceArgument))

    // Wasn't this supposed to make everything easier
    // and more intuitive for the user?

    if (!target) {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor(global.config.colors.failure)
            .setTitle(`:no_entry_sign: Invalid identifier: __${targetArgument}__`)
            .setDescription(`**Available languages:** ${languageNamesString}`)
        ],

        ephemeral: Boolean(options.get("hidden")?.value),
      });
    }

    try {
      // Make translation request to DeepL
      const translation = await deepl({
        free_api: true,
        auth_key: process.env.DEEPL_API_KEY,
        text: text,
        target_lang: target.code,
        source_lang: source?.code
      })
        // Only get the first translation
        .then((response)=> response.data.translations[0])

      // The source language that DeepL ended up using
      const deeplSource = {
        name: languageData.find((language)=>
          language.code == translation.detected_source_language)?.name
        ,
        emoji: languageData.find((language)=>
          language.code == translation.detected_source_language)?.emoji
        ,
      }
      
      const translationEmbed = new MessageEmbed()
        .setColor(global.config.colors.default)
        // .setTitle(`${deeplSource.name} ${deeplSource.emoji} → ${target.emoji} ${target.name}`)
        // .setDescription(translation.text)
        .addField(
          `${deeplSource.emoji} ${deeplSource.name}`,
          text || "N/A",
          true)
        .addField(
          `${target.emoji} ${target.name}`,
          translation.text || "N/A",
          true)
      
      return interaction.reply({
        embeds: [translationEmbed],
        ephemeral: Boolean(options.get("hidden")?.value),
      });
    }

    catch (ERROR) {
      console.error(ERROR);
      return interaction.reply("```arm\n" + ERROR + "```");
    }
  }
}