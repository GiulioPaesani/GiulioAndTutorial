const Discord = require('discord.js');
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]
})

client.login("token");

client.on("ready", () => {
    console.log("ONLINE");
})

client.on("messageCreate", async message => {
    if (message.content == "!transcript") {
        let chatLog = `-- CHAT LOG #${message.channel.name} --\n\n`

        let messages = await getAllMessages(message.channel)
        messages.reverse().forEach(msg => {
            chatLog += `@${msg.author.tag} ID: ${msg.author.id} - ${msg.createdAt.toLocaleString()}\n`

            if (msg.content) chatLog += `${msg.content}\n`

            if (msg.embeds[0]) {
                chatLog += `Embed:\n`
                if (msg.embeds[0].title) chatLog += `Title: ${msg.embeds[0].title}\n`
                if (msg.embeds[0].description) chatLog += `Description: ${msg.embeds[0].description}\n`
                if (msg.embeds[0].fields[0]) chatLog += `Fields: ${msg.embeds[0].fields.map(x => `${x.name}-${x.value}`).join(", ")}\n`
            }

            if (msg.attachments.size > 0)
                chatLog += `Files: ${msg.attachments.map(x => `${x.name} (${x.url})`).join(", ")}\n`

            if (msg.stickers.size > 0)
                chatLog += `Stickers: ${msg.stickers.map(x => `${x.name} (${x.url})`).join(", ")}\n`

            chatLog += "\n"
        })

        let attachment = new Discord.MessageAttachment(Buffer.from(chatLog, "utf-8"), `chatLog-channel-${message.channel.id}.txt`)

        let embed = new Discord.MessageEmbed()
            .setTitle("Transcript canale")
            .setDescription("Ecco il log di tutti i messaggi in questo canale")

        message.channel.send({ embeds: [embed], files: [attachment] })

        message.author.send({ embeds: [embed], files: [attachment] })
            .catch(() => { })
    }
})

const getAllMessages = async (channel) => {
    let allMessages = []
    let lastMessage

    while (true) {
        const options = { limit: 100 }
        if (lastMessage) options.before = lastMessage

        let messages = await channel.messages.fetch(options)

        allMessages = allMessages.concat(Array.from(messages.values()))

        lastMessage = messages.last().id

        if (messages.size != 100) {
            break
        }
    }

    return allMessages
}