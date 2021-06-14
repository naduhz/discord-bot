const prefix = process.env.prefix;

module.exports = {
  name: "clear",
  category: "chat management",
  description: "Clears a specified amount of messages.",
  usage: `\`${prefix}clear [user] <amount>\``,

  async execute(message, args) {
    if (message.mentions.members.size > 0) {
      const mentions = message.mentions.members.first();
      const filteredArgs = args.filter((argument) => {
        return !argument.startsWith("<@");
      });
      const fetchedMessages = await message.channel.messages.fetch({
        limit: filteredArgs[0],
      });
    } else {
      const fetchedMessages = await message.channel.messages.fetch({
        limit: args[0],
      });
    }
  },
};
