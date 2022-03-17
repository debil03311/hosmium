# hosmium

A Discord bot that will hopefully do things.

## Setup

1. Create a file called `config.json` in hosmium's root directory (where `main.js` is located)
2. Open it and paste this inside:
   ```json
   {
       "prefix": "h!",
       "color": "#987353",
       "commandsDirectory": "./commands",
       "botLogoImage": "https://example.com/logo.png",
       "deeplApiKey": "PUT YOUR DEEPL API KEY HERE",
       "botToken": "PUT YOUR DISCORD BOT'S TOKEN HERE"
   }
   ```
3. Make modifications as you see fit
4. Run `npm init` inside hosmium's root directory
5. Run `npm i` inside hosmium's root directory
6. Run `node main.js` with [Node.js](https://nodejs.org/en/) (v15 or higher)