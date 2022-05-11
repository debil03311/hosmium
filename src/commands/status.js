const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const commandData = new SlashCommandBuilder()
  .setName("status")
  .setDescription("Details about the bot")

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

module.exports = {
  aliases: ["info", "stats", "statistics"],
  data: commandData,

  execute(interaction, options) {
    const bot = interaction.client

    // bot.uptime is expressed in milliseconds
    const uptime = {
      miliseconds: Math.floor(bot.uptime) % 1000,
      seconds:     Math.floor(bot.uptime / 1000) % 60,
      minutes:     Math.floor(bot.uptime / 1000 / 60) % 60,
      hours:       Math.floor(bot.uptime / 1000 / 60 / 60) % 24,
      days:        Math.floor(bot.uptime / 1000 / 60 / 60 / 24) % 7,
    }
    
    // Formatted time string
    const uptimeString =
      `${uptime.days}d ${uptime.hours}h ${uptime.minutes}m`;
    
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(global.config.colors.default)

          .addField(
            "Uptime",
            uptimeString,
            true)
          .addField(
            "Ping",
            new Date() - interaction.createdTimestamp + "ms",
            true)
          .addField(
            "Memory",
            Math.floor(process.memoryUsage().heapUsed / 1024 / 1024) + "MB",
            true)
          .addField(
            "Birthday",
            bot.user.createdAt.toLocaleDateString("JA"),
            true)
          .addField(
            "Servers",
            bot.guilds.cache.size.toString(),
            true)
          .addField(
            "Node",
            process.version,
            true)

          .setFooter({
            text: `${bot.user.username}#${bot.user.discriminator}`,
            iconURL: global.config.images.logo,
          })
      ],

      ephemeral: Boolean(options.get("hidden")?.value),
    });
  }
}