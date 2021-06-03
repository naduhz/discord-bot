module.exports = {
  joinVoiceChannel: async (message) => {
    const globalQueue = message.client.queue;
    const serverQueue = globalQueue.get(message.guild.id);

    try {
      const connection = await message.member.voice.channel.join();
      serverQueue.connection = connection;
    } catch (error) {
      console.error(error);
      globalQueue.delete(message.guild.id);
      return message.channel.send(error);
    }
  },
};
