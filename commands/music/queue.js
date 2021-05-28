const Discord = require('discord.js');

module.exports = {
    name: "queue",
    description: "Displays the queue.",
    async execute(message, args) {
        // Fetch globalqueue and serverqueue
        const globalQueue = message.client.queue;
        const serverQueue = globalQueue.get(message.guild.id);
        const dispatcher = serverQueue.dispatcher;

        // Check if serverQueue
        if (!serverQueue) {
            return message.channel.send("There is no server queue at the moment!")
        };

        // Send a message with the queue
        const currentVideoTime = msToTime(serverQueue.dispatcher.streamTime);
        function msToTime(duration) {
            let milliseconds = Math.floor((duration % 1000) / 100),
              seconds = Math.floor((duration / 1000) % 60),
              minutes = Math.floor((duration / (1000 * 60)) % 60),
              hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
          
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            
            if (hours > 0) {
            return hours + ":" + minutes + ":" + seconds;
          } else {
            return minutes + ":" + seconds;
          }}
        
        // Setting description
        if (serverQueue.songs[0].title.length > 40) {
            var description = `1  [${serverQueue.songs[0].title.substring(0, 37).replace(/\[/g, "\uFF3B").replace(/\]/g, "\uFF3D")}...](${serverQueue.songs[0].url}) - ${currentVideoTime} / ${serverQueue.songs[0].length}\n`;
        } else {
            var description = `1  [${serverQueue.songs[0].title.substring(0, 40).replace(/\[/g, "\uFF3B").replace(/\]/g, "\uFF3D")}](${serverQueue.songs[0].url}) - ${currentVideoTime} / ${serverQueue.songs[0].length}\n`;
        }

        if (serverQueue.songs.length > 1) {
            if (serverQueue.songs.length < 10) {
                for (i = 1; i < serverQueue.songs.length; i++) {
                    if (serverQueue.songs[i].title.length > 40) {
                        description += `${i+1}  [${serverQueue.songs[i].title.substring(0, 37).replace(/\[/g, "\uFF3B").replace(/\]/g, "\uFF3D")}...](${serverQueue.songs[i].url}) - ${serverQueue.songs[i].length}\n`
                    } else {
                        description += `${i+1}  [${serverQueue.songs[i].title.substring(0, 40).replace(/\[/g, "\uFF3B").replace(/\]/g, "\uFF3D")}](${serverQueue.songs[i].url}) - ${serverQueue.songs[i].length}\n`
                    }
                }
            }
            else {for (i = 1; i < 10; i++) {
                if (serverQueue.songs[i].title.length > 40) {
                    description += `${i+1}  [${serverQueue.songs[i].title.substring(0, 37).replace(/\[/g, "\uFF3B").replace(/\]/g, "\uFF3D")}...](${serverQueue.songs[i].url}) - ${serverQueue.songs[i].length}\n`
                } else {
                    description += `${i+1}  [${serverQueue.songs[i].title.substring(0, 40).replace(/\[/g, "\uFF3B").replace(/\]/g, "\uFF3D")}](${serverQueue.songs[i].url}) - ${serverQueue.songs[i].length}\n`
                }
            }}
        }

        const embed = new Discord.MessageEmbed()
                .setTitle(`${serverQueue.songs.length}  ${serverQueue.songs.length > 1 ? "tracks" : "track"} queued:`)
                .setColor(3447003)
                .setDescription(description)
                .setThumbnail(serverQueue.songs[0].thumbnail)
                .setFooter(serverQueue.songs.length > 10 ? "(showing first 10)" : "")
        return message.channel.send(embed);
            // TODO: and remove option
        
    }
}