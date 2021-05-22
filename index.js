// Imports
const fs = require('fs')
const Discord = require('discord.js');
const commandFolder = fs.readdirSync('./commands')
const { prefix, token, init_channel_id } = require('./config.json');
const ytdl = require('ytdl-core');

// Instantiation of client, commands and queue
const client = new Discord.Client();
client.commands = new Discord.Collection();
const queue = new Map();

// Read commands
for (const folder of commandFolder) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

// Client status
client.once('ready', () => {
    console.log('Ready!');
    client.channels.fetch(init_channel_id).then(channel => {
        channel.send('Kei is ready for testing!')
    });
});
client.once('reconnecting', () => {
    console.log('Reconnecting...')
});
client.once('disconnect', () => {
    console.log('Disconnecting...')
});

// Client reactions on message
client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    if (!client.commands.has(commandName)) return message.reply('I do not know this command!');

    const command = client.commands.get(commandName);

    // Execution
    try {
        command.execute(message, args);
    } catch (error) {
        message.reply('I could not execute the command!');
        console.log(error);
    }
})

client.login(token);