const {
  displayAllCommandsEmbed,
  displaySingleCommandEmbed,
} = require("../../utils/embeds");
const Discord = require("discord.js");
const prefix = process.env.PREFIX;

module.exports = {
  name: "help",
  category: "utility",
  description: "Displays help for commands.",
  usage: "`kt!help <command>(optional)`",

  async execute(message, args) {
    const commandList = Array.from(message.client.commands.values());

    const commandCategories = {};
    for (const commandObject of commandList) {
      if (!commandCategories[commandObject.category]) {
        commandCategories[commandObject.category] = [commandObject.name];
      } else {
        commandCategories[commandObject.category].push(commandObject.name);
      }
    }

    const fieldDescription = [];
    for (const category in commandCategories) {
      const embedField = {
        name: category[0].toUpperCase() + category.slice(1),
        value: "",
      };
      for (const categoryCommand of commandCategories[category]) {
        if (
          categoryCommand !==
          commandCategories[category][commandCategories[category].length - 1]
        ) {
          embedField.value += `\`${categoryCommand}\`, `;
        } else {
          embedField.value += `\`${categoryCommand}\``;
        }
      }
      fieldDescription.push(embedField);
    }

    if (args == "") {
      const displayAllCommands = new Discord.MessageEmbed(
        displayAllCommandsEmbed(
          "Kei Commands",
          `Usage: \`kt!help <command>(optional)\`
          
          Enter a command as an argument to find out more about the command!`
        )
      ).addFields(...fieldDescription);
      return message.channel.send(displayAllCommands);
    } else {
      const commandNames = Array.from(message.client.commands.keys());
      args = args[0].toLowerCase();

      if (commandNames.includes(args)) {
        for (const commandObject of commandList) {
          if (commandObject.name == args) {
            const displaySingleCommand = new Discord.MessageEmbed(
              displaySingleCommandEmbed(
                prefix + args,
                commandObject.description
              ).addFields({ name: "Usage:", value: commandObject.usage })
            );
            return message.channel.send(displaySingleCommand);
          }
        }
      } else {
        return message.channel.send("I could not recognise that command!");
      }
    }
  },
};
