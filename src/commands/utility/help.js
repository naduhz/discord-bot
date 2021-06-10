const { helpEmbed } = require("../../utils/embeds");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  category: "utility",
  description: "Displays help for commands.",

  async execute(message, args) {
    const commandNames = Array.from(message.client.commands.keys());
    const commandList = Array.from(message.client.commands.values());
    // for (let i = 0; i < commandList.length; i++) {
    //   console.log(commandList[i].name);
    //   const commandDictionary = {}
    // }

    if (args == "") {
      console.log(commandList);
      let fieldDescription = [];
      for (let i = 0; i < commandNames; i++) {
        const commandCategory = {
          name: commandCategoryName,
          value: "commands",
          inline: true,
        };
        fieldDescription.push(commandCategory);
      }
      const displayAllCommands = new Discord.MessageEmbed(
        helpEmbed("Kei Commands", "testing")
      ).addFields([fieldDescription]);
      message.channel.send(displayAllCommands);
    } else {
      //   if (args in commandList) {
      //     displayHelpSingleCommand;
      //   } else {
      //     // Send I could not recognise that command message
      //     return;
      //   }
    }
  },
};
