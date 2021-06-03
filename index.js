// Imports
const fs = require("fs");
const Discord = require("discord.js");
const commandFolder = fs.readdirSync("./src/commands");
<<<<<<< HEAD
=======

>>>>>>> 3741d88e9cd325178aaf3e5b951d597a90af0c66
const dotenv = require("dotenv");
dotenv.config();
const prefix = process.env.PREFIX;

// Instantiation of client, commands and queue
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.queue = new Discord.Collection();

// Read commands
for (const folder of commandFolder) {
  const commandFiles = fs
    .readdirSync(`./src/commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./src/commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

// Client status
client.once("ready", () => {
  console.log("Ready!");
});
client.once("reconnecting", () => {
  console.log("Reconnecting...");
});
client.once("disconnect", () => {
  console.log("Disconnecting...");
});

// Client reactions on message
client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName))
    return message.reply("I do not know this command!");

  const command = client.commands.get(commandName);

  // Execution
  try {
    command.execute(message, args);
  } catch (error) {
    message.reply("I could not execute the command!");
    console.log(error);
  }
});

client.login(process.env.TOKEN);
