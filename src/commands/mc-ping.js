const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { pingWithPromise } = require("minecraft-ping-js");

async function makeEmbed(address, port) {
  const data = await pingWithPromise(address, port)
    .catch((ERROR)=> ERROR)

  if (data instanceof Error) {
    return new MessageEmbed()
      .setColor(global.config.colors.failure)
      .setThumbnail(global.config.images.minecraft.server.gray)
      .setTitle(`${address}:${port}`)
      .setDescription(`\`${data}\``)
  }

  const infoEmbed = new MessageEmbed()
    .setColor(global.config.colors.minecraft)
    .setThumbnail(global.config.images.minecraft.server.color)
    .setTitle(`${address}:${port}`)
    .addField("Version", data.version.name, true)
    .addField("Online", `${data.players.online}/${data.players.max}`, true)
  
  if (data.description.text)
    infoEmbed.setDescription(data.description.text);

  if (data.description.extra) {
    const extraString = data.description.extra
      .map((item)=> item.text.replace(/\n/g, ""))
      .join("・")

    if (infoEmbed.description)
      infoEmbed.description += newline + extraString;
    else
      infoEmbed.description = extraString
  }

  if (data.players.sample?.length) {
    infoEmbed.addField(
      "Players",
      data.players.sample
        // Remove minecraft formatting codes and make players italic
        .map((player)=> global.utils.wrapText(
          player.name.replace(/§./g, ""), "*"))
        .join(" ")
        .slice(0, 1000),
      false)
  }

  return infoEmbed;
}

const commandData = new SlashCommandBuilder()
  .setName("mc-ping")
  .setDescription("Get information about a Minecraft server")

  .addStringOption((option)=> option
    .setRequired(true)
    .setName("address")
    .setDescription("The IP or address of the server"))

  .addNumberOption((option)=> option
    .setRequired(false)
    .setName("port")
    .setDescription("The server port (25565 by default)"))

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

module.exports = {
  data: commandData,
  makeEmbed: makeEmbed,
  
  async execute(interaction, options) {
    const address = options.get("address").value;
    const port = options.get("port")?.value || 25565;

    const infoEmbed = await makeEmbed(address, port);
    const isHidden = Boolean(options.get("hidden")?.value);

    return interaction.reply({
      embeds: [infoEmbed],

      // this sucks ill have to rewrite it at some point
      components: (isHidden)
        ? null
        : [
          new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId("minecraft_server_refresh")
                .setLabel("Refresh")
                .setStyle("SECONDARY"))
        ]
      ,

      ephemeral: Boolean(options.get("hidden")?.value),
    });
  }
}