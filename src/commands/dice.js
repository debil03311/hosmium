const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("dice")
  .setDescription("Throw a pair of dice and see what you get.")

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

const diceFaces = '⚀⚁⚂⚃⚄⚅';

module.exports = {
  data: commandData,
  
  execute(interaction, options) {
    const faceIndices = [
      Math.floor(Math.random() * 6),
      Math.floor(Math.random() * 6),
    ];

    const die = [
      diceFaces[faceIndices[0]],
      diceFaces[faceIndices[1]],
    ];

    const replyEmbed = new EmbedBuilder()
      .setColor(global.config.colors.default)
      .setTitle(`${interaction.user.tag} rolls a dice...`)
      .setDescription(`${die[0]} ${die[1]} (${faceIndices[0]} ${faceIndices[1]})\nTotal: **${faceIndices[0] + faceIndices[1] + 2}**`)

    return interaction.reply({
      embeds: [replyEmbed],
      ephemeral: Boolean(options.get("hidden")?.value),
    });
  }
}