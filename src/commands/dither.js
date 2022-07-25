const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

// const jimp = require("jimp");
// const mcfsd = require("mcfsd");

let intensityDefault = 32;

const commandData = new SlashCommandBuilder()
  .setName("dither")
  .setDescription("Apply a dithering effect to an image")

  .addAttachmentOption((option)=> option
    .setRequired(true)
    .setName("image")
    .setDescription("The image you want to dither"))

  .addNumberOption((option)=> option
    .setRequired(false)
    .setName("intensity")
    .setDescription(`% of dithering to apply (${intensityDefault}% by default)`))

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

module.exports = {
  data: commandData,
  
  async execute(interaction) {
    console.log(interaction.options.__proto__);
    console.log(interaction.options.get("image"));
    console.log(interaction.options.getAttachment("image"));

    const replyEmbed = new EmbedBuilder()
      .setTitle("EMBED TITLE")
      .setDescription("EMBED DESCRIPTION")

    return interaction.reply({
      embeds: [replyEmbed],
      ephemeral: Boolean(interaction.options.get("hidden")?.value),
    });
  }
}