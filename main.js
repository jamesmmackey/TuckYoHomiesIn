// Import dotenv, and Discord API

require('dotenv').config()
const Discord = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');

// Declare Intents with Discord API

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.DirectMessages
	],
});

// Stores bot prefix and confirms bot is online in console.

const prefix = "!";
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  });

  // Reads for message event from discord API, checks for command, then executes the command.
client.on('messageCreate', message => {
  // !tuckin command
  if (message.content.startsWith('!tuckin')) {
    if (!message.mentions.members.size) {
      return message.reply('You need to mention a user to tuck them in.');
    }
    const member = message.mentions.members.first();
    message.channel.send(`${member} has been tucked in! 🛌😴`);
  }
  // !smooch command
   else if (message.content.startsWith('!smooch')) {
    if (!message.mentions.members.size) {
      return message.reply('You need to mention a user to kiss them on the forehead.');
    }
    const member = message.mentions.members.first();
    message.channel.send(`${member} has been kissed on the forehead! 😘😴`);
  }
  // !help command
  else if (message.content.startsWith('!help')) {
    message.reply(`Commands:
- !tuckin [mention]: Tucks in the mentioned user
- !smooch [mention]: Kisses the mentioned user on the forehead
- !bedtime HH:MM: Sets a users bedtime and reminds them when its time for bed!`);
  }
  // !bedtime command
  else if (message.content.startsWith('!bedtime')) {
    const member = message.member;
    const time = message.content.split(" ")[1];
    const timeRegex = /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!time) {
      return message.reply('You need to specify a time to set your bedtime.');
    }
    if (!timeRegex.test(time)) {
      return message.reply('The time should be in the format [HH:MM]');
    }
    message.reply(`Your bedtime has been set for ${time}.`);
    setTimeout(() => {
      message.channel.send(`<@${member.id}>, it's now ${time}! Time for bed! 🛌😴`);
    }, calculateTimeDifference(time));
  }
// !mybedtime command
else if (message.content.startsWith('!mybedtime')) {
  const member = message.member;
  if (!member.bedtime) {
    return message.reply(`You haven't set your bedtime yet! Use the !bedtime command to set your bedtime.`);
  }
  message.reply(`Your bedtime is set for ${member.bedtime}.`);
}
});

// Function to calculate the difference between the current time and the requested bedtime.
function calculateTimeDifference(time) {
  const currentTime = new Date();
  const bedtime = new Date();
  bedtime.setHours(time.split(":")[0]);
  bedtime.setMinutes(time.split(":")[1]);
  bedtime.setSeconds(0);
  bedtime.setMilliseconds(0);
  const timeDifference = bedtime.getTime() - currentTime.getTime();
  if (timeDifference < 0) {
   const postimeDifference = timeDifference * -1;
   return postimeDifference;}
  else if (timeDifference > 0) {
    return timeDifference;
    }
}

client.login(process.env.DISCORD_TOKEN);
