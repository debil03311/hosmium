const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const quotes = require(`${__dirname}/data/quotes.json`);

/**
 * @returns `{ info: Object, index: Number }`
 */
function randomQuote() {
  const quoteIndex = Math.floor(Math.random() * quotes.length);

  return {
    info: quotes[quoteIndex],
    index: quoteIndex + 1,
  }
}

const numberNames = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

/**
 * @param { String } digit 
 * @returns 
 */
function toNumberEmoji(digit) {
  return `:${numberNames[digit]}:`;
}

const commandData = new SlashCommandBuilder()
  .setName("quote")
  .setDescription("Get a legendary quote")
  // TODO: quote submission subcommand

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

module.exports = {
  data: commandData,
  
  execute(interaction, options) {
    const quote = randomQuote();

    const quoteNumber = quote.index
      .toString()
      .split("")
      .map(toNumberEmoji)
      .join("")

    const replyEmbed = new MessageEmbed()
      .setColor(global.config.colors.default)
      .setTitle(`:hash:${quoteNumber}`)
      .setDescription(quote.info.text)
      .setFooter({
        text: `© ${quote.info.source}, ${quote.info.year}`,
      })

    return interaction.reply({
      embeds: [replyEmbed],
      ephemeral: Boolean(options.get("hidden")?.value),
    });
  }
}