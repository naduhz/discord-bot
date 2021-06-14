const prefix = process.env.PREFIX;

module.exports = {
  name: "clear",
  category: "chat management",
  description: "Clears up to 100 messages at a time.",
  usage: `\`${prefix}clear [user] <amount>\``,

  async execute(message, args) {
    if (message.mentions.members.size > 0) {
      const mentionedUserID = message.mentions.members.first().user.id;
      const filteredArgs = args.filter((argument) => {
        return !argument.startsWith("<@");
      });

      if (filteredArgs.length > 0) {
        const fetchedMessages = Array.from(
          await message.channel.messages.fetch({
            limit: 100,
          })
        );
        const filteredMessages = fetchedMessages
          .filter((message) => {
            return message[1].author.id == mentionedUserID;
          })
          .map((message) => {
            return message[1];
          });

        message.channel
          .bulkDelete(filteredMessages.slice(0, +filteredArgs[0]))
          .then((messages) => {
            if (messages.size < +filteredArgs[0]) {
              messages.size > 1
                ? message.channel
                    .send(
                      `I could only find and delete ${messages.size} messages!`
                    )
                    .then((message) => message.delete({ timeout: 3000 }))
                : message.channel
                    .send(
                      `I could only find and delete ${messages.size} message!`
                    )
                    .then((message) => message.delete({ timeout: 3000 }));
            } else {
              messages.size > 1
                ? message.channel
                    .send(`Deleted ${messages.size} messages!`)
                    .then((message) => message.delete({ timeout: 3000 }))
                : message.channel
                    .send(`Deleted ${messages.size} message!`)
                    .then((message) => message.delete({ timeout: 3000 }));
            }
          })
          .catch(console.error);
      } else {
        message.channel.send("I need a number of messages to delete!");
      }
    } else {
      if (args.length > 0) {
        const fetchedMessages = await message.channel.messages.fetch({
          limit: args[0],
        });
        message.channel
          .bulkDelete(fetchedMessages)
          .then((messages) => {
            messages.size > 1
              ? message.channel
                  .send(`Deleted ${messages.size} messages!`)
                  .then((message) => message.delete({ timeout: 3000 }))
              : message.channel
                  .send(`Deleted ${messages.size} message!`)
                  .then((message) => message.delete({ timeout: 3000 }));
          })
          .catch(console.error);
      } else {
        message.channel.send("I need a number of messages to delete!");
      }
    }
  },
};
