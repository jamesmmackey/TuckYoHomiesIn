// Import dotenv, and Discord API

require('dotenv').config()
const Discord = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');

// Declare a variable to store the bedtime for each user and a variable for the number of times kissed. 
let bedtimes = {};
let kisscount = {};
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

let prefix = "!";
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  });
  
  
  // Reads for message event from discord API, checks for command, then executes the command.
client.on('messageCreate', message => {

  if (message.content.startsWith(`!prefix`)) {
    if (message.content.split(" ").length != 2) {
      return message.reply("Please provide exactly one non-alphanumeric character as the new prefix.");
    }
    const newPrefix = message.content.split(" ")[1];
    if (newPrefix.length != 1 || /^\w/.test(newPrefix)) {
      return message.reply("Please provide exactly one non-alphanumeric character as the new prefix.");
    }
    prefix = newPrefix;
    message.reply(`Prefix changed to ${prefix}`);
  }


 // !tuckin command
else if (message.content.startsWith(`${prefix}tuckin`)) {
  if (!message.mentions.members.size) {
    return message.reply('You need to mention a user to tuck them in.');
  }
  const member = message.mentions.members.first();
  const goodnightMessages = [
    `${member} has been tucked in! 🛌😴`,
    `${member} is snug as a bug in a rug! 🐞🛏️`,
    `Sleep tight ${member}, don't let the bedbugs bite! 💤😴`,
    `${member} is snugglin' with the monster under their bed! 🦕🛏️`,
    `${member} is participating in Tuck Yo Homies in 2k23! 💤😴`,
    `Can't wait to wake up next to you, ${member}`,
    `${member} is counting sheep!🐑💤`,
    `${member}, may both sides of your pillow be cold. 🛏️💤`, 
  ];
  const randomIndex = Math.floor(Math.random() * goodnightMessages.length);
  message.channel.send(goodnightMessages[randomIndex]);
}
  // !smooch command
else if (message.content.startsWith(`${prefix}smooch`)) {
  if (!message.mentions.members.size) {
    return message.reply('You need to mention a user to kiss them on the forehead.');
  }
  const member = message.mentions.members.first();

  if (member.id === message.author.id) {
    return message.reply("You can't kiss yourself on the forehead!");
  }

  if (!kisscount[member.id]) {
    kisscount[member.id] = 1;
  } else {
    kisscount[member.id]++;
  }
  message.channel.send(`${member} has been kissed on the forehead ${kisscount[member.id]} times! 😘😴`);
}
// !smoochleaderboard command
else if (message.content.startsWith(`${prefix}kisscount`)) {
  const leaderboard = Object.entries(kisscount)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count], i) => `${i + 1}. <@${id}> has ${count} kisses`)
    .join('\n');

  message.channel.send(`Kiss Leaderboard:\n${leaderboard}`);
}
  // !help command
  else if (message.content.startsWith(`${prefix}help`)) {
    message.reply(`Commands:
- !tuckin [mention]: Tucks in the mentioned user
- !smooch [mention]: Kisses the mentioned user on the forehead
- !nightlight: Have the bot turn a lamp on for you!
- !kisscount: Displays a leaderboard of members in the server who have been smooched! 
- !bedtime HH:MM: Sets a users bedtime and reminds them when its time for bed!
- !mybedtime: Shows the users current set bedtime
- !clearbedtime: Clears a users current bedtime (Be careful, you gotta get your rest!)`);
  }
// Add the bedtime for a user when the !bedtime command is received
else if (message.content.startsWith(`${prefix}bedtime`)) {
  const member = message.member;
  const time = message.content.split(" ")[1];
  const timeRegex = /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!time) {
    return message.reply('You need to specify a time to set your bedtime.');
  }
  if (!timeRegex.test(time)) {
    return message.reply('The time should be in the format [HH:MM]');
  }
  bedtimes[member.id] = time;
  message.reply(`Your bedtime has been set for ${time}.`);
  setTimeout(() => {
    message.channel.send(`<@${member.id}>, it's now ${time}! Time for bed! 🛌😴`);
  }, calculateTimeDifference(time));
}

// Return the bedtime for the user when the !mybedtime command is received
else if (message.content.startsWith(`${prefix}mybedtime`)) {
  const member = message.member;
  if (!bedtimes[member.id]) {
    return message.reply("You haven't set your bedtime yet! Use the !bedtime command to set your bedtime.");
  }
  message.reply(`Your bedtime is set for ${bedtimes[member.id]}`);
}
else if (message.content.startsWith(`${prefix}clearbedtime`)) {
  const member = message.member;
  if (!bedtimes[member.id]) {
    return message.reply("You haven't set your bedtime yet!");
  }
  delete bedtimes[member.id];
  message.reply("Your bedtime has been cleared.");
}

// Future !story command. Awaiting good bedtime stories.
// else if (message.content.startsWith(`${prefix}story`)) {
//   const storyMessages = [
//     "Once upon a time, there was a little girl named Little Red Riding Hood...",
//     "In a faraway kingdom, there lived a young prince who was cursed by a wicked witch...",
//     "A long, long time ago, there was a kind and generous king who ruled over a peaceful kingdom...",
//     "There was once a brave knight who set out on a quest to defeat a terrible dragon...",
//     "Deep in the heart of a dense forest, there lived a wise old owl who loved to tell stories..."
//   ];
//   const randomIndex = Math.floor(Math.random() * storyMessages.length);
//   message.channel.send(storyMessages[randomIndex]);
// }

// Nightlight command
else if (message.content.startsWith(`${prefix}nightlight`)) {
  return message.reply("```\n" +
  "#########::::::::::########\n" +
  "##########::::::::#########\n" +
  "###########::::::##########\n" +
  "###########,---.###########\n" +
  "##########/`---'\##########\n" +
  "#########/       \#########\n" +
  "########/         \########\n" +
  "#######:`-._____.-':#######\n" +
  "######::::: ( ) |::::######\n" +
  "#####:::::: ) ( o:::::#####\n" +
  "####::::: .-(_)-. :::::####\n" +
  "###:::::: '=====' ::::::###\n" +
  "###########################\n" +
  "```");
}
})
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


