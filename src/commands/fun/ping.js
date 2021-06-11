const prefix = process.env.PREFIX;

module.exports = {
  name: "ping",
  category: "fun",
  description: "Pong.",
  usage: `\`${prefix}\`` + "`ping`",
  execute(message) {
    message.channel.send("Pong.");
  },
};
