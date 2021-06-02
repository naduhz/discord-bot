module.exports = {
  createQueue: (message) => {
    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: message.member.voice.channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    return queueConstruct;
  },
};
