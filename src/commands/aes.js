const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");

const bitSizes = [128, 192, 256];
const aesEndpoint = new URL("http://rats.chat/aes.php");

/**
 * 
 * @param { String } method - encrypt/decrypt
 * @param { String } input 
 * @param { String } key 
 * @returns `String` Endpoint URL
 */
function makeUrl(method, input, key, bitSize) {
  // They get encoded automatically
  aesEndpoint.searchParams.set("method", method);
  aesEndpoint.searchParams.set("text", input);
  aesEndpoint.searchParams.set("key", key);
  aesEndpoint.searchParams.set("bits", bitSize);

  return aesEndpoint.toString();
}

const commandData = new SlashCommandBuilder()
  .setName("aes")
  .setDescription("Encrypt/decrypt input using the Advanced Encryption Standard")

  .addStringOption((option)=> option
    .setRequired(true)
    .setName("mode")
    .setDescription("Do what with the input?")
    .addChoices(global.utils.toChoiceObject("encrypt"))
    .addChoices(global.utils.toChoiceObject("decrypt")))

  .addStringOption((option)=> option
    .setRequired(true)
    .setName("input")
    .setDescription("The plain input to encrypt, or the encrypted string to decrypt"))

  .addStringOption((option)=> option
    .setRequired(true)
    .setName("key")
    .setDescription("The decryption key"))

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

module.exports = {
  data: commandData,

  async execute(interaction, options) {
    const [ method, input, key ] = options.data
      .map((option)=> option.value)

    const inputShort = global.utils.shortenText(input, 4);

    const replyEmbed = new MessageEmbed()
      .setColor(global.config.colors.success)
      .setDescription("")

    if (method === "decrypt") {
      // Decrypt with all bit sizes
      for (const bitSize of bitSizes) {
        try {
          const response = await axios.get(makeUrl(method, input, key, bitSize));

          // If the decryption with this key was successful,
          // add it to the embed. This also includes false-positives.
          if (response.data)
            replyEmbed.description += `\n**${bitSize}bit:** ${response.data}`;
        }

        catch (ERROR) {
          replyEmbed.setColor(global.config.colors.failure)
            .setTitle(":no_entry_sign: Something went wrong.")
            .setDescription(ERROR.toString())

          return console.error(ERROR);
        }
      }

      if (!replyEmbed.description) {
        delete replyEmbed.description;

        replyEmbed.setColor(global.config.colors.failure)
          .setTitle(`:lock: Failed decrypting \`${inputShort}\` with key \`${key}\`.`)
      }
    }
    
    else {
      // Encrypt with all bit sizes
      for (const bitSize of bitSizes) {
        try {
          const response = await axios.get(makeUrl(method, input, key, bitSize));
          replyEmbed.description += `\n**${bitSize}bit:** ${response.data}`;
        }

        catch (ERROR) {
          replyEmbed.setColor(global.config.colors.failure)
            .setTitle(":no_entry_sign: Something went wrong.")
            .setDescription(ERROR.toString())

          return console.error(ERROR);
        }
      }

      replyEmbed.setTitle(
        `:closed_lock_with_key: Encrypted \`${inputShort}\` with key \`${key}\``)
    }

    return interaction.reply({
      embeds: [replyEmbed],
      ephemeral: Boolean(options.get("hidden")?.value),
    });
  }
}