require('dotenv').config()
const Discord = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.DirectMessages
	],
});
const prefix = "!";
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  });

// client.on('messageCreate', message => {
//   //console.log(`Received message: ${message.content}`)
//   if (message.content === '!tuckin') {
//     const member = message.mentions.members.first();
//     console.log(message.mentions.members);
//     if (!member) {
//       return message.reply('You need to mention a user to tuck them in.');
//     }
//     message.channel.send(`${member} has been tucked in! 🛌😴`);
//   }
// });

// client.on('messageCreate', message => {
//   console.log(`Received message: ${message.content}`)
//   if (message.content.startsWith('!tuckin')) {
//     if (!message.mentions.members.size) {
//       return message.reply('You need to mention a user to tuck them in.');
//     }
//     const member = message.mentions.members.first();
//     console.log(member);
//     message.channel.send(`${member} has been tucked in! 🛌😴`);
//   }
// });

client.on('messageCreate', message => {
  // console.log(`Received message: ${message.content}`)
  if (message.content.startsWith('!tuckin')) {
    if (!message.mentions.members.size) {
      return message.reply('You need to mention a user to tuck them in.');
    }
    const member = message.mentions.members.first();
    // console.log(member);
    message.channel.send(`${member} has been tucked in! 🛌😴`);
  } else if (message.content.startsWith('!smooch')) {
    if (!message.mentions.members.size) {
      return message.reply('You need to mention a user to kiss them on the forehead.');
    }
    const member = message.mentions.members.first();
    // console.log(member);
    message.channel.send(`${member} has been kissed on the forehead! 😘😴`);
  } else if (message.content.startsWith('!help')) {
    message.reply(`Commands:
- !tuckin [mention]: Tucks in the mentioned user
- !smooch [mention]: Kisses the mentioned user on the forehead
- !bedtime [HH:MM]: Sets a users bedtime and reminds them when its time for bed!`);
  } else if (message.content.startsWith('!bedtime')) {
    const member = message.member;
    const time = message.content.split(" ")[1];
    if (!time) {
      return message.reply('You need to specify a time to set your bedtime.');
    }
    message.reply(`Your bedtime has been set for ${time}.`);
    setTimeout(() => {
      message.channel.send(`<@${member.id}>, it's now ${time}! Time for bed! 🛌😴`);
    }, calculateTimeDifference(time));
  }
});

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




