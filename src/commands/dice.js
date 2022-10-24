const { Interaction, MessageEmbed, SlashCommandBuilder } = require("discord.js");

const commandData = new SlashCommandBuilder()
  .setName("COMMAND_NAME")
  .setDescription("COMMAND_DESCRIPTION")

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("OPTION_NAME")
    .setDescription("OPTION_DESCRIPTION"))

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

    const replyEmbed = new MessageEmbed()
      .setColor(global.config.colors.default)
      .setTitle(`**${interaction.user.tag}** rolls a dice... ${die[0]} ${die[1]} (${faceIndices[0]} ${faceIndices[1]})`)
      .setDescription(`Total: **${faceIndices[0] + faceIndices[1]}**`)

    return interaction.reply({
      embeds: [replyEmbed],
      ephemeral: Boolean(options.get("hidden")?.value),
    });
  }
}