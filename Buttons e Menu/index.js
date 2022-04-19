const Discord = require('discord.js');
const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]
})

client.login("token");

client.on("ready", () => {
    console.log("ONLINE");
})

client.on("messageCreate", message => {
    if (message.content == "!ciao") {
        let embed = new Discord.MessageEmbed()
            .setTitle("Ciao")

        let button1 = new Discord.MessageButton()
            .setLabel("Cliccami")
            .setStyle("SUCCESS")
            .setCustomId(`clickButton1,${message.author.id}`)

        let row = new Discord.MessageActionRow()
            .addComponents(button1)

        message.channel.send({ embeds: [embed], components: [row] })
    }

    if (message.content == "!help") {
        let embed = new Discord.MessageEmbed()
            .setTitle("Help")
            .setDescription("Seleziona la pagina con il menu qua sotto")

        let select = new Discord.MessageSelectMenu()
            .setCustomId("menuHelp")
            .setPlaceholder("Seleziona una pagina")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: "Pagina 1",
                    description: "Vai alla pagina numero 1",
                    value: "pagina1"
                },
                {
                    label: "Pagina 2",
                    description: "Vai alla pagina numero 2",
                    value: "pagina2"
                },
                {
                    label: "Pagina 3",
                    description: "Vai alla pagina numero 3",
                    value: "pagina3"
                }
            ])

        let row = new Discord.MessageActionRow()
            .addComponents(select)

        message.channel.send({ embeds: [embed], components: [row] })
    }
})

client.on("interactionCreate", interaction => {
    if (!interaction.isButton()) return

    if (interaction.customId.startsWith("clickButton1")) {
        let idUtente = interaction.customId.split(",")[1]
        if (interaction.user.id != idUtente) return interaction.reply({ content: "Questo bottone non è tuo", ephemeral: true })
        interaction.deferUpdate()

        client.channels.cache.get("idCanale").send("Ciao")
    }
})

client.on("interactionCreate", interaction => {
    if (!interaction.isSelectMenu()) return

    if (interaction.customId == "menuHelp") {
        interaction.deferUpdate()

        switch (interaction.values[0]) {
            case "pagina1": {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Pagina 1")

                interaction.message.edit({ embeds: [embed] })
            } break
            case "pagina2": {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Pagina 2")

                interaction.message.edit({ embeds: [embed] })
            } break
            case "pagina3": {
                let embed = new Discord.MessageEmbed()
                    .setTitle("Pagina 3")

                interaction.message.edit({ embeds: [embed] })
            } break
        }
    }
})