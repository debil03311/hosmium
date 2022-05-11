const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

const baseUrl = "";

const commandData = new SlashCommandBuilder()
  .setName("weather")
  .setDescription("Weather forecast for your city from wttr.in")

  .addStringOption((option)=> option
    .setRequired(true)
    .setName("city")
    .setDescription("Name of the city to get a forecast for"))

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

module.exports = {
  aliases: ["forecast", "wttr.is"],
  data: commandData,
  
  async execute(interaction, options) {
    try {
      // Capitalize city name
      const cityName = global.utils
        .capitalize(options.get("city").value)

      const imageUrl = `https://wttr.in/${cityName}.png?2FQmp&background=2f3136`

      // Non-300 test
      await axios.get(imageUrl);
      
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setColor(global.config.colors.default)
            .setURL(imageUrl.replace(/\.png.*/, ""))
            .setTitle(`Weather forecast for ${cityName}`)
            .setImage(imageUrl)
        ],

        ephemeral: Boolean(options.get("hidden")?.value),
      });
    } catch (ERROR) {
      console.error(ERROR);
      message.reply({
        content: "```arm\n" + ERROR + "```",
        ephemeral: Boolean(options.get("hidden")?.value),
      });
    }
  }
}