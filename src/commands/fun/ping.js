module.exports = {
  name: "ping",
  category: "fun",
  description: "Pong.",
  usage: "`kt!ping`",
  execute(message) {
    message.channel.send("Pong.");
  },
};
