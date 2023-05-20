# hosmium <img src="https://i.imgur.com/wQIGnlD.png" style="width: 64px; float: left; padding-right: 1em;">

Another Discord bot that hopefully does what it should... now with types!

## Setup

0. Make sure [Node.js](https://nodejs.org/en) is installed
1. Clone this repository to your machine
   ```bash
   $ git clone https://github.com/debil03311/hosmium
   ```
2. Enter the project directory
   ```bash
   $ cd hosmium
   ```
3. Install the dependencies with your package manager of choice.
   ```bash
   $ # With Yarn:
   $ yarn install
   ```
   ```bash
   $ # With NPM:
   $ npm i
   ```
4. Make a copy of the `.env.template` file and rename it to `.env`
   ```bash
   $ cp .env.template .env
   ```
5. Open the new `.env` with any text editor and type in your API keys and stuff.
   Only `DISCORD_BOT_TOKEN` is required, everything else is optional but certain commands won't work without the appropriate keys.
   Make sure to save the file before closing it.
   ```bash
   $ nano .env
   ```
6. Start the bot
   ```bash
   $ # With Yarn:
   $ yarn dev
   ```
   ```bash
   $ # With NPM:
   $ npm run dev
   ```