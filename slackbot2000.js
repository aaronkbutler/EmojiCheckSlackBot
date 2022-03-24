const { App } = require("@slack/bolt");

const EmojiTranslate = require("./emoji.js");

require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);
const twilioNumber = process.env.TWILIO_NUMBER;

const channelIds = { goodVibez: process.env.GOOD_VIBEZ, badVibez: process.env.BAD_VIBEZ, botResponse: process.env.BOT_RESPONSE, testBot: process.env.TEST_BOT };

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});

async function sendMessages(phoneNumbers, jsonData) {
  for (const phoneNumber of phoneNumbers) {
    const message = client.messages.create({
      body: JSON.stringify(jsonData, ["type", "score", "ratio", "keywords", "word", "result_code", "result_msg"], 4),
      from: twilioNumber,
      to: phoneNumber
    });
  }
}

app.message(async ({ message, say }) => {
  //console.log(message);
  if(message.channel !== channelIds.badVibez) {
  //    console.log(message.text);
      if(message.text.toLowerCase().includes("bagel")) {
         try {
             await app.client.reactions.add({ token: process.env.SLACK_BOT_TOKEN, channel: message.channel, name: "bageling", timestamp: message.ts});
         } catch (error) {
             console.log(error);
         }
      }
      if(message.text.toLowerCase().includes("chabad")) {
         try {
             await app.client.reactions.add({ token: process.env.SLACK_BOT_TOKEN, channel: message.channel, name: "rebbe", timestamp: message.ts});
         } catch (error) {
             console.log(error);
         }
      }
      for (const emoji of EmojiTranslate.translate(message.text, true)) {
          //console.log("Emoji: " + emoji + ".");
	  if (emoji !== '' /*&& emoji.length > 1*/) {
              //console.log(emoji);
	      try {
		//console.log(emoji);
                await app.client.reactions.add({ token: process.env.SLACK_BOT_TOKEN, channel: message.channel, name: emoji.toLowerCase(), timestamp: message.ts});
              } catch (error) {
                  console.log(error);
              }
          }
      }
  }
});

(async () => {
  const port = 5001
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡ Slack Bolt app is running on port ${port}!`);
})();
