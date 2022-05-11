const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const cloudscraper = require("cloudscraper");
const cheerio = require("cheerio");

const badWords = (()=> { 
  try {
    return require(`${__dirname}/data/bad_words.json`);
  } catch (ERROR) {
    console.log(ERROR.message);
    return [];
  }
})()

const baseUrl = "http://results.dogpile.com/serp";

function makeUrl(query) {
  const url = new URL(baseUrl);
  url.searchParams.set("qc", "images");
  url.searchParams.set("q", query);

  return url.toString()
}

const commandData = new SlashCommandBuilder()
  .setName("image")
  .setDescription("Search the web for an image")

  .addStringOption((option)=> option
    .setRequired(true)
    .setName("query")
    .setDescription("What to search for"))

  .addStringOption((option)=> option
    .setRequired(false)
    .setName("hidden")
    .setDescription("Only you will see the bot's reply")
    .addChoices(global.utils.toChoiceObject("yes")))
  .toJSON()

module.exports = {
  aliases: ["img", "picture", "pic"],
  data: commandData,
  
  async execute(interaction, options) {
    const query = options.get("query").value;

    let isBadWord = false;

    for (const word of query.replace(/[^\w\s]+/, "").split(" ")) {
      if (badWords.includes(word)) {
        isBadWord = true;
        break;
      }
    }
    
    const response = await cloudscraper.get({
      url: makeUrl(query),
      headers: {
        cookie: "ws_prefs=vr=1&af=Heavy&sh=False",
      }
    });

    const $$ = cheerio.load(response);
    const urls = [...$$('.image a.link')]
      .map((anchor)=> anchor.attribs.href)
    
    if (!urls.length) {
      const errorEmbed = new MessageEmbed()
        .setColor(global.config.colors.failure)
        .setTitle(`The query __${query}__ yielded no results.`)

      if (isBadWord)
        errorEmbed.setDescription(`${global.emoji.froup} wtf is wrong with you`)

      return interaction.reply({
        embeds: [errorEmbed],
        ephemeral: Boolean(options.get("hidden")?.value),
      });
    }
    
    const limit = 10;
    const resultAmount = (urls.length < limit)
      ? urls.length
      : limit
    
    const resultIndex = Math.floor(Math.random() * resultAmount);
    const imageUrl = urls[resultIndex];
    
    const imageEmbed = new MessageEmbed()
      .setColor(global.config.colors.default)
      .setURL(imageUrl)
      .setTitle("Open Image")
      .setImage(imageUrl)
      .addField("Query", query, true)
      .addField("Result", `${resultIndex + 1} of ${resultAmount}`, true)
    
    if (isBadWord)
      imageEmbed.addField("\u2800", global.emoji.froup, true);
    
    return interaction.reply({
      embeds: [imageEmbed],
      ephemeral: Boolean(options.get("hidden")?.value),
    });
  }
}