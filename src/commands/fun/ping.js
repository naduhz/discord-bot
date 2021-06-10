module.exports = {
  name: "ping",
  category: "fun",
  description: "Pong.",
  execute(message) {
    message.channel.send("Pong.");
  },
};
