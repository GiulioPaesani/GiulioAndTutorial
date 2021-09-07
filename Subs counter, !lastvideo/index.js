const Discord = require('discord.js');
const client = new Discord.Client(
    { intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"] }
);

client.login("token");

const ytch = require("yt-channel-info") //npm i yt-channel-info

client.on("ready", () => {
    console.log("ONLINE");
})

setInterval(function () {
    var canale = client.channels.cache.get("idCanaleCounter")
    ytch.getChannelInfo("idCanaleYoutube")
        .then(response => {
            canale.setName(`🧑Subscribers: ${response.subscriberCounter}`)
        })
}, 1000 * 60)

client.on("messageCreate", message => {
    if (message.content == "!lastvideo") {
        ytch.getChannelVideos("idCanaleYoutube")
            .then(response => {
                var embed = new Discord.MessageEmbed()
                    .setTitle("Last video")
                    .setDescription("Ultimo video uscito sul canale")
                    .addField("Title", response.items[0].title)
                    .addField("Link", "https://www.youtube.com/watch?v=" + response.items[0].videoId)
                    .addField("Views", response.items[0].viewCount.toString())
                    .addField("Duration", response.items[0].durationText)
                    .addField("Published", response.items[0].publishedText)
                    .setImage(response.items[0].videoThumbnails[3].url)

                message.channel.send({ embeds: [embed] })
            })
    }
})