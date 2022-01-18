const Discord = require('discord.js');
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]
})

client.login("token");

client.on("ready", () => {
    console.log("ONLINE");
})

const ytch = require("yt-channel-info") //npm i yt-channel-info

//Messaggio classico
setInterval(() => {
    ytch.getChannelVideos("idCanaleYouTube", "newest").then(async response => {
        var idVideo = response.items[0]?.videoId
        if (!idVideo) return

        client.channels.cache.get("idCanale").messages.fetch()
            .then(messages => {
                var giaMandato = false;
                messages.forEach(msg => {
                    if (msg.content.includes(idVideo)) giaMandato = true;
                });

                if (!giaMandato) {
                    client.channels.cache.get("idCanale").send(`-- NUOVO VIDEO --
Ciao, è appena uscito un video su **${response.items[0].author}**
Andate a vedere "${response.items[0].title}"

https://www.youtu.be/${idVideo}`) //Importate non levare l'id del video
                }
            })
    })
}, 1000 * 30)

//EMBED
setInterval(() => {
    ytch.getChannelVideos("idCanaleYouTube", "newest").then(async response => {
        var idVideo = response.items[0]?.videoId
        if (!idVideo) return

        client.channels.cache.get("idCanale").messages.fetch()
            .then(messages => {
                var giaMandato = false;
                messages.forEach(msg => {
                    if (msg.embeds[0]?.url?.endsWith(idVideo)) giaMandato = true;
                });

                if (!giaMandato) {
                    var embed = new Discord.MessageEmbed()
                        .setTitle("Nuovo video")
                        .setURL(`https://youtu.be/${idVideo}`) //Importante non levarlo
                        .setThumbnail(response.items[0].videoThumbnails[3].url)
                        .setDescription(`Ciao, è appena uscito un video su **${response.items[0].author}**
Andate a vedere "${response.items[0].title}\"

[Ecco il video](https://youtu.be/${idVideo})`)

                    client.channels.cache.get('idCanale').send({ embeds: [embed] });
                }
            })
    })
}, 1000 * 30)