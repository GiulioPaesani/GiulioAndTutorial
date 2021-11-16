const Discord = require("discord.js")
const client = new Discord.Client(
    { intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"] }
)

client.login(process.env.token)

client.on("ready", () => {
    console.log("Bot ONLINE")
})

client.on("messageCreate", message => {
    if (message.content == "!comando") {
        message.channel.send("Ciao a tutti!")
    }

    if (message.content == "!ciao") {
        message.channel.send("ciao")
    }
})