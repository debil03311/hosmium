const { SlashCommandBuilder } = require("discord.js");
const { readFileSync } = require("node:fs");

const commandData = new SlashCommandBuilder()
  .setName("eval")
  .setDescription("oh the misery")

  .addStringOption((option)=> option
    .setRequired(true)
    .setName("js")
    .setDescription("suffering"))

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

module.exports = {
  data: commandData,
  
  execute(interaction, options) {
    try {
      // See if there's an eval_lock file in the current directory
      readFileSync(`${__dirname}/eval.lock`);

      // If there is, check if the user is you
      if (interaction.user != "180938477372702720") {
        // If it's not, send the grape
        return interaction.reply(
          "https://tenor.com/view/elma-amogus-elma-amogus-gif-22993792")
      }

      // If the user is you, continue to eval
    } catch {}

    const expression = options.get("js").value;
    let result;
    
    try {
      result = eval(expression);
    } catch (ERROR) {
      result = ERROR;
    }

    return interaction.reply({
      content: "```js\n" + result + "```",
      ephemeral: Boolean(options.get("hidden")?.value),
    });
  }
}