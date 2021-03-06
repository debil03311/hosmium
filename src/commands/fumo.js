const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

const { FumoClient } = require("fumo-api");
const fumoApi = new FumoClient();

const videoFormats = ["mp4", "webm", "mkv", "mov"];

const commandData = new SlashCommandBuilder()
  .setName("fumo")
  .setDescription("ᗜˬᗜ")

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("id")
    .setDescription("The ID of a fumo picture or video"))

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

module.exports = {
  aliases: ["fumos", "fumofumo", "ᗜˬᗜ"],
  data: commandData,

  async execute(interaction, options) {
    const id = options.get("id")?.value;

    try {
      const fumo = (id)
        ? await fumoApi.specific(id)
        : await fumoApi.random()

      const fileExtension = fumo.URL
        .split("/").reverse()[0] // filename
        .split(".").reverse()[0] // extension
      
      const isVideo = videoFormats.includes(fileExtension);
      
      const fumoEmbed = new EmbedBuilder()
        .setColor(global.config.colors.default)
        .setURL(fumo.URL)
        .setTitle("Open Image")
        .setDescription("<:cirnofancy:955234989698592778> Your fumo, good sir.")
        .setFooter({
          text: `ID: ${fumo._id}`,
        })
      
      if (!isVideo)
        fumoEmbed.setImage(fumo.URL);
      
      interaction.reply({
        embeds: [ fumoEmbed ],
        ephemeral: Boolean(options.get("hidden")?.value),
      });
      
      // TODO: Find a way to embed video files.
      (isVideo) && interaction.message.channel.send(fumo.URL);
    }
    
    catch (ERROR) {
      console.error(ERROR);
      return interaction.reply({
        content: "```arm\n" + ERROR + "```",
        ephemeral: Boolean(options.get("hidden")?.value),
      });
    }
  }
}