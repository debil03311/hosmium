const { Routes } = require("discord-api-types/v9");
const { readdirSync } = require("fs");

const commandFiles = readdirSync(`${__dirname}/commands/`)
  // Only files ending in .js
  .filter((filename)=> filename.endsWith(".js"))

const commands = [];

for (const commandFilename of commandFiles) {
  const command = require(`${__dirname}/commands/${commandFilename}`);
  commands.push(command);
}

module.exports = commands;