const Discord = require("discord.js")
const client = new Discord.Client(
    { intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"] }
)

client.login("token")

client.on("ready", () => {
    console.log("Bot ONLINE")
})

client.on("messageCreate", (message) => {
    if (message.content == "!youtube") {
        message.channel.send("Iscriviti al mio secondo canale: https://www.youtube.com/channel/UCvIafNR8ZvZyE5jVGVqgVfA")
    }

    if (message.content == "!embed") {
        var embed = new Discord.MessageEmbed()
            .setTitle("Titolo embed")
            .setDescription(`${message.author.username} ha scritto il messaggio`)
            .setThumbnail("https://www.nonsprecare.it/wp-content/uploads/2017/03/come-parlano-alberi-significato-simbolico-1.jpg")

        message.channel.send({ embeds: [embed] })
    }
})