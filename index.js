// Import dotenv, and Discord API

require('dotenv').config()
const Discord = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');


// Declare a variable to store the bedtime for each user and a variable for the number of times kissed. 
let bedtimes = {};
let kisscount = {};
let tuckcount = {};
const timeouts = {};

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

  // Command to change prefix
  // if (message.content.startsWith(`!prefix`)) {
  //   if (message.content.split(" ").length != 2) {
  //     return message.reply("Please provide exactly one non-alphanumeric character as the new prefix.");
  //   }
  //   const newPrefix = message.content.split(" ")[1];
  //   if (newPrefix.length != 1 || /^\w/.test(newPrefix)) {
  //     return message.reply("Please provide exactly one non-alphanumeric character as the new prefix.");
  //   }
  //   prefix = newPrefix;
  //   message.reply(`Prefix changed to ${prefix}`);
  // }


 // !tuckin command
 if (message.content.startsWith(`${prefix}tuckin`)) {
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
  if (!tuckcount[message.author.id]) {
    tuckcount[message.author.id] = 1;
  } else {
    tuckcount[message.author.id]++;
  }
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
  
    if (!kisscount[message.author.id]) {
      kisscount[message.author.id] = 1;
    } else {
      kisscount[message.author.id]++;
    }
    message.channel.send(`${message.author} has given ${member} a kiss on the forehead! 😘😴`);
  }

// !leaderboard command
else if (message.content.startsWith(`${prefix}leaderboard`)) {
  let kissleaderboard = '';
  let tuckleaderboard = '';

  if (Object.keys(kisscount).length > 0) {
    kissleaderboard = Object.entries(kisscount)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count], i) => `${i + 1}. <@${id}> has given out ${count} kisses`)
      .join('\n');
  } else {
    kissleaderboard = 'No entries in the kiss leaderboard';
  }

  if (Object.keys(tuckcount).length > 0) {
    tuckleaderboard = Object.entries(tuckcount)
      .sort((a, b) => b[1] - a[1])
      .map(([id, count], i) => `${i + 1}. <@${id}> has tucked in ${count} homies`)
      .join('\n');
  } else {
    tuckleaderboard = 'No entries in the tuck leaderboard';
  }

  let total = {};
  for (const [id, kissCount] of Object.entries(kisscount)) {
    if (!total[id]) {
      total[id] = kissCount * 2;
    } else {
      total[id] += kissCount * 2;
    }
  }
  for (const [id, tuckCount] of Object.entries(tuckcount)) {
    if (!total[id]) {
      total[id] = tuckCount;
    } else {
      total[id] += tuckCount;
    }
  }

  let winner;
  if (Object.keys(total).length > 0) {
    const [id, score] = Object.entries(total)
      .sort((a, b) => b[1] - a[1])
      .reduce((a, b) => a[1] > b[1] ? a : b);
    winner = client.users.cache.get(id);
  } else {
    winner = 'No entries in the total leaderboard';
  }

  message.channel.send(`**The Most Affectionate Homie is...🥁** <@${winner.id || winner}>!🎉🏆\n \nKiss Leaderboard💋:\n${kissleaderboard}\n\nTuck-in Leaderboard🛏️:\n${tuckleaderboard}`);
}


  // !help command
  else if (message.content.startsWith(`${prefix}help`)) {
    message.reply(`Commands:
- !tuckin [mention]: Tucks in the mentioned user
- !smooch [mention]: Kisses the mentioned user on the forehead
- !nightlight: Have the bot turn a lamp on for you!
- !bigtext: Makes your message bigger!
- !coinflip: Flip a coin!
- !magic8ball: Ask the Magic 8-Ball a question!
- !choose: Chooses something off a list for you!
- !leaderboard: Displays a leaderboard for everyone in the running for Most Affectionate Homie! 
- !bedtime HH:MM: Sets a users bedtime and reminds them when its time for bed! Please ensure your input is in a 24 hr time format and in the UTC timezone (Timezone support coming soon!)
- !mybedtime: Shows the users current set bedtime
- !clearbedtime: Clears a users current bedtime (Be careful, you gotta get your rest!)`);
  }

  
// Add or update the bedtime for a user when the !bedtime command is received
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

  // If user already has a bedtime set, delete the old timeout
  const oldTimeoutId = timeouts[member.id];
  if (oldTimeoutId) {
    clearTimeout(oldTimeoutId);
    delete timeouts[member.id];
  }

  bedtimes[member.id] = time;
  message.reply(`Your bedtime has been set for ${time}.`);

  // Calculate the time until bedtime in milliseconds
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset();
  const bedtime = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), time.split(':')[0], time.split(':')[1], 0));
  const timeUntilBedtime = bedtime.getTime() - (now.getTime() - timezoneOffset * 60 * 1000);

  // Set a timeout to ping the user at bedtime and store the timeout ID
  const timeoutId = setTimeout(() => {
    message.channel.send(`<@${member.id}>, it's now ${time}! Time for bed! 🛌😴`);
    delete bedtimes[member.id];
    delete timeouts[member.id];
  }, timeUntilBedtime);
  timeouts[member.id] = timeoutId;
}


//!mybedtime command
else if (message.content.startsWith(`${prefix}mybedtime`)) {
  const member = message.member;
  if (!bedtimes[member.id]) {
    return message.reply("You haven't set your bedtime yet! Use the !bedtime command to set your bedtime.");
  }
  const bedtime = bedtimes[member.id];

  message.reply(`Your bedtime is set for ${bedtime} in your local timezone.`);
}


// Clear the bedtime for the user when the !clearbedtime command is received
else if (message.content.startsWith(`${prefix}clearbedtime`)) {
  const member = message.member;
  if (!bedtimes[member.id]) {
    return message.reply("You haven't set your bedtime yet!");
  }
  const timeoutId = timeouts[member.id];
  if (timeoutId) {
    clearTimeout(timeoutId);
    delete timeouts[member.id];
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
  "##########/`---'\\##########\n" +
  "#########/       \\#########\n" +
  "########/         \\########\n" +
  "#######:`-._____.-':#######\n" +
  "######::::: ( ) |::::######\n" +
  "#####:::::: ) ( o:::::#####\n" +
  "####::::: .-(_)-. :::::####\n" +
  "###:::::: '=====' ::::::###\n" +
  "###########################\n" +
  "```");
}

// !bigtext command
else if (message.content.startsWith(`${prefix}bigtext`)) {
  const text = message.content.substring(`${prefix}bigtext`.length).trim();
  if (!text) {
    return message.reply('You need to enter some text to format.');
  }

  let bigText = '';
  for (let i = 0; i < text.length; i++) {
    if (/[a-zA-Z0-9]/.test(text[i])) {
      bigText += `:regional_indicator_${text[i].toLowerCase()}:`;
    } else if (text[i] === ' ') {
      bigText += '  ';
    } else if (text[i] === '?') {
      bigText += ':question:';
    } else if (text[i] === '!') {
      bigText += ':exclamation:';
    }
  }

  message.channel.send(bigText);
}

// !coinflip command
else if (message.content.startsWith(`${prefix}coinflip`)) {
  const flip = Math.floor(Math.random() * 2) === 0 ? 'heads' : 'tails';
  message.channel.send(`The coin landed on ${flip}!`);
}

// !magic8ball command
else if (message.content.startsWith(`${prefix}magic8ball`)) {
  const responses = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes - definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
  ];
  const response = responses[Math.floor(Math.random() * responses.length)];
  message.channel.send(`🎱 ${response}`);
}

// !choose command
else if (message.content.startsWith(`${prefix}choose`)) {
  const args = message.content.slice(prefix.length + 7).trim();
  if (!args.length) {
    return message.reply('Please provide a list of things separated by commas.');
  }
  const choices = args.split(',').map(choice => choice.trim().replace('or', ''));
  if (!choices.length) {
    return message.reply('Please provide a valid list of things separated by commas.');
  }
  const chosen = choices[Math.floor(Math.random() * choices.length)];
  message.channel.send(`🎲 I choose... ${chosen}`);
}



})
// // Function to calculate the difference between the current time and the requested bedtime.
// function calculateTimeDifference(time) {
//   const currentTime = new Date();
//   const bedtime = new Date();
//   bedtime.setHours(time.split(":")[0]);
//   bedtime.setMinutes(time.split(":")[1]);
//   bedtime.setSeconds(0);
//   bedtime.setMilliseconds(0);
//   const timeDifference = bedtime.getTime() - currentTime.getTime();
//   if (timeDifference < 0) {
//    const postimeDifference = timeDifference * -1;
//    return postimeDifference;}
//   else if (timeDifference > 0) {
//     return timeDifference;
//     }
// }

client.login(process.env.DISCORD_TOKEN);


