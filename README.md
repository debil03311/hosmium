# hosmium

A Discord bot that will hopefully do things.

## Setup

1. Create a file called `config.json` in hosmium's root directory (where `main.js` is located)
2. Open it and paste this inside:
   ```json
   {
      "prefix": "h!",
      "commandsDirectory": "./commands",
      "botLogoImage": "https://i.imgur.com/wQIGnlD.png",

      "color": "#987353",
      "colorFailure": "#F05454",
      "colorSuccess": "#03C4A1",

      "deeplApiKey": "2c42b8e2-3ab3-7589-d673-da90833d4f47:fx",
      "botToken": "OTUyNjUxODMyMDc1ODg2NjAz.Yi5IKA.2agqmCBPbBJFDLZ81dn4jdrtUzk"
   }
   ```
3. Make modifications as you see fit
4. Run `npm init` inside hosmium's root directory
5. Run `npm i` inside hosmium's root directory
6. Run `node main.js` with [Node.js](https://nodejs.org/en/)