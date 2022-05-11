const { SlashCommandBuilder } = require("@discordjs/builders");

const timeDivisors = {
  milliseconds: 1,
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  days: 1000 * 60 * 60 * 24,
  weeks: 1000 * 60 * 60 * 24 * 7,
  months: 1000 * 60 * 60 * 24 * 7 * 4,
  years: 1000 * 60 * 60 * 24 * 7 * 4 * 12,
}

const unitAbbreviations = {
  milliseconds: "ms",
  seconds: "s",
  minutes: "m",
  hours: "h",
  days: "d",
  weeks: "w",
}

const commandData = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Un momento, señor.")

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("unit")
    .setDescription("The unit of time."))

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

// Set unit options based on the abbreviations object's keys
commandData.options[0].choices =
  Object.keys(unitAbbreviations).map(global.utils.toChoiceObject)

module.exports = {
  data: commandData,
  
  execute(interaction, options) {
    // Subtract current milliseconts from the interaction's
    const milliseconds = new Date() - interaction.createdTimestamp;

    // Get the full unit name from the appropriate
    // interaction option, if none make it milliseconds
    const unitLong = options.get("unit")?.value || "milliseconds";
    const unitShort = unitAbbreviations[unitLong];

    const finalTime = (milliseconds / timeDivisors[unitLong]);

    return interaction.reply({
      content: `${global.emoji.mxneco} ${finalTime}${unitShort}, señor.`,
      ephemeral: Boolean(options.get("hidden")?.value),
    });
  }
}